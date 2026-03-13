from app.db.elasticsearch import es_client
import logging
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def reseed_items():
    """Reseed the items index with sample data"""
    index_name = "items"

    if es_client.indices.exists(index=index_name):
        es_client.indices.delete(index=index_name)
        logger.info("🗑️ Deleted old items index")

    mappings = {
        "mappings": {
            "properties": {
                "name":        {"type": "text"},
                "description": {"type": "text"},
                "category":    {"type": "keyword"},  # used by matching engine
                "school":      {"type": "keyword"},
                "grade":       {"type": "keyword"},
                "status":      {"type": "keyword"},  # available | reserved | collected
                "co2_saved":   {"type": "float"},
                "created_at":  {"type": "date"},
            }
        }
    }
    es_client.indices.create(index=index_name, body=mappings)
    logger.info("📦 Created new items index")

    # NOTE: category values must match what the matching engine filters on
    # Valid categories: Fencing, Sports, Instrument, Uniform, Stationery, Electronics, Backpack, Shoes
    sample_items = [
        {"name": "Professional Violin 4/4",  "category": "Instrument",   "description": "Full size, well-maintained. Includes bow.",        "school": "RI",   "grade": "Grade A", "status": "available", "co2_saved": 15.0},
        {"name": "Fencing Mask",             "category": "Fencing",      "description": "Standard competition grade. Sanitized.",            "school": "HCI",  "grade": "Grade B", "status": "available", "co2_saved": 5.2},
        {"name": "Scientific Calculator",    "category": "Stationery",   "description": "Casio fx-97SG PLUS. Perfect for O-Levels.",         "school": "NYP",  "grade": "Grade A", "status": "available", "co2_saved": 0.8},
        {"name": "Acoustic Guitar",          "category": "Instrument",   "description": "Yamaha F310. Great for beginners.",                  "school": "VJC",  "grade": "Grade B", "status": "available", "co2_saved": 8.4},
        {"name": "Lab Coat (Size M)",        "category": "Uniform",      "description": "Clean and only used for one semester.",              "school": "ACJC", "grade": "Grade A", "status": "available", "co2_saved": 1.2},
        {"name": "Basketball",               "category": "Sports",       "description": "Spalding indoor ball. Still has good grip.",          "school": "RI",   "grade": "Grade B", "status": "available", "co2_saved": 2.1},
        {"name": "Oboe Reeds Set",           "category": "Instrument",   "description": "Unopened pack of 3. High quality.",                  "school": "HCI",  "grade": "Grade A", "status": "available", "co2_saved": 0.3},
        {"name": "Tennis Racket",            "category": "Sports",       "description": "Wilson Pro Staff. Needs restringing.",               "school": "NYP",  "grade": "Grade B", "status": "available", "co2_saved": 3.5},
        {"name": "Drawing Tablet",           "category": "Electronics",  "description": "Wacom Intuos. No scratches, includes pen.",           "school": "VJC",  "grade": "Grade A", "status": "available", "co2_saved": 4.0},
        {"name": "School Blazer",            "category": "Uniform",      "description": "Official RI blazer, fits height 170cm.",             "school": "RI",   "grade": "Grade A", "status": "available", "co2_saved": 2.5},
        {"name": "Backpack",                 "category": "Backpack",     "description": "JanSport classic. Barely used, all zippers work.",   "school": "HCI",  "grade": "Grade A", "status": "available", "co2_saved": 10.0},
        {"name": "Running Shoes (Size 9)",   "category": "Shoes",        "description": "Nike Air Zoom. Good condition.",                     "school": "NYP",  "grade": "Grade B", "status": "available", "co2_saved": 12.5},
        {"name": "Fencing Foil",             "category": "Fencing",      "description": "Leon Paul electric foil. 1 season old.",             "school": "RI",   "grade": "Grade A", "status": "available", "co2_saved": 6.1},
        {"name": "Badminton Racket",         "category": "Sports",       "description": "Yonex Astrox 77. Restrung 6 months ago.",            "school": "HCI",  "grade": "Grade B", "status": "available", "co2_saved": 3.0},
    ]

    for i, item in enumerate(sample_items):
        item['created_at'] = datetime.utcnow().isoformat()
        es_client.index(index=index_name, id=f"seed_{i}", document=item)

    es_client.indices.refresh(index=index_name)
    logger.info(f"✅ Successfully seeded {len(sample_items)} items!")


def reseed_requests():
    """Seed sample student requests"""
    index_name = "requests"

    if es_client.indices.exists(index=index_name):
        es_client.indices.delete(index=index_name)
        logger.info("🗑️ Deleted old requests index")

    mappings = {
        "mappings": {
            "properties": {
                "student_id":   {"type": "keyword"},
                "student_name": {"type": "text"},
                "school":       {"type": "keyword"},
                "category":     {"type": "keyword"},
                "description":  {"type": "text"},
                "urgency":      {"type": "keyword"},
                "status":       {"type": "keyword"},
                "created_at":   {"type": "date"},
            }
        }
    }
    es_client.indices.create(index=index_name, body=mappings)

    sample_requests = [
        {"student_id": "S001", "student_name": "Ahmad",    "school": "RI",  "category": "Instrument", "description": "Need violin for school orchestra",       "urgency": "high",   "status": "pending"},
        {"student_id": "S002", "student_name": "Mei Ling", "school": "HCI", "category": "Sports",     "description": "Looking for tennis racket",              "urgency": "normal", "status": "pending"},
        {"student_id": "S003", "student_name": "Raj",      "school": "NYP", "category": "Stationery", "description": "Need scientific calculator for exams",   "urgency": "high",   "status": "pending"},
    ]

    for i, req in enumerate(sample_requests):
        req['created_at'] = datetime.utcnow().isoformat()
        es_client.index(index=index_name, id=f"req_{i}", document=req)

    es_client.indices.refresh(index=index_name)
    logger.info(f"✅ Successfully seeded {len(sample_requests)} requests!")


def reseed_matching_indices():
    """Clear matching indices so they start fresh"""
    for index_name in ["item_requests", "matches", "lockers"]:
        if es_client.indices.exists(index=index_name):
            es_client.indices.delete(index=index_name)
            logger.info(f"🗑️ Deleted old '{index_name}' index")
    logger.info("ℹ️  Matching indices will be recreated on next server startup")


def reseed_all():
    """Reseed all indices"""
    logger.info("🌱 Starting reseed process...")
    reseed_items()
    reseed_requests()
    reseed_matching_indices()
    logger.info("🎉 Reseed complete! Start the server to recreate matching indices.")


if __name__ == "__main__":
    reseed_all()