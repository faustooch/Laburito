# app/services/review_service.py
from sqlalchemy.orm import Session
from app.repositories import review_repository, user_repository
from app.models.user import Role
from app.schemas.review import ReviewCreate


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
    # Primero chequeamos si el trabajador existe
    worker = user_repository.get_user_by_id(db, worker_id)
    if not worker or worker.role != Role.WORKER:
        raise Exception("Trabajador no encontrado.")

    return review_repository.get_reviews_by_worker(db, worker_id)