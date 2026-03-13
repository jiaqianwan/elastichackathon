from elasticsearch import Elasticsearch
import os
from dotenv import load_dotenv

# Load variables from .env
load_dotenv()

# Initialize the Cloud Client
# Make sure the string inside getenv matches your .env file exactly!
es = Elasticsearch(
    hosts=[os.getenv("ELASTICSEARCH_URL")], 
    api_key=os.getenv("ELASTICSEARCH_API_KEY")
)

def search_items(query: str = "", school: str = "", grade: str = "", sort_by: str = ""):
    must_clauses = []
    # Use 'match' for status to be safe
    filter_clauses = [{"match": {"status": "available"}}] 
    sort_logic = []

    has_query = bool(query and query.strip())
    has_school = bool(school and school.lower() != "all")
    has_grade = bool(grade and grade.lower() != "all")

    if not has_query and not has_school and not has_grade:
        must_clauses.append({"match_all": {}})
    else:
        if has_query:
            must_clauses.append({"multi_match": {"query": query, "fields": ["name", "description"], "fuzziness": "AUTO"}})
        
        # CHANGE: Use 'match' instead of 'term' and remove '.keyword'
        # This makes the filters less "brittle" to casing/mapping issues.
        if has_school:
            filter_clauses.append({"match": {"school": school}})
        if has_grade:
            filter_clauses.append({"match": {"grade": grade}})

    # Sorting logic remains the same...
    if sort_by == "co2":
        sort_logic.append({"co2_saved": {"order": "desc"}})
    elif sort_by == "grade":
        sort_logic.append({"grade.keyword": {"order": "asc"}})
    else:
        sort_logic.append({"_score": {"order": "desc"}})

    try:
        response = es.search(
            index="items", 
            query={"bool": {"must": must_clauses, "filter": filter_clauses}}, 
            sort=sort_logic
        )
        print(f"🚨 CLOUD REPORT: Found {len(response['hits']['hits'])} items.")
        return response["hits"]["hits"]
    except Exception as e:
        print(f"❌ ES Error: {e}")
        return []
        
def index_new_donation(item_id: str, item_data: dict):
    return es.index(index="items", id=item_id, document=item_data)