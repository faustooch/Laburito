from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from app.domains.users.models import User, ClientProfile, WorkerProfile, Role
from app.domains.reviews.models import Review

def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_users(db: Session):
    return db.query(User).all()

def create_user(db: Session, user_data: dict) -> User:
    db_user = User(**user_data)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    new_client_profile = ClientProfile(user_id=db_user.id)
    db.add(new_client_profile)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, user: User, update_data: dict):
    for key, value in update_data.items():
        setattr(user, key, value)
    db.commit()
    db.refresh(user)
    return user

def delete_user(db: Session, user: User):
    db.delete(user)
    db.commit()


def delete_reviews_received_by_worker(db: Session, worker_id: int) -> int:
    deleted_count = db.query(Review).filter(Review.worker_id == worker_id).delete(synchronize_session=False)
    return deleted_count

def upgrade_to_worker(db: Session, user_id: int, profile_data: dict) -> User:
    user = get_user_by_id(db, user_id)
    if not user:
        return None

    user.role = Role.WORKER
    new_worker_profile = WorkerProfile(user_id=user.id, **profile_data)
    db.add(new_worker_profile)
    db.commit()
    db.refresh(user)
    return user

def get_featured_workers(db: Session, limit: int = 6):
    return db.query(
        User,
        func.coalesce(func.avg(Review.rating), 0).label("rating")
    ).outerjoin(
        Review, User.id == Review.worker_id
    ).filter(
        User.role == Role.WORKER,
        User.worker_profile != None
    ).group_by(User.id).order_by(
        func.avg(Review.rating).desc().nulls_last()
    ).limit(limit).all()

def search_workers(db: Session, q: str, city: str, profession: str, min_rating: float):
    avg_rating_expr = func.coalesce(func.avg(Review.rating), 0.0)

    query = db.query(
        User,
        avg_rating_expr.label("computed_rating")
    ).join(
        WorkerProfile, User.id == WorkerProfile.user_id
    ).outerjoin(
        Review, User.id == Review.worker_id
    ).filter(User.role == Role.WORKER)

    if q:
        query = query.filter(or_(
            User.nickname.ilike(f"%{q}%"),
            WorkerProfile.description.ilike(f"%{q}%"),
            WorkerProfile.profession.ilike(f"%{q}%")
        ))
    if city:
        query = query.filter(User.city == city)
    if profession:
        query = query.filter(WorkerProfile.profession == profession)

    query = query.group_by(User.id)

    if min_rating > 0:
        query = query.having(avg_rating_expr >= min_rating)

    return query.all()

def get_worker_avg_rating(db: Session, worker_id: int):
    return db.query(func.avg(Review.rating)).filter(Review.worker_id == worker_id).scalar()

def get_worker_reviews_with_names(db: Session, worker_id: int):
    return db.query(
        Review.id,
        Review.rating,
        Review.comment,
        User.nickname.label("reviewer_name")
    ).join(User, Review.reviewer_id == User.id).filter(Review.worker_id == worker_id).all()
