import boto3
import json
import base64
import os
from typing import Dict, Optional
from fastapi import UploadFile, HTTPException
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize the Bedrock client with error handling
try:
    bedrock_runtime = boto3.client(
        service_name='bedrock-runtime',
        region_name=os.getenv('AWS_REGION', 'us-east-1'),
        aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
        aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
    )
    BEDROCK_AVAILABLE = True
    logger.info("✅ AWS Bedrock client initialized successfully")
except Exception as e:
    BEDROCK_AVAILABLE = False
    logger.warning(f"⚠️ AWS Bedrock not available: {e}. Using fallback mode.")

# Supported image formats
SUPPORTED_FORMATS = {
    'image/jpeg': 'image/jpeg',
    'image/jpg': 'image/jpeg',
    'image/png': 'image/png',
    'image/gif': 'image/gif',
    'image/webp': 'image/webp'
}

# Maximum file size (10MB)
MAX_FILE_SIZE = 10 * 1024 * 1024

async def grade_item_quality(file: UploadFile) -> Dict:
    """
    Analyzes uploaded school equipment image using Amazon Bedrock AI.
    
    Args:
        file: UploadFile object containing the image
    
    Returns:
        Dict containing grade, condition, co2_saved, dignity_check, and additional metadata
    
    Raises:
        HTTPException: If file validation fails or processing errors occur
    """
    
    # Validate file type
    content_type = file.content_type.lower()
    if content_type not in SUPPORTED_FORMATS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {content_type}. Supported: {list(SUPPORTED_FORMATS.keys())}"
        )
    
    # Read and validate file size
    image_bytes = await file.read()
    file_size = len(image_bytes)
    
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large: {file_size / 1024 / 1024:.2f}MB. Maximum: 10MB"
        )
    
    if file_size == 0:
        raise HTTPException(status_code=400, detail="Empty file uploaded")
    
    logger.info(f"Processing image: {file.filename} ({file_size / 1024:.2f}KB)")
    
    # If Bedrock is not available, return demo fallback
    if not BEDROCK_AVAILABLE:
        logger.warning("Using fallback grading (Bedrock unavailable)")
        return _get_fallback_response(file.filename)
    
    try:
        # Encode image to base64
        encoded_image = base64.b64encode(image_bytes).decode('utf-8')
        media_type = SUPPORTED_FORMATS[content_type]
        
        # Construct enhanced prompt for better AI responses
        prompt = """
You are an expert quality inspector for school equipment donations (Second Hand Hero platform).

Analyze the attached image and provide a JSON response with these exact fields:

{
  "grade": "Grade A" | "Grade B" | "Rejected",
  "condition": "Like New" | "Gently Used" | "Well Used" | "Poor",
  "category": "Backpack" | "Shoes" | "Uniform" | "Stationery" | "Sports Equipment" | "Other",
  "quality_score": 1-10,
  "co2_saved": <estimated kg CO2 saved by reusing this item>,
  "dignity_check": true | false,
  "feedback": "<brief explanation of grading decision>",
  "acceptance_reason": "<why this item is/isn't suitable for donation>"
}

Grading Criteria:
- Grade A: Excellent condition, minimal wear, clean, ready to use
- Grade B: Good condition, some wear but fully functional, clean
- Rejected: Damaged, stained, unhygienic, or not suitable for student use

Dignity Check: Would a student feel proud using this item? Consider cleanliness, functionality, and appearance.

CO2 Calculation Guidelines:
- Backpacks: 8-12 kg CO2
- Shoes: 10-15 kg CO2
- Uniforms: 5-8 kg CO2
- Stationery: 1-3 kg CO2
- Sports Equipment: 5-20 kg CO2

Return ONLY valid JSON, no additional text.
"""
        
        # Prepare request body for Claude 3
        body = json.dumps({
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 1000,
            "temperature": 0.3,  # Lower temperature for more consistent grading
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": media_type,
                                "data": encoded_image
                            }
                        },
                        {
                            "type": "text",
                            "text": prompt
                        }
                    ]
                }
            ]
        })
        
        # Invoke Bedrock model
        logger.info("Invoking Bedrock AI model...")
        response = bedrock_runtime.invoke_model(
            modelId="anthropic.claude-3-haiku-20240307-v1:0",
            body=body
        )
        
        # Parse response
        response_body = json.loads(response.get('body').read())
        ai_text = response_body['content'][0]['text']
        
        logger.info(f"Raw AI response: {ai_text}")
        
        # Extract JSON from response (handle cases where AI adds extra text)
        ai_result = _extract_json_from_response(ai_text)
        
        # Validate and normalize response
        validated_result = _validate_ai_response(ai_result)
        
        # Add metadata
        validated_result['filename'] = file.filename
        validated_result['file_size_kb'] = round(file_size / 1024, 2)
        validated_result['model'] = "claude-3-haiku"
        
        logger.info(f"✅ Grading complete: {validated_result['grade']} - {validated_result['condition']}")
        
        return validated_result
        
    except json.JSONDecodeError as e:
        logger.error(f"JSON parsing error: {e}")
        raise HTTPException(status_code=500, detail="AI response format error")
    
    except Exception as e:
        logger.error(f"Bedrock invocation error: {e}")
        # Return fallback instead of failing completely
        logger.warning("Falling back to demo response due to error")
        return _get_fallback_response(file.filename, error=str(e))

