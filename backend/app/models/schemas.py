from pydantic import BaseModel
from typing import Optional

class ItemBase(BaseModel):
    name: str
    category: str
    school: str
    description: Optional[str] = None

class ItemCreate(ItemBase):
    image_url: str

class Item(ItemBase):
    id: str
    grade: str  # AI Assigned [cite: 44, 47]
    status: str # available, requested, collected
    co2_saved: float