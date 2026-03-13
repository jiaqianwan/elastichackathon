from elasticsearch import Elasticsearch
import os
from dotenv import load_dotenv
from datetime import datetime
import uuid
from app.services.agent_integration import get_agent_explanation

load_dotenv()

es = Elasticsearch(
    hosts=[os.getenv("ELASTICSEARCH_URL")],
    api_key=os.getenv("ELASTICSEARCH_API_KEY")
)

ITEMS_INDEX = "items"
REQUESTS_INDEX = "item_requests"
MATCHES_INDEX = "matches"

# ─────────────────────────────────────────────
# Grade scoring: A > B > C for ranking
# ─────────────────────────────────────────────
GRADE_BOOST = {
    "Grade A": 3,
    "Grade B": 2,
    "Grade C": 1,
}

# ─────────────────────────────────────────────
# Index setup — call on startup
# ─────────────────────────────────────────────
def setup_matching_indices():
    """Create requests + matches indices if they don't exist."""

    if not es.indices.exists(index=REQUESTS_INDEX):
        es.indices.create(index=REQUESTS_INDEX, body={
            "mappings": {
                "properties": {
                    "recipient_id":   {"type": "keyword"},
                    "recipient_name": {"type": "text"},
                    "category":       {"type": "keyword"},
                    "school":         {"type": "keyword"},
                    "urgency":        {"type": "keyword"},   # "normal" | "urgent"
                    "is_matched":     {"type": "boolean"},
                    "created_at":     {"type": "date"},
                }
            }
        })
        print("✅ Created index: item_requests")

    if not es.indices.exists(index=MATCHES_INDEX):
        es.indices.create(index=MATCHES_INDEX, body={
            "mappings": {
                "properties": {
                    "match_id":       {"type": "keyword"},
                    "item_id":        {"type": "keyword"},
                    "request_id":     {"type": "keyword"},
                    "recipient_id":   {"type": "keyword"},
                    "item_name":      {"type": "text"},
                    "category":       {"type": "keyword"},
                    "school":         {"type": "keyword"},
                    "grade":          {"type": "keyword"},
                    "co2_saved":      {"type": "float"},
                    "status":         {"type": "keyword"},   # "pending" | "collected"
                    "matched_at":     {"type": "date"},
                }
            }
        })
        print("✅ Created index: matches")


# ─────────────────────────────────────────────
# Original search (unchanged — marketplace view)
# ─────────────────────────────────────────────
def search_items(query: str = "", school: str = "", grade: str = "", sort_by: str = ""):
    must_clauses = []
    filter_clauses = [{"match": {"status": "available"}}]
    sort_logic = []

    has_query  = bool(query and query.strip())
    has_school = bool(school and school.lower() != "all")
    has_grade  = bool(grade and grade.lower() != "all")

    if not has_query and not has_school and not has_grade:
        must_clauses.append({"match_all": {}})
    else:
        if has_query:
            must_clauses.append({"multi_match": {"query": query, "fields": ["name", "description"], "fuzziness": "AUTO"}})
        if has_school:
            filter_clauses.append({"match": {"school": school}})
        if has_grade:
            filter_clauses.append({"match": {"grade": grade}})

    if sort_by == "co2":
        sort_logic.append({"co2_saved": {"order": "desc"}})
    elif sort_by == "grade":
        sort_logic.append({"grade.keyword": {"order": "asc"}})
    else:
        sort_logic.append({"_score": {"order": "desc"}})

    try:
        response = es.search(
            index=ITEMS_INDEX,
            query={"bool": {"must": must_clauses, "filter": filter_clauses}},
            sort=sort_logic
        )
        print(f"🚨 CLOUD REPORT: Found {len(response['hits']['hits'])} items.")
        return response["hits"]["hits"]
    except Exception as e:
        print(f"❌ ES Error: {e}")
        return []


def index_new_donation(item_id: str, item_data: dict):
    return es.index(index=ITEMS_INDEX, id=item_id, document=item_data)


