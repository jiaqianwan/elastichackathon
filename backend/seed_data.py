import os
from elasticsearch import Elasticsearch, helpers
from dotenv import load_dotenv

# Load credentials from your .env file
load_dotenv()

# Securely connect to your Singapore Cloud Instance
es = Elasticsearch(
    hosts=[os.getenv("ELASTICSEARCH_URL")],
    api_key=os.getenv("ELASTICSEARCH_API_KEY")
)

# Dummy data tailored for a school community platform
dummy_items = [
    {
        "name": "Standard Violin 4/4",
        "description": "Used for 2 years in school orchestra. Well-maintained strings.",
        "school": "RI",
        "category": "Music",
        "grade": "Grade A",
        "status": "available",
        "co2_saved": 12.5
    },
    {
        "name": "Fencing Mask (Size M)",
        "description": "Internal padding is clean. Minor scratches on the mesh.",
        "school": "HCI",
        "category": "Sports",
        "grade": "Grade B",
        "status": "available",
        "co2_saved": 4.2
    },
    {
        "name": "Calculus Textbook (11th Ed)",
        "description": "No highlights or pen marks. Like new condition.",
        "school": "RI",
        "category": "Academics",
        "grade": "Grade A",
        "status": "available",
        "co2_saved": 2.1
    },
    {
        "name": "Nanyang Poly Polo T",
        "description": "Size L. Worn only once for orientation.",
        "school": "NYP",
        "category": "Uniform",
        "grade": "Grade A",
        "status": "available",
        "co2_saved": 3.5
    },
    {
        "name": "Football Boots (Size 9)",
        "description": "Nike Mercurial. Studs are slightly worn but still usable.",
        "school": "HCI",
        "category": "Sports",
        "grade": "Grade B",
        "status": "available",
        "co2_saved": 5.8
    }
]

def generate_actions():
    """Generator to prepare data for the bulk helper."""
    for i, item in enumerate(dummy_items):
        yield {
            "_index": "items",
            "_id": f"seed_{i}",
            "_source": item
        }

def seed_database():
    print("🚀 Starting to seed Elasticsearch...")
    try:
        # Using the bulk helper for high performance
        success, failed = helpers.bulk(es, generate_actions())
        print(f"✅ Successfully indexed {success} documents.")
        
        # Refresh the index to make data searchable immediately
        es.indices.refresh(index="items")
        print("✨ Database is ready for the demo!")
    except Exception as e:
        print(f"❌ Error during seeding: {e}")

if __name__ == "__main__":
    seed_database()