from fastapi import APIRouter, Query
from app.services.match_engine import search_items

router = APIRouter()

@router.get("/search")
async def find_gear(
    query: str = Query(..., description="Item to search"),
    school: str = Query(..., description="School filter")
):
    # This now pulls real data from your Singapore Cloud DB!
    results = search_items(query=query, school=school)
    return results