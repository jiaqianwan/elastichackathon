from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import Optional
from app.services.match_engine import (
    search_items,
    submit_request,
    run_batch_matching,
    get_matches_for_user,
)

router = APIRouter()


# ── Request body for submitting a request ──────────────────────────
class ItemRequestBody(BaseModel):
    recipient_id:   str
    recipient_name: str
    category:       str
    school:         str
    urgency:        Optional[str] = "normal"   # "normal" | "urgent"


# ── Existing: marketplace search (unchanged) ───────────────────────
@router.get("/search")
async def find_gear(
    query:   Optional[str] = Query(""),
    school:  Optional[str] = Query("All"),
    grade:   Optional[str] = Query("All"),
    sort_by: Optional[str] = Query("relevance"),
):
    return search_items(query=query, school=school, grade=grade, sort_by=sort_by)


# ── NEW: student submits a request for an item ─────────────────────
@router.post("/request")
async def request_item(body: ItemRequestBody):
    return await submit_request(
        recipient_id=body.recipient_id,
        recipient_name=body.recipient_name,
        category=body.category,
        school=body.school,
        urgency=body.urgency,
    )


# ── NEW: fetch all matches for a user ──────────────────────────────
@router.get("/my-matches/{user_id}")
async def my_matches(user_id: str):
    """Returns all matched items for a given recipient."""
    matches = get_matches_for_user(user_id)
    return {"user_id": user_id, "matches": matches}


# ── NEW: admin batch run ───────────────────────────────────────────
@router.post("/run-batch")
async def batch_match():
    """
    Manually trigger a batch matching pass.
    Useful after a bulk donation upload or as a scheduled job.
    """
    return run_batch_matching()
