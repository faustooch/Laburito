from sqlalchemy.orm import Session

from app.models.user import Role
from app.repositories import user_repository
from app.core.security import get_password_hash # <-- Importamos el hasher


def create_user(db: Session, user_create):
    existing = user_repository.get_user_by_email(db, user_create.email)
    if existing:
        raise Exception("Email ya registrado")

    user_data = user_create.dict()

    # Extraemos el password en texto plano y lo hasheamos
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
        return None

    user_repository.delete_user(db, user)
    return True

def upgrade_to_worker(db: Session, user, profile_data: dict):
    # Lógica de negocio: verificamos que no sea trabajador ya
    if user.role == Role.WORKER:
        raise Exception("El usuario ya es un trabajador.")

    # Si pasa la validación, mandamos la orden al repositorio
    return user_repository.upgrade_to_worker(db, user.id, profile_data)