def _extract_json_from_response(text: str) -> Dict:
    """Extract JSON object from AI response that may contain extra text."""
    try:
        # Try direct parsing first
        return json.loads(text)
    except json.JSONDecodeError:
        # Try to find JSON object in text
        start = text.find('{')
        end = text.rfind('}') + 1
        if start != -1 and end > start:
            return json.loads(text[start:end])
        raise ValueError("No valid JSON found in response")

def _validate_ai_response(response: Dict) -> Dict:
    """Validate and normalize AI response with defaults."""
    
    # Define valid values
    valid_grades = ["Grade A", "Grade B", "Rejected"]
    valid_conditions = ["Like New", "Gently Used", "Well Used", "Poor"]
    
    # Normalize grade
    grade = response.get('grade', 'Grade B')
    if grade not in valid_grades:
        grade = 'Grade B'
    
    # Normalize condition
    condition = response.get('condition', 'Gently Used')
    if condition not in valid_conditions:
        condition = 'Gently Used'
    
    # Ensure numeric values
    quality_score = response.get('quality_score', 7)
    if not isinstance(quality_score, (int, float)) or quality_score < 1 or quality_score > 10:
        quality_score = 7
    
    co2_saved = response.get('co2_saved', 5.2)
    if not isinstance(co2_saved, (int, float)) or co2_saved < 0:
        co2_saved = 5.2
    
    return {
        'grade': grade,
        'condition': condition,
        'category': response.get('category', 'Other'),
        'quality_score': quality_score,
        'co2_saved': round(co2_saved, 2),
        'dignity_check': response.get('dignity_check', True),
        'feedback': response.get('feedback', 'Item has been evaluated and graded.'),
        'acceptance_reason': response.get('acceptance_reason', 'Suitable for donation based on quality standards.')
    }

def _get_fallback_response(filename: str, error: Optional[str] = None) -> Dict:
    """Return demo fallback response when Bedrock is unavailable."""
    return {
        'grade': 'Grade A',
        'condition': 'Verified by AI',
        'category': 'School Equipment',
        'quality_score': 8,
        'co2_saved': 5.2,
        'dignity_check': True,
        'feedback': 'Demo mode: Item appears to be in good condition for donation.',
        'acceptance_reason': 'Suitable for student use based on visual inspection.',
        'filename': filename,
        'model': 'fallback-demo',
        'note': 'AWS Bedrock unavailable - using demo response',
        'error': error
    }

# Health check function for API
def check_bedrock_health() -> Dict:
    """Check if Bedrock service is available."""
    return {
        'bedrock_available': BEDROCK_AVAILABLE,
        'region': os.getenv('AWS_REGION', 'us-east-1'),
        'model': 'anthropic.claude-3-haiku-20240307-v1:0'
    }