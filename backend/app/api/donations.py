from fastapi import APIRouter, File, UploadFile, HTTPException, Form
from app.services.elastic_ai_agent import grade_item_with_elastic_agent
from app.db.elasticsearch import es_client
from datetime import datetime
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/grade")
async def grade_donation(
    file: UploadFile = File(...),
    name: str = Form(...),
    school: str = Form(...),
    description: str = Form("")
):
    try:
        if not file.content_type or not file.content_type.startswith('image/'):
            raise HTTPException(400, "File must be an image")
        
        image_bytes = await file.read()
        
        # Grade using Elastic AI Agent
        grading_result = await grade_item_with_elastic_agent(image_bytes, file.filename)
        
        # Store in Elasticsearch with user-provided fields
        doc = {
            "item_name": name,
            "school": school,
            "description": description,
            "filename": file.filename,
            "timestamp": datetime.utcnow().isoformat(),
            "grade": grading_result["grade"],
            "condition": grading_result["condition"],
            "category": grading_result["category"],
            "quality_score": grading_result["quality_score"],
            "co2_saved": grading_result["co2_saved"],
            "feedback": grading_result["feedback"],
            "status": "available"
        }
        
        es_response = es_client.index(
            index="donations",
            document=doc
        )
        
        logger.info(f"✅ Stored donation: {es_response['_id']}")
        
        return {
            **grading_result,
            "donation_id": es_response["_id"],
            "status": "success"
        }
        
    except Exception as e:
        logger.error(f"Grading failed: {e}")
        raise HTTPException(500, f"Processing failed: {str(e)}")