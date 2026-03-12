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
    # Base filter
    filter_clauses = [{"match": {"status": "available"}}]
    sort_logic = []

    # LOGGING INCOMING PARAMS
    print(f"--- 🔍 SEARCH ATTEMPT ---")
    print(f"Query: '{query}' | School: '{school}' | Grade: '{grade}'")

    has_query = bool(query and query.strip())
    has_school = bool(school and school.lower() != "all")
    has_grade = bool(grade and grade.lower() != "all")

    if not has_query and not has_school and not has_grade:
        print("Mode: BROWSE ALL (Match All)")
        must_clauses.append({"match_all": {}})
    else:
        print(f"Mode: FILTERED (Query:{has_query}, School:{has_school}, Grade:{has_grade})")
        if has_query:
            must_clauses.append({"multi_match": {"query": query, "fields": ["name", "description"], "fuzziness": "AUTO"}})
        if has_school:
            filter_clauses.append({"term": {"school.keyword": school}})
        if has_grade:
            filter_clauses.append({"term": {"grade.keyword": grade}})

    # Sorting
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
        
        hits = response['hits']['hits']
        print(f"🚨 CLOUD REPORT: Found {len(hits)} items.")
        
        # LOGGING DATA STRUCTURE
        if len(hits) == 0:
            # Check if index even has data regardless of filters
            total = es.count(index="items")['count']
            print(f"⚠️ DEBUG: Total items in index (ignoring filters): {total}")
        else:
            first = hits[0]['_source']
            print(f"✅ SAMPLE DATA: School={first.get('school')}, Grade={first.get('grade')}, Status={first.get('status')}")
            
        return hits
    except Exception as e:
        print(f"❌ ES Error: {e}")
        return []
    
def index_new_donation(item_id: str, item_data: dict):
    return es.index(index="items", id=item_id, document=item_data)