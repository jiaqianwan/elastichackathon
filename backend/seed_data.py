# backend/reseed.py
from elasticsearch import Elasticsearch
import os
from dotenv import load_dotenv

load_dotenv()

es = Elasticsearch(
    hosts=[os.getenv("ELASTICSEARCH_URL")],
    api_key=os.getenv("ELASTICSEARCH_API_KEY")
)

def reseed():
    index_name = "items"
    
    if es.indices.exists(index=index_name):
        es.indices.delete(index=index_name)
        print("🗑️ Deleted old index.")

    settings = {
        "mappings": {
            "properties": {
                "name": {"type": "text"},
                "description": {"type": "text"},
                "school": {"type": "keyword"}, 
                "grade": {"type": "keyword"},
                "status": {"type": "keyword"},
                "co2_saved": {"type": "float"}
            }
        }
    }
    es.indices.create(index=index_name, body=settings)

    # Expanded inventory for a better demo
    sample_items = [
        {"name": "Professional Violin 4/4", "description": "Full size, well-maintained. Includes bow.", "school": "RI", "grade": "Grade A", "status": "available", "co2_saved": 15.0},
        {"name": "Fencing Mask", "description": "Standard competition grade. Sanitized.", "school": "HCI", "grade": "Grade B", "status": "available", "co2_saved": 5.2},
        {"name": "Scientific Calculator", "description": "Casio fx-97SG PLUS. Perfect for O-Levels.", "school": "NYP", "grade": "Grade A", "status": "available", "co2_saved": 0.8},
        {"name": "Acoustic Guitar", "description": "Yamaha F310. Great for beginners.", "school": "VJC", "grade": "Grade B", "status": "available", "co2_saved": 8.4},
        {"name": "Lab Coat (Size M)", "description": "Clean and only used for one semester.", "school": "ACJC", "grade": "Grade A", "status": "available", "co2_saved": 1.2},
        {"name": "Basketball", "description": "Spalding indoor ball. Still has good grip.", "school": "RI", "grade": "Grade B", "status": "available", "co2_saved": 2.1},
        {"name": "Oboe Reeds Set", "description": "Unopened pack of 3. High quality.", "school": "HCI", "grade": "Grade A", "status": "available", "co2_saved": 0.3},
        {"name": "Tennis Racket", "description": "Wilson Pro Staff. Needs restringing.", "school": "NYP", "grade": "Grade B", "status": "available", "co2_saved": 3.5},
        {"name": "Drawing Tablet", "description": "Wacom Intuos. No scratches, includes pen.", "school": "VJC", "grade": "Grade A", "status": "available", "co2_saved": 4.0},
        {"name": "School Blazer", "description": "Official RI blazer, fits height 170cm.", "school": "RI", "grade": "Grade A", "status": "available", "co2_saved": 2.5}
    ]

    for i, item in enumerate(sample_items):
        es.index(index=index_name, id=f"seed_{i}", document=item)
    
    es.indices.refresh(index=index_name)
    print(f"✅ Successfully seeded {len(sample_items)} items!")

if __name__ == "__main__":
    reseed()