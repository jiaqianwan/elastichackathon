from fastapi import APIRouter
from app.services.qr_generator import generate_pickup_qr

router = APIRouter()

@router.post("/request/{item_id}")
async def request_item(item_id: str, user_id: str = "student_123"):
    # Trigger QR code generation [cite: 39]
    qr_code_base64 = generate_pickup_qr(item_id, user_id)
    
    return {
        "status": "Success",
        "message": "Item reserved privately.",
        "qr_code": qr_code_base64
    }