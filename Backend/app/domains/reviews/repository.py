from sqlalchemy.orm import Session
from app.domains.reviews.models import Review
from app.domains.users.models import User

def create_review(db: Session, review_data: dict) -> Review:
    db_review = Review(**review_data)
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review

def get_worker_reviews_with_names(db: Session, worker_id: int):
    return db.query(
        Review.id,
        Review.rating,
        Review.comment,
        Review.worker_id,
        Review.reviewer_id,
        User.nickname.label("reviewer_name")
    ).join(User, Review.reviewer_id == User.id).filter(Review.worker_id == worker_id).all()

def get_review_by_id(db: Session, review_id: int):
    return db.query(Review).filter(Review.id == review_id).first()

def delete_review(db: Session, review: Review):
    db.delete(review)
    db.commit()
    return True