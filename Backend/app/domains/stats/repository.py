from sqlalchemy.orm import Session
from sqlalchemy import func
from app.domains.users.models import User, Role


def get_user_count_by_role(db: Session, role: Role) -> int:
    """
    Realiza un COUNT directo en la base de datos filtrando por rol y estado activo.
    """
    count = db.query(func.count(User.id)).filter(
        User.role == role,
        User.is_active == True
    ).scalar()

    return count or 0