# ─────────────────────────────────────────────
# NEW: Pairing logic
# ─────────────────────────────────────────────
def find_best_item_for_request(category: str, school: str) -> dict | None:
    """
    Find the best available item matching:
      1. Same category (hard filter)
      2. Same school preferred, any school fallback
      3. Best grade (A > B > C)
    Returns the ES hit dict or None.
    """
    # First try: same school
    for school_filter in [school, None]:
        filter_clauses = [
            {"term": {"status": "available"}},
            {"term": {"category": category}},
        ]
        if school_filter:
            filter_clauses.append({"term": {"school": school_filter}})

        query = {
            "bool": {
                "filter": filter_clauses,
                "should": [
                    {"term": {"grade": {"value": "Grade A", "boost": 3}}},
                    {"term": {"grade": {"value": "Grade B", "boost": 2}}},
                    {"term": {"grade": {"value": "Grade C", "boost": 1}}},
                ],
                "minimum_should_match": 0,
            }
        }

        try:
            result = es.search(
                index=ITEMS_INDEX,
                query=query,
                sort=[{"_score": {"order": "desc"}}],
                size=1
            )
            hits = result["hits"]["hits"]
            if hits:
                return hits[0]
        except Exception as e:
            print(f"❌ Search error: {e}")
            return None

    return None


async def submit_request(recipient_id: str, recipient_name: str, category: str, school: str, urgency: str = "normal") -> dict:
    """
    Register a recipient's request and immediately try to match.
    Returns a result dict with match info if found.
    """
    request_id = str(uuid.uuid4())
    request_doc = {
        "recipient_id":   recipient_id,
        "recipient_name": recipient_name,
        "category":       category,
        "school":         school,
        "urgency":        urgency,
        "is_matched":     False,
        "created_at":     datetime.utcnow().isoformat(),
    }
    es.index(index=REQUESTS_INDEX, id=request_id, document=request_doc)
    es.indices.refresh(index=REQUESTS_INDEX)

    best_item = find_best_item_for_request(category, school)

    if best_item:
        match = _create_match(
            item_id=best_item["_id"],
            item_doc=best_item["_source"],
            request_id=request_id,
            request_doc=request_doc,
        )
        
        # Get AI explanation from Elastic agent
        explanation = await get_agent_explanation(
            item=best_item["_source"],
            request={"category": category, "school": school, "urgency": urgency}
        )
        match.update(explanation)
        
        return {
            "matched": True,
            "request_id": request_id,
            "match": match,
            "message": f"✅ Match found! {best_item['_source']['name']} ({best_item['_source']['grade']}) is reserved for you.",
        }


def run_batch_matching() -> dict:
    """
    Match all pending (unmatched) requests against available items.
    Run this after a bulk donation upload or on a schedule.
    """
    try:
        result = es.search(
            index=REQUESTS_INDEX,
            query={"term": {"is_matched": False}},
            size=100
        )
        pending = result["hits"]["hits"]
    except Exception as e:
        return {"error": str(e)}

    matched_count = 0
    for req_hit in pending:
        req_id  = req_hit["_id"]
        req_doc = req_hit["_source"]

        best_item = find_best_item_for_request(req_doc["category"], req_doc["school"])
        if best_item:
            _create_match(best_item["_id"], best_item["_source"], req_id, req_doc)
            matched_count += 1

    return {
        "total_pending":    len(pending),
        "newly_matched":    matched_count,
        "still_unmatched":  len(pending) - matched_count,
    }


def get_matches_for_user(user_id: str) -> list:
    """Fetch all matches where user is the recipient."""
    try:
        result = es.search(
            index=MATCHES_INDEX,
            query={"term": {"recipient_id": user_id}},
            sort=[{"matched_at": {"order": "desc"}}]
        )
        return [hit["_source"] for hit in result["hits"]["hits"]]
    except Exception as e:
        print(f"❌ Error fetching matches: {e}")
        return []


# ─────────────────────────────────────────────
# Internal helper
# ─────────────────────────────────────────────
def _create_match(item_id: str, item_doc: dict, request_id: str, request_doc: dict) -> dict:
    match_id = str(uuid.uuid4())
    match_doc = {
        "match_id":     match_id,
        "item_id":      item_id,
        "request_id":   request_id,
        "recipient_id": request_doc["recipient_id"],
        "item_name":    item_doc["name"],
        "category":     item_doc.get("category", ""),
        "school":       item_doc.get("school", ""),
        "grade":        item_doc.get("grade", ""),
        "co2_saved":    item_doc.get("co2_saved", 0),
        "status":       "pending",
        "matched_at":   datetime.utcnow().isoformat(),
    }

    es.index(index=MATCHES_INDEX, id=match_id, document=match_doc)

    # Mark item as reserved + request as matched
    es.update(index=ITEMS_INDEX,    id=item_id,    body={"doc": {"status": "reserved"}})
    es.update(index=REQUESTS_INDEX, id=request_id, body={"doc": {"is_matched": True}})

    es.indices.refresh(index=MATCHES_INDEX)
    return match_doc
