# app/services/review_service.py
from sqlalchemy.orm import Session
from app.models.user import Role
from app.schemas.review import ReviewCreate
from app.repositories import review_repository, user_repository

def create_review(db: Session, reviewer_id: int, worker_id: int, review_in: ReviewCreate):
    # Regla 1: Evitar el auto-bombo
    if reviewer_id == worker_id:
        raise ValueError("No podés dejarte una reseña a vos mismo.")

    # Regla 2 y 3: Verificar que el destino exista y sea WORKER
    worker = user_repository.get_user_by_id(db, worker_id)
    if not worker:
        raise ValueError("El usuario al que intentás calificar no existe.")

    if worker.role != Role.WORKER:
        raise ValueError("Solo podés calificar a usuarios que ofrezcan servicios (trabajadores).")

    review_data = review_in.model_dump()
    review_data["reviewer_id"] = reviewer_id
    review_data["worker_id"] = worker_id

    return review_repository.create_review(db, review_data)


def get_worker_reviews(db: Session, worker_id: int):
    # Delegamos la consulta al repositorio
    return review_repository.get_worker_reviews_with_names(db, worker_id)


def delete_review(db: Session, review_id: int, current_user_id: int):
    review = review_repository.get_review_by_id(db, review_id)

    if not review:
        raise KeyError("Reseña no encontrada.")

    # REGLA DE SEGURIDAD: Solo el autor puede borrarla
    if review.reviewer_id != current_user_id:
        raise PermissionError("No tenés permiso para eliminar esta reseña.")

    return review_repository.delete_review(db, review)