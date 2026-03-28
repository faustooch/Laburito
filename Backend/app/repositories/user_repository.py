from sqlalchemy.orm import Session
from app.models.user import User, ClientProfile, Role, WorkerProfile
from sqlalchemy import func


def create_user(db: Session, user_data: dict) -> User:
    # Como sacamos "role" de UserCreate, acá llega limpio.
    # El modelo User de la DB le asigna Role.CLIENT por defecto.
    db_user = User(**user_data)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    # Le creamos su perfil de cliente vacío
    new_client_profile = ClientProfile(user_id=db_user.id)
    db.add(new_client_profile)
    db.commit()

    # Refrescamos para traer las relaciones
    db.refresh(db_user)
    return db_user

def upgrade_to_worker(db: Session, user_id: int, profile_data: dict) -> User:
    # 1. Buscamos al usuario
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return None

    # 2. Le cambiamos el rol
    user.role = Role.WORKER

    # 3. Le creamos su perfil de trabajador con los datos que mandó
    new_worker_profile = WorkerProfile(
        user_id=user.id,
        **profile_data
    )
    db.add(new_worker_profile)

    # Guardamos los cambios
    db.commit()
    db.refresh(user)

    return user

def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_users(db: Session):
    return db.query(User).all()

def update_user(db: Session, user: User, update_data: dict):
    for key, value in update_data.items():
        setattr(user, key, value)
    db.commit()
    db.refresh(user)
    return user

def delete_user(db: Session, user: User):
    db.delete(user)
    db.commit()
