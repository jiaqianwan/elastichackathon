from fastapi import APIRouter, File, UploadFile, HTTPException
from app.services.elastic_ai_agent import grade_item_with_elastic_agent
from app.db.elasticsearch import es_client
from datetime import datetime
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/grade")
async def grade_donation(file: UploadFile = File(...)):
    """
    Receives an image and grades it using Elastic AI Assistant
    """
    try:
        # Validate file type
        if not file.content_type or not file.content_type.startswith('image/'):
            raise HTTPException(400, "File must be an image")
        
        # Read image bytes
        image_bytes = await file.read()
        
        # Validate file size (10MB max)
        if len(image_bytes) > 10 * 1024 * 1024:
            raise HTTPException(400, "File too large. Maximum 10MB")
        
        logger.info(f"Processing: {file.filename} ({len(image_bytes)/1024:.2f}KB)")
        
        # Grade using Elastic AI Assistant (pass bytes and filename separately)
        grading_result = await grade_item_with_elastic_agent(image_bytes, file.filename)
        
        # Store in Elasticsearch
        doc = {
            "filename": file.filename,
            "timestamp": datetime.utcnow().isoformat(),
            "grade": grading_result["grade"],
            "condition": grading_result["condition"],
            "category": grading_result["category"],
            "quality_score": grading_result["quality_score"],
            "co2_saved": grading_result["co2_saved"],
            "dignity_check": grading_result["dignity_check"],
            "feedback": grading_result["feedback"],
            "acceptance_reason": grading_result["acceptance_reason"],
            "grading_method": grading_result.get("grading_method", "demo"),
            "agent_id": grading_result.get("agent_id", "unknown")
        }
        
        es_response = es_client.index(
            index="donations",
            document=doc
        )
        
        logger.info(f"✅ Stored donation: {es_response['_id']}")
        
        return {
            **grading_result,
            "donation_id": es_response["_id"],
            "filename": file.filename,
            "status": "success"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Grading failed: {e}", exc_info=True)
        raise HTTPException(500, f"Processing failed: {str(e)}")