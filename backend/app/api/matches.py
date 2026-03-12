from fastapi import APIRouter, Query
from app.services.match_engine import search_items
from typing import Optional

router = APIRouter()

@router.get("/search")
async def find_gear(
    query: Optional[str] = Query(""), 
    school: Optional[str] = Query("All"), 
    grade: Optional[str] = Query("All"), 
    sort_by: Optional[str] = Query("relevance")
):
    # This ensures "All" strings are passed correctly to your engine logic
    return search_items(query=query, school=school, grade=grade, sort_by=sort_by)