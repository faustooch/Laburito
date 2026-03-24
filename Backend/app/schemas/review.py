# app/schemas/review.py
from pydantic import BaseModel, Field
from typing import Optional

# Base compartida
class ReviewBase(BaseModel):
    # Obligamos a que el puntaje sea entre 1 y 5
    rating: int = Field(..., ge=1, le=5, description="Calificación del 1 al 5")
    comment: Optional[str] = Field(None, max_length=500, description="Comentario opcional")

# Lo que el cliente nos manda por JSON para crear la reseña
class ReviewCreate(ReviewBase):
    pass
    # No le pedimos el reviewer_id porque lo sacamos del token (seguridad)
    # No le pedimos el worker_id acá porque lo sacaremos de la URL (ej: /workers/{id}/reviews)

# Lo que le devolvemos al frontend
class ReviewResponse(ReviewBase):
    id: int
    reviewer_id: int
    worker_id: int

    class Config:
        from_attributes = True  # Permite leer datos de SQLAlchemy directamente