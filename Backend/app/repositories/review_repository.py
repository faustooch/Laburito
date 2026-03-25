# app/repositories/review_repository.py
from sqlalchemy.orm import Session
from app.models.review import Review

def create_review(db: Session, review_data: dict) -> Review:
    db_review = Review(**review_data)
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review

def get_reviews_by_worker(db: Session, worker_id: int):
    # Trae todas las reseñas que recibió un trabajador específico
    return db.query(Review).filter(Review.worker_id == worker_id).all()

def get_review_by_id(db: Session, review_id: int):
    return db.query(Review).filter(Review.id == review_id).first()

def delete_review(db: Session, review: Review):
    db.delete(review)
    db.commit()
    return True