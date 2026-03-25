# app/schemas/review.py
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

# Este es el que usamos dentro del perfil del trabajador
class ReviewDetail(ReviewBase):
    id: int
    reviewer_id: int  # <--- AGREGÁ ESTA LÍNEA AQUÍ TAMBIÉN
    reviewer_name: str

    class Config:
        from_attributes = True