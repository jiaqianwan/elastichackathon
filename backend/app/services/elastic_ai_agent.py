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