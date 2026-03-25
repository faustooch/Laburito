# app/api/v1/routes/users.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.schemas.user import UserCreate, UserResponse, UserUpdate, WorkerProfileCreate, WorkerProfileUpdate, \
    WorkerFeaturedResponse
from app.services import user_service, review_service
from app.api.deps import get_current_user, get_db
from app.models.user import User, WorkerProfile
from app.models.review import Review
from sqlalchemy import func  # <--- Esta es la que falta

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    try:
        return user_service.create_user(db, user)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db)):
    return user_service.get_users(db)

# 1º RUTA ESTÁTICA (La única versión de /me que necesitamos)
@router.get("/me", response_model=UserResponse)
def get_user_me(current_user: User = Depends(get_current_user)):
    """
    Obtiene los datos del usuario actualmente logueado y su perfil específico según su rol.
    """
    return current_user

@router.post("/me/become-worker", response_model=UserResponse)
def become_worker(
    profile_data: WorkerProfileCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Convierte a un usuario normal (CLIENT) en trabajador (WORKER) y crea su perfil.
    """
    try:
        # Llamamos al SERVICIO, no al repositorio directamente
        # Usamos model_dump() para pasar el esquema de Pydantic a un diccionario normal
        updated_user = user_service.upgrade_to_worker(db, current_user, profile_data.model_dump())
        return updated_user
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/me/worker-profile", response_model=UserResponse)
def update_worker_profile(
        profile_update: WorkerProfileUpdate,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    """
    Actualiza los datos del perfil de trabajador del usuario logueado.
    """
    # Verificamos que el usuario realmente sea un trabajador
    if current_user.role != "worker" or not current_user.worker_profile:
        raise HTTPException(status_code=400, detail="El usuario no es un trabajador activo.")

    try:
        # Pydantic nos da un diccionario solo con los campos que el usuario envió (exclude_unset)
        update_data = profile_update.model_dump(exclude_unset=True)

        # Llamamos al servicio para actualizar (esto lo tenés que tener en user_service)
        updated_user = user_service.update_worker_profile(db, current_user.id, update_data)
        return updated_user
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# 2º RUTAS DINÁMICAS
@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = user_service.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/{user_id}", response_model=UserResponse)
def update_user(user_id: int, user_update: UserUpdate, db: Session = Depends(get_db)):
    user = user_service.update_user(db, user_id, user_update)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    result = user_service.delete_user(db, user_id)
    if not result:
        raise HTTPException(status_code=404, detail="User not found")
    return {"ok": True}


@router.get("/workers/featured", response_model=list[WorkerFeaturedResponse])
def get_featured_workers(db: Session = Depends(get_db)):
    """
    Retorna los trabajadores ordenados por su promedio de rating.
    """
    # Explicación del Query:
    # 1. Seleccionamos al Usuario y el promedio de sus ratings.
    # 2. Usamos label("rating") para que coincida con el campo de nuestro esquema Pydantic.
    # 3. Join con Review para calcular el promedio.
    # 4. Filtramos solo los que tienen rol 'worker'.

    results = db.query(
        User,
        func.coalesce(func.avg(Review.rating), 0).label("rating")
    ).outerjoin(
        Review, User.id == Review.worker_id
    ).filter(
        User.role == "worker",
        User.worker_profile != None
    ).group_by(User.id).order_by(
        func.avg(Review.rating).desc().nulls_last()
    ).limit(6).all()

    # 'results' es una lista de tuplas: [(UserObject, 4.5), (UserObject, 4.2), ...]
    # Necesitamos inyectar ese rating en el objeto User para que Pydantic lo vea
    featured_workers = []
    for user_obj, avg_rating in results:
        user_obj.rating = float(avg_rating)  # Asignamos el promedio al objeto
        featured_workers.append(user_obj)

    return featured_workers


@router.get("/workers/search", response_model=list[UserResponse])
def search_workers(
    q: str = None,
    city: str = None,
    profession: str = None,
    min_rating: float = 0.0,  # <-- Forzamos float y valor por defecto
    db: Session = Depends(get_db)
):
    # Pasamos el min_rating al servicio
    return user_service.search_workers(
        db,
        q=q,
        city=city,
        profession=profession,
        min_rating=min_rating
    )


@router.get("/workers/{worker_id}", response_model=UserResponse)
def get_worker_profile(worker_id: int, db: Session = Depends(get_db)):
    """
    Endpoint para obtener el perfil detallado de un trabajador por su ID.
    """
    # 1. Buscamos el perfil base del trabajador
    worker = user_service.get_worker_full_profile(db, worker_id)

    if not worker:
        raise HTTPException(
            status_code=404,
            detail="No se encontró el trabajador solicitado."
        )

    # 2. FORZAMOS la carga de reseñas usando el service de reviews
    # que SI trae el reviewer_id y el reviewer_name que pide el esquema.
    worker.reviews = review_service.get_worker_reviews(db, worker_id)

    return worker