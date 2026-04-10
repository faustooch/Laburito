from pydantic import BaseModel, Field
from typing import Optional

class ReviewBase(BaseModel):
    rating: int = Field(..., ge=1, le=5, description="Calificación del 1 al 5")
    comment: Optional[str] = Field(None, max_length=500, description="Comentario opcional")

class ReviewCreate(ReviewBase):
    pass

class ReviewResponse(ReviewBase):
    id: int
    reviewer_id: int
    worker_id: int

    class Config:
        from_attributes = True

class ReviewDetail(ReviewBase):
    id: int
    reviewer_id: int
    reviewer_name: str

    class Config:
        from_attributes = True