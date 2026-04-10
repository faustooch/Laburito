from sqlalchemy.orm import Session
from app.domains.users import repository as user_repository
from app.core.security import get_password_hash
from app.domains.users.models import Role

def create_user(db: Session, user_create):
    existing = user_repository.get_user_by_email(db, user_create.email)
    if existing:
        raise Exception("Email ya registrado")

    user_data = user_create.dict()
    plain_password = user_data.pop("password")
    user_data["password_hash"] = get_password_hash(plain_password)

    return user_repository.create_user(db, user_data)

def get_user(db: Session, user_id: int):
    return user_repository.get_user_by_id(db, user_id)

def get_users(db: Session):
    return user_repository.get_users(db)

def update_user(db: Session, user_id: int, user_update):
    user = user_repository.get_user_by_id(db, user_id)
    if not user:
        return None
    return user_repository.update_user(db, user, user_update.dict(exclude_unset=True))

def delete_user(db: Session, user_id: int):
    user = user_repository.get_user_by_id(db, user_id)
    if not user:
        return False
    user_repository.delete_user(db, user)
    return True

def upgrade_to_worker(db: Session, user, profile_data: dict):
    if user.role == Role.WORKER:
        raise Exception("El usuario ya es un trabajador.")
    return user_repository.upgrade_to_worker(db, user.id, profile_data)

def update_worker_profile(db: Session, user_id: int, update_data: dict):
    user = user_repository.get_user_by_id(db, user_id)
    if not user or user.role != Role.WORKER or not user.worker_profile:
        raise Exception("Perfil de trabajador no encontrado o inválido.")

    for key, value in update_data.items():
        setattr(user.worker_profile, key, value)

    db.commit()
    db.refresh(user)
    return user

def downgrade_worker(db: Session, user_id: int):
    user = user_repository.get_user_by_id(db, user_id)
    if not user:
        raise Exception("Usuario no encontrado.")
    if user.role != Role.WORKER:
        raise Exception("El usuario no tiene un perfil de trabajador activo para dar de baja.")

    # Al dejar de ser trabajador, eliminamos las reseñas que recibió.
    user_repository.delete_reviews_received_by_worker(db, user_id)

    if user.worker_profile:
        db.delete(user.worker_profile)

    user.role = Role.CLIENT
    db.commit()
    db.refresh(user)
    return user

def get_featured_workers(db: Session):
    results = user_repository.get_featured_workers(db)
    featured_workers = []
    for user_obj, avg_rating in results:
        user_obj.rating = float(avg_rating)
        featured_workers.append(user_obj)
    return featured_workers

def search_workers(db: Session, q: str = None, city: str = None, profession: str = None, min_rating: float = 0.0):
    results = user_repository.search_workers(db, q, city, profession, min_rating)
    final_workers = []
    for user_obj, rating_val in results:
        user_obj.rating = float(rating_val)
        final_workers.append(user_obj)
    return final_workers

def get_worker_full_profile(db: Session, worker_id: int):
    worker = user_repository.get_user_by_id(db, worker_id)
    if not worker or worker.role != Role.WORKER:
        return None

    avg_rating = user_repository.get_worker_avg_rating(db, worker_id)
    worker.rating = float(avg_rating) if avg_rating else 0.0

    worker.reviews = user_repository.get_worker_reviews_with_names(db, worker_id)
    return worker