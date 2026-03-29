# app/api/v1/routes/reviews.py
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

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
    current_user: User = Depends(get_current_user)
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
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.get("/workers/{worker_id}", response_model=List[ReviewResponse])
def get_worker_reviews(
    worker_id: int,
    db: Session = Depends(get_db)
):
    """
    Obtiene todas las reseñas que recibió un trabajador. (Público)
    """
    # Como es un GET simple, no hace falta atrapar errores complejos acá.
    return review_service.get_worker_reviews(db=db, worker_id=worker_id)


@router.delete("/{review_id}")
def delete_review(
    review_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
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
    except KeyError as e:
        # KeyError indica que no se encontró en la DB (404)
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e).strip("'"))
    except PermissionError as e:
        # PermissionError indica falta de permisos (403)
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))
    except Exception as e:
        # Fallback para errores genéricos (400 o 500)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))