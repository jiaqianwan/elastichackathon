import os
from elasticsearch import Elasticsearch
from dotenv import load_dotenv
import base64
import json
from typing import Dict, Optional
from fastapi import HTTPException
import logging

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

# Initialize Elasticsearch client
es_client = Elasticsearch(
    hosts=[os.getenv('ELASTICSEARCH_URL')],
    api_key=os.getenv('ELASTICSEARCH_API_KEY')
)

# Configuration
AGENT_ID = "secondhandhero_itemgrader"
USE_AI_ASSISTANT = os.getenv('USE_AI_ASSISTANT', 'false').lower() == 'true'

async def grade_item_with_elastic_agent(image_bytes: bytes, filename: str) -> Dict:
    """
    Grade item quality using Elastic AI Assistant or demo logic
    
    Args:
        image_bytes: Raw image bytes
        filename: Original filename
    
    Returns:
        Dict with grading results
    """
    try:
        file_size_kb = len(image_bytes) / 1024
        logger.info(f"Processing: {filename} ({file_size_kb:.2f}KB)")
        
        # Validate file size (10MB max)
        if len(image_bytes) > 10 * 1024 * 1024:
            raise HTTPException(400, "File too large. Maximum 10MB")
        
        # Use AI Assistant if enabled, otherwise use demo logic
        if USE_AI_ASSISTANT:
            result = await _grade_with_ai_agent(image_bytes, filename)
        else:
            result = _get_demo_grading(filename)
        
        logger.info(f"✅ Grading complete: {result['grade']} - {result['condition']}")
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Grading error: {e}", exc_info=True)
        # Fallback to demo grading on error
        logger.warning("Falling back to demo grading")
        return _get_demo_grading(filename)

async def _grade_with_ai_agent(image_bytes: bytes, filename: str) -> Dict:
    """Use your secondhandhero_itemgrader agent to grade the item"""
    try:
        # Encode image to base64
        image_base64 = base64.b64encode(image_bytes).decode('utf-8')
        
        # Create prompt for your agent
        prompt = f"""
Please analyze this school equipment donation image and grade its quality.

The image is: {filename}

Provide a JSON response with:
- grade: "Grade A", "Grade B", or "Rejected"
- condition: "Like New", "Gently Used", "Well Used", or "Poor"
- category: type of item (Backpack, Shoes, Uniform, Stationery, Sports Equipment, Musical Instruments, Other)
- quality_score: number from 1-10
- co2_saved: estimated kg of CO2 saved by reusing this item
- dignity_check: true if clean enough for a student to use with pride, false otherwise
- feedback: brief explanation of your grading decision
- acceptance_reason: why this item is or isn't suitable for donation

Image data (base64): {image_base64[:100]}... [truncated]
"""
        
        logger.info(f"Calling agent '{AGENT_ID}'...")
        
        # Execute the agent using Elastic AI Assistant API
        response = es_client.perform_request(
            method='POST',
            path='/_inference/inference',
            body={
                "input": prompt,
                "task_settings": {
                    "agent_id": AGENT_ID
                }
            }
        )
        
        logger.info(f"Agent response received")
        
        # Extract the agent's output
        agent_output = response.get('output', '')
        
        if not agent_output:
            raise ValueError("No output from agent")
        
        logger.info(f"Agent output: {agent_output[:200]}...")
        
        # Parse and validate the response
        result = _parse_agent_response(agent_output)
        result['grading_method'] = 'elastic_ai_agent'
        result['agent_id'] = AGENT_ID
        
        return result
        
    except Exception as e:
        logger.error(f"AI Agent error: {e}", exc_info=True)
        raise

def _parse_agent_response(content: str) -> Dict:
    """Parse and validate AI Agent response"""
    try:
        # Extract JSON from response (handle markdown code blocks)
        json_str = content
        
        if '```json' in content:
            start = content.find('```json') + 7
            end = content.find('```', start)
            json_str = content[start:end].strip()
        elif '```' in content:
            start = content.find('```') + 3
            end = content.find('```', start)
            json_str = content[start:end].strip()
        elif '{' in content and '}' in content:
            start = content.find('{')
            end = content.rfind('}') + 1
            json_str = content[start:end]
        
        result = json.loads(json_str)
        
        # Validate and normalize fields
        return {
            'grade': _validate_grade(result.get('grade')),
            'condition': _validate_condition(result.get('condition')),
            'category': result.get('category', 'School Equipment'),
            'quality_score': _validate_score(result.get('quality_score')),
            'co2_saved': _validate_co2(result.get('co2_saved')),
            'dignity_check': bool(result.get('dignity_check', True)),
            'feedback': result.get('feedback', 'Item has been evaluated by AI'),
            'acceptance_reason': result.get('acceptance_reason', 'Suitable for donation')
        }
        
    except Exception as e:
        logger.error(f"Failed to parse agent response: {e}")
        raise ValueError(f"Invalid agent response format: {e}")

