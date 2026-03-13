from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from app.services.elastic_ai_agent import grade_item_with_elastic_agent
from app.db.elasticsearch import es_client
from datetime import datetime
import logging
import base64

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/grade")
async def grade_donation(
    file: UploadFile = File(...),
    name: str = Form(...),
    school: str = Form(...),
    description: str = Form(None)
):
    """
    Receives an image, grades it, stores image, and indexes item
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
        
        # Grade using AI
        grading_result = await grade_item_with_elastic_agent(image_bytes, file.filename)
        
        # Only accept Grade A and Grade B items
        if grading_result['grade'] == 'Rejected':
            return {
                **grading_result,
                "status": "rejected",
                "message": "Item does not meet quality standards for donation"
            }
        
        # Convert image to base64 for storage in Elasticsearch
        image_base64 = base64.b64encode(image_bytes).decode('utf-8')
        
        # Store in items index (for Request page to search)
        item_doc = {
            "name": name,
            "description": description or grading_result['feedback'],
            "school": school,
            "grade": grading_result["grade"],
            "status": "available",
            "co2_saved": grading_result["co2_saved"],
            "category": grading_result["category"],
            "condition": grading_result["condition"],
            "quality_score": grading_result["quality_score"],
            "dignity_check": grading_result["dignity_check"],
            "filename": file.filename,
            "image_data": image_base64,  # Store base64 image
            "image_type": file.content_type,
            "created_at": datetime.utcnow().isoformat(),
            "grading_method": grading_result.get("grading_method", "demo")
        }
        
        # Index to items (searchable by Request page)
        es_response = es_client.index(
            index="items",
            document=item_doc
        )
        
        # Refresh index to make it immediately searchable
        es_client.indices.refresh(index="items")
        
        logger.info(f"✅ Item listed with image: {es_response['_id']}")
        
        return {
            **grading_result,
            "donation_id": es_response["_id"],
            "item_name": name,
            "school": school,
            "has_image": True,
            "status": "success",
            "message": "Item successfully listed and available for requests!"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Grading failed: {e}", exc_info=True)
        raise HTTPException(500, f"Processing failed: {str(e)}")