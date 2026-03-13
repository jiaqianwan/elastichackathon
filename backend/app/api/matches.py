from fastapi import APIRouter, Query
from app.db.elasticsearch import es_client
from typing import Optional
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/search")
async def search_items(
    query: Optional[str] = Query("", description="Search query"),
    school: Optional[str] = Query("", description="Filter by school"),
    grade: Optional[str] = Query("", description="Filter by grade"),
    sort_by: Optional[str] = Query("relevance", description="Sort by: relevance, co2, grade")
):
    """
    Search available items for students to request
    """
    try:
        # Build Elasticsearch query
        must_conditions = [{"match": {"status": "available"}}]
        
        if query:
            must_conditions.append({
                "multi_match": {
                    "query": query,
                    "fields": ["name^3", "description^2", "category"],
                    "fuzziness": "AUTO"
                }
            })
        
        if school:
            must_conditions.append({"term": {"school.keyword": school}})
        
        if grade:
            must_conditions.append({"term": {"grade.keyword": grade}})
        
        # Determine sort order
        sort_order = []
        if sort_by == "co2":
            sort_order = [{"co2_saved": {"order": "desc"}}]
        elif sort_by == "grade":
            sort_order = [{"grade.keyword": {"order": "asc"}}]
        else:  # relevance
            sort_order = [{"_score": {"order": "desc"}}]
        
        # Execute search
        search_body = {
            "query": {"bool": {"must": must_conditions}},
            "sort": sort_order,
            "size": 50
        }
        
        logger.info(f"Searching items: {search_body}")
        
        response = es_client.search(
            index="items",
            body=search_body
        )
        
        hits = response['hits']['hits']
        logger.info(f"Found {len(hits)} items")
        
        return hits
        
    except Exception as e:
        logger.error(f"Search failed: {e}", exc_info=True)
        return []
