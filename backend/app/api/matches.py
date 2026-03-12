from fastapi import APIRouter, Query
from app.services.match_engine import search_items # Import your fuzzy search engine

router = APIRouter()

@router.get("/search")
async def find_gear(
    query: str = Query(..., description="The item to search for"), 
    school: str = Query(..., description="The student's school")
):
    # Call the actual Elasticsearch engine for real results
    results = search_items(query=query, school=school)
    
    # If no results are found in the engine, you can return an empty list or your mock data
    return results