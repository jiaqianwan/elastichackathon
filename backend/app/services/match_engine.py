from elasticsearch import Elasticsearch
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize the Cloud Client
es = Elasticsearch(
    hosts=[os.getenv("ELASTICSEARCH_URL")], # Must be a list for the client
    api_key=os.getenv("ELASTICSEARCH_API_KEY")
)

def search_items(query: str, school: str):
    """
    Perform a fuzzy search on the cloud index.
    """
    search_query = {
        "bool": {
            "must": [
                {"multi_match": {
                    "query": query, 
                    "fields": ["name", "description"], 
                    "fuzziness": "AUTO"
                }},
                {"term": {"school.keyword": school}},
                {"term": {"status.keyword": "available"}}
            ]
        }
    }

    try:
        # 'items' is the index name you created in Dev Tools
        response = es.search(index="items", query=search_query)
        return [{**hit["_source"], "id": hit["_id"]} for hit in response["hits"]["hits"]]
    except Exception as e:
        print(f"Cloud Search Error: {e}")
        return []

def index_new_donation(item_id: str, item_data: dict):
    """
    Saves a graded donation to the cloud.
    """
    return es.index(index="items", id=item_id, document=item_data)