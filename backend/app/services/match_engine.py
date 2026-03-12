from elasticsearch import Elasticsearch
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize Elasticsearch Client using your .env settings
es = Elasticsearch(
    os.getenv("ELASTICSEARCH_URL", "http://localhost:9200"),
    api_key=os.getenv("ELASTICSEARCH_API_KEY")
)

def search_items(query: str, school: str, category: str = None):
    """
    Finds verified gear using Elasticsearch fuzzy matching.
    """
    search_query = {
        "bool": {
            "must": [
                # Fuzzy match on the item name or description
                {"multi_match": {
                    "query": query,
                    "fields": ["name", "description"],
                    "fuzziness": "AUTO"
                }},
                # Ensure we only show items from the student's school
                {"term": {"school.keyword": school}},
                # Only show verified, available items
                {"term": {"status.keyword": "available"}}
            ]
        }
    }

    if category:
        search_query["bool"]["must"].append({"term": {"category.keyword": category}})

    try:
        response = es.search(index="items", query=search_query)
        # Transform Elastic results into a clean list for the frontend
        return [
            {**hit["_source"], "id": hit["_id"]} 
            for hit in response["hits"]["hits"]
        ]
    except Exception as e:
        print(f"Elasticsearch error: {e}")
        return []

def index_new_donation(item_id: str, item_data: dict):
    """
    Adds a new AI-graded item into the search index.
    """
    return es.index(index="items", id=item_id, document=item_data)