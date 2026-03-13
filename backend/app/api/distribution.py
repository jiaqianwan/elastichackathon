from fastapi import APIRouter
from app.services.qr_generator import generate_pickup_qr
from elasticsearch import Elasticsearch
import os
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

router = APIRouter()

es = Elasticsearch(
    hosts=[os.getenv("ELASTICSEARCH_URL")],
    api_key=os.getenv("ELASTICSEARCH_API_KEY")
)

LOCKERS_INDEX = "lockers"
MATCHES_INDEX = "matches"

def setup_lockers_index():
    if not es.indices.exists(index=LOCKERS_INDEX):
        es.indices.create(index=LOCKERS_INDEX, body={
            "mappings": {
                "properties": {
                    "locker":      {"type": "keyword"},
                    "item_id":     {"type": "keyword"},
                    "user_id":     {"type": "keyword"},
                    "status":      {"type": "keyword"},
                    "reserved_at": {"type": "date"},
                }
            }
        })
        print("✅ Created index: lockers")

def get_occupied_lockers() -> list:
    try:
        result = es.search(
            index=LOCKERS_INDEX,
            query={"term": {"status": "occupied"}},
            size=100
        )
        return [hit["_source"]["locker"] for hit in result["hits"]["hits"]]
    except Exception:
        return []

@router.get("/lockers")
async def list_lockers():
    occupied = get_occupied_lockers()
    return {"occupied_lockers": occupied}

@router.post("/request/{item_id}")
async def request_item(item_id: str, user_id: str = "student_123", locker: str = "12"):
    setup_lockers_index()

    # Check if locker is already occupied
    occupied = get_occupied_lockers()
    if locker in occupied:
        return {"status": "Error", "message": f"Locker #{locker} is already taken. Please choose another."}

    # Generate QR code
    qr_code_base64 = generate_pickup_qr(item_id, user_id, locker)

    # Mark locker as occupied
    es.index(index=LOCKERS_INDEX, id=f"locker_{locker}", document={
        "locker":      locker,
        "item_id":     item_id,
        "user_id":     user_id,
        "status":      "occupied",
        "reserved_at": datetime.utcnow().isoformat(),
    })

    # ── Save locker + QR to the match record so it survives page refresh ──
    try:
        result = es.search(
            index=MATCHES_INDEX,
            query={"bool": {"filter": [
                {"term": {"item_id": item_id}},
                {"term": {"recipient_id": user_id}},
            ]}},
            size=1
        )
        hits = result["hits"]["hits"]
        if hits:
            match_id = hits[0]["_id"]
            es.update(index=MATCHES_INDEX, id=match_id, body={"doc": {
                "locker":   locker,
                "qr_code":  qr_code_base64,
            }})
    except Exception as e:
        print(f"⚠️ Could not save locker to match: {e}")

    es.indices.refresh(index=LOCKERS_INDEX)
    es.indices.refresh(index=MATCHES_INDEX)

    return {
        "status":   "Success",
        "message":  f"Locker #{locker} reserved for you.",
        "qr_code":  qr_code_base64,
        "locker":   locker,
    }

@router.post("/collect/{item_id}")
async def mark_collected(item_id: str, locker: str):
    try:
        es.update(index=LOCKERS_INDEX, id=f"locker_{locker}", body={"doc": {"status": "available"}})
        es.indices.refresh(index=LOCKERS_INDEX)
        return {"status": "Success", "message": f"Locker #{locker} is now available again."}
    except Exception as e:
        return {"status": "Error", "message": str(e)}