def _get_demo_grading(filename: str) -> Dict:
    """Return demo grading response (for testing without AI)"""
    # Simple heuristic based on filename for demo variety
    filename_lower = filename.lower()
    
    # Determine category from filename
    if any(word in filename_lower for word in ['bag', 'backpack', 'rucksack']):
        category, co2 = 'Backpack', 10.0
    elif any(word in filename_lower for word in ['shoe', 'sneaker', 'boot']):
        category, co2 = 'Shoes', 12.5
    elif any(word in filename_lower for word in ['uniform', 'shirt', 'pants', 'blazer']):
        category, co2 = 'Uniform', 6.5
    elif any(word in filename_lower for word in ['calculator', 'pen', 'pencil', 'notebook']):
        category, co2 = 'Stationery', 2.0
    elif any(word in filename_lower for word in ['ball', 'racket', 'sports']):
        category, co2 = 'Sports Equipment', 8.0
    elif any(word in filename_lower for word in ['violin', 'guitar', 'instrument']):
        category, co2 = 'Musical Instruments', 15.0
    else:
        category, co2 = 'School Equipment', 5.2
    
    # Determine grade from filename hints
    if any(word in filename_lower for word in ['new', 'mint', 'excellent', 'pristine']):
        grade, condition, score = 'Grade A', 'Like New', 9
        feedback = 'Excellent condition - minimal wear, clean and ready for immediate use.'
    elif any(word in filename_lower for word in ['poor', 'damaged', 'torn', 'stained']):
        grade, condition, score = 'Rejected', 'Poor', 3
        feedback = 'Not suitable for donation - shows significant wear or damage.'
    else:
        grade, condition, score = 'Grade B', 'Gently Used', 7
        feedback = 'Good condition with some signs of use, but fully functional and clean.'
    
    return {
        'grade': grade,
        'condition': condition,
        'category': category,
        'quality_score': score,
        'co2_saved': co2,
        'dignity_check': grade != 'Rejected',
        'feedback': feedback,
        'acceptance_reason': 'Suitable for student use based on visual inspection.' if grade != 'Rejected' else 'Does not meet quality standards for donation.',
        'grading_method': 'demo',
        'agent_id': 'demo_fallback'
    }

def _validate_grade(grade: Optional[str]) -> str:
    """Validate and normalize grade"""
    valid_grades = ['Grade A', 'Grade B', 'Rejected']
    if grade in valid_grades:
        return grade
    # Try to normalize common variations
    if grade and 'A' in grade.upper():
        return 'Grade A'
    if grade and 'B' in grade.upper():
        return 'Grade B'
    if grade and any(word in grade.lower() for word in ['reject', 'fail', 'poor']):
        return 'Rejected'
    return 'Grade B'

def _validate_condition(condition: Optional[str]) -> str:
    """Validate and normalize condition"""
    valid_conditions = ['Like New', 'Gently Used', 'Well Used', 'Poor']
    if condition in valid_conditions:
        return condition
    # Try to normalize common variations
    if condition:
        condition_lower = condition.lower()
        if 'new' in condition_lower or 'excellent' in condition_lower:
            return 'Like New'
        if 'gently' in condition_lower or 'good' in condition_lower:
            return 'Gently Used'
        if 'well' in condition_lower or 'fair' in condition_lower:
            return 'Well Used'
        if 'poor' in condition_lower or 'bad' in condition_lower:
            return 'Poor'
    return 'Gently Used'

def _validate_score(score: Optional[int]) -> int:
    """Validate quality score (1-10)"""
    try:
        score = int(score)
        return max(1, min(10, score))
    except (TypeError, ValueError):
        return 7

def _validate_co2(co2: Optional[float]) -> float:
    """Validate CO2 savings"""
    try:
        co2 = float(co2)
        return round(max(0.0, min(50.0, co2)), 2)  # Cap at 50kg, round to 2 decimals
    except (TypeError, ValueError):
        return 5.2

def check_ai_agent_health() -> Dict:
    """Check if your AI agent is available"""
    try:
        # Try to get agent info
        response = es_client.perform_request(
            method='GET',
            path=f'/_inference/{AGENT_ID}'
        )
        return {
            'available': True,
            'enabled': USE_AI_ASSISTANT,
            'agent_id': AGENT_ID,
            'status': 'healthy'
        }
    except Exception as e:
        logger.warning(f"AI Agent '{AGENT_ID}' unavailable: {e}")
        return {
            'available': False,
            'enabled': USE_AI_ASSISTANT,
            'agent_id': AGENT_ID,
            'status': 'unavailable',
            'error': str(e)
        }