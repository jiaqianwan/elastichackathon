import os
from elasticsearch import Elasticsearch
from dotenv import load_dotenv
import logging

load_dotenv()
logger = logging.getLogger(__name__)

# Initialize Elasticsearch client (singleton)
es_client = Elasticsearch(
    hosts=[os.getenv("ELASTICSEARCH_URL")],
    api_key=os.getenv("ELASTICSEARCH_API_KEY")
)

def check_elasticsearch_connection():
    """Verify Elasticsearch connection"""
    try:
        info = es_client.info()
        logger.info(f"✅ Connected to Elasticsearch: {info['version']['number']}")
        logger.info(f"   Cluster: {info['cluster_name']}")
        return True
    except Exception as e:
        logger.error(f"❌ Elasticsearch connection failed: {e}")
        return False

def create_donations_index():
    """Create donations index with proper mappings"""
    index_name = "donations"
    
    if es_client.indices.exists(index=index_name):
        logger.info(f"Index '{index_name}' already exists")
        return
    
    mappings = {
        "mappings": {
            "properties": {
                "filename": {"type": "keyword"},
                "timestamp": {"type": "date"},
                "grade": {"type": "keyword"},
                "condition": {"type": "keyword"},
                "category": {"type": "keyword"},
                "quality_score": {"type": "integer"},
                "co2_saved": {"type": "float"},
                "dignity_check": {"type": "boolean"},
                "feedback": {"type": "text"},
                "acceptance_reason": {"type": "text"},
                "grading_method": {"type": "keyword"},
                "donor_id": {"type": "keyword"},
                "school": {"type": "keyword"},
                "status": {"type": "keyword"}  # available, matched, collected
            }
        }
    }
    
    es_client.indices.create(index=index_name, body=mappings)
    logger.info(f"✅ Created index: {index_name}")

def create_items_index():
    """Create items index (for your existing seed data)"""
    index_name = "items"
    
    if es_client.indices.exists(index=index_name):
        logger.info(f"Index '{index_name}' already exists")
        return
    
    mappings = {
        "mappings": {
            "properties": {
                "name": {"type": "text"},
                "description": {"type": "text"},
                "school": {"type": "keyword"},
                "grade": {"type": "keyword"},
                "status": {"type": "keyword"},
                "co2_saved": {"type": "float"},
                "category": {"type": "keyword"},
                "donor_id": {"type": "keyword"},
                "recipient_id": {"type": "keyword"},
                "created_at": {"type": "date"},
                "matched_at": {"type": "date"}
            }
        }
    }
    
    es_client.indices.create(index=index_name, body=mappings)
    logger.info(f"✅ Created index: {index_name}")

def create_requests_index():
    """Create requests index for students requesting items"""
    index_name = "requests"
    
    if es_client.indices.exists(index=index_name):
        logger.info(f"Index '{index_name}' already exists")
        return
    
    mappings = {
        "mappings": {
            "properties": {
                "student_id": {"type": "keyword"},
                "student_name": {"type": "text"},
                "school": {"type": "keyword"},
                "category": {"type": "keyword"},
                "description": {"type": "text"},
                "urgency": {"type": "keyword"},  # high, medium, low
                "status": {"type": "keyword"},  # pending, matched, fulfilled
                "created_at": {"type": "date"},
                "matched_item_id": {"type": "keyword"}
            }
        }
    }
    
    es_client.indices.create(index=index_name, body=mappings)
    logger.info(f"✅ Created index: {index_name}")

def initialize_indices():
    """Create all required indices"""
    try:
        create_donations_index()
        create_items_index()
        create_requests_index()
        logger.info("✅ All indices initialized")
        return True
    except Exception as e:
        logger.error(f"❌ Failed to initialize indices: {e}")
        return False
