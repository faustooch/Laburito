# app/services/review_service.py
from app.models.review import Review
from app.repositories import user_repository
from app.models.user import Role
from app.models.user import User
from app.schemas.review import ReviewCreate
from sqlalchemy.orm import Session
from app.repositories import review_repository
from fastapi import HTTPException, status


def create_review(db: Session, reviewer_id: int, worker_id: int, review_in: ReviewCreate):
    # Regla 1: Evitar el auto-bombo
    if reviewer_id == worker_id:
        raise Exception("No podés dejarte una reseña a vos mismo.")

    # Regla 2 y 3: Verificar que el destino exista y sea WORKER
    worker = user_repository.get_user_by_id(db, worker_id)
    if not worker:
        raise Exception("El usuario al que intentás calificar no existe.")

    if worker.role != Role.WORKER:
        raise Exception("Solo podés calificar a usuarios que ofrezcan servicios (trabajadores).")

    # Si pasó todas las pruebas, armamos el paquete de datos
    # Extraemos el puntaje y el comentario del esquema que mandó el usuario
    review_data = review_in.model_dump()

    # Le inyectamos a la fuerza quién la escribió y para quién es
    review_data["reviewer_id"] = reviewer_id
    review_data["worker_id"] = worker_id

    # Mandamos al repositorio a guardar
    return review_repository.create_review(db, review_data)


def get_worker_reviews(db: Session, worker_id: int):
    # IMPORTANTE: Incluir Review.reviewer_id en la selección
    reviews = db.query(
        Review.id,
        Review.rating,
        Review.comment,
        Review.worker_id,
        Review.reviewer_id,  # <--- ESTA ES LA CLAVE QUE FALTA
        User.nickname.label("reviewer_name")
    ).join(User, Review.reviewer_id == User.id) \
        .filter(Review.worker_id == worker_id).all()

    return reviews


def delete_review(db: Session, review_id: int, current_user_id: int):
    # Buscamos la reseña
    review = review_repository.get_review_by_id(db, review_id)

    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reseña no encontrada."
        )

    # REGLA DE SEGURIDAD: Solo el autor puede borrarla
    if review.reviewer_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tenés permiso para eliminar esta reseña."
        )

    # Si todo está ok, mandamos al repo a borrar
    return review_repository.delete_review(db, review)