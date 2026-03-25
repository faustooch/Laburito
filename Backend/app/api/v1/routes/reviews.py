# app/api/v1/routes/reviews.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.schemas.review import ReviewCreate, ReviewResponse
from app.services import review_service
from app.api.deps import get_current_user, get_db
from app.models.user import User

router = APIRouter(prefix="/reviews", tags=["reviews"])

@router.post("/workers/{worker_id}", response_model=ReviewResponse)
def create_review(
    worker_id: int,
    review_in: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user) # <- ¡Acá garantizamos la seguridad!
):
    """
    Deja una reseña (1 a 5 estrellas) a un trabajador específico.
    """
    try:
        return review_service.create_review(
            db=db,
            reviewer_id=current_user.id,
            worker_id=worker_id,
            review_in=review_in
        )
    except Exception as e:
        # Si el servicio tira un error (ej: autobombo), se lo mostramos al usuario
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/workers/{worker_id}", response_model=List[ReviewResponse])
def get_worker_reviews(
    worker_id: int,
    db: Session = Depends(get_db)
):
    """
    Obtiene todas las reseñas que recibió un trabajador. (Cualquiera puede verlas, no pide token)
    """
    try:
        return review_service.get_worker_reviews(db=db, worker_id=worker_id)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.delete("/{review_id}")
def delete_review(
    review_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Elimina una reseña específica. Solo el autor de la misma puede hacerlo.
    """
    try:
        review_service.delete_review(
            db=db,
            review_id=review_id,
            current_user_id=current_user.id
        )
        return {"detail": "Reseña eliminada con éxito"}
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))