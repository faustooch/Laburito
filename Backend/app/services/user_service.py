from sqlalchemy.orm import Session

from app.models.review import Review
from app.repositories import user_repository
from app.core.security import get_password_hash
from sqlalchemy import func, or_
from app.models.user import User, WorkerProfile, Role


# <-- Importamos el hasher


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


def update_worker_profile(db: Session, user_id: int, update_data: dict):
    # Buscamos al usuario
    user = user_repository.get_user_by_id(db, user_id)

    # Actualizamos campo por campo su perfil de trabajador
    for key, value in update_data.items():
        setattr(user.worker_profile, key, value)

    db.commit()
    db.refresh(user)
    return user


def search_workers(db: Session, q: str = None, city: str = None, profession: str = None, min_rating: float = 0.0):
    # 1. Definimos la expresión del promedio
    # Coalesce asegura que si no hay reviews, el valor sea 0.0 en lugar de NULL
    avg_rating_expr = func.coalesce(func.avg(Review.rating), 0.0)

    # 2. Query: Seleccionamos al Usuario y el cálculo del promedio
    query = db.query(
        User,
        avg_rating_expr.label("computed_rating")
    ).join(
        WorkerProfile, User.id == WorkerProfile.user_id
    ).outerjoin(
        Review, User.id == Review.worker_id
    ).filter(
        User.role == Role.WORKER
    )

    # 3. Filtros de texto/lógica
    if q:
        query = query.filter(or_(
            User.nickname.ilike(f"%{q}%"),
            WorkerProfile.description.ilike(f"%{q}%"),
            WorkerProfile.profession.ilike(f"%{q}%")
        ))

    if city and city != "Todas las ciudades":
        query = query.filter(User.city == city)

    if profession and profession != "Todos los rubros":
        query = query.filter(WorkerProfile.profession == profession)

    # 4. Agrupamos por el ID del usuario (necesario para el AVG)
    query = query.group_by(User.id)

    # 5. EL FILTRO DE CALIFICACIÓN (HAVING)
    # Importante: min_rating viene del front como float
    if min_rating > 0:
        query = query.having(avg_rating_expr >= min_rating)

    results = query.all()

    # 6. Mapeo Manual (Crucial)
    # SQLAlchemy devuelve una lista de tuplas [(User, 4.5), (User, 0.0)]
    final_workers = []
    for user_obj, rating_val in results:
        # "Inyectamos" dinámicamente el rating en el objeto para que el Schema lo vea
        user_obj.rating = float(rating_val)
        final_workers.append(user_obj)

    print("--- DEBUG SQL START ---")
    print(f"Parámetros: q={q}, city={city}, profession={profession}, min_rating={min_rating}")
    # Esto imprime la consulta SQL real que se manda a la DB
    print(query.statement.compile(compile_kwargs={"literal_binds": True}))
    print("--- DEBUG SQL END ---")

    return final_workers


def get_worker_full_profile(db: Session, worker_id: int):
    """
    Obtiene el perfil completo de un trabajador, incluyendo su rating promedio
    y el listado detallado de reseñas con el nombre de quien las dejó.
    """
    # 1. Buscamos al usuario y verificamos que sea worker
    worker = db.query(User).filter(User.id == worker_id, User.role == Role.WORKER).first()

    if not worker:
        return None

    # 2. Calculamos el rating promedio al vuelo
    avg_rating = db.query(func.avg(Review.rating)).filter(Review.worker_id == worker_id).scalar()
    worker.rating = float(avg_rating) if avg_rating else 0.0

    # 3. Obtenemos las reseñas uniendo con la tabla Users para saber quién la escribió
    # Usamos una consulta que devuelva diccionarios o tuplas legibles para el Schema
    reviews_query = db.query(
        Review.id,
        Review.rating,
        Review.comment,
        User.nickname.label("reviewer_name")
    ).join(User, Review.reviewer_id == User.id).filter(Review.worker_id == worker_id).all()

    # 4. Inyectamos los datos dinámicamente en el objeto para que Pydantic los vea
    worker.reviews = reviews_query

    return worker