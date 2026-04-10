# app/api/v1/routes/users.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.domains.users.schemas import (
    UserCreate, UserResponse, UserUpdate,
    WorkerProfileCreate, WorkerProfileUpdate, WorkerFeaturedResponse
)
from app.domains.users import service as user_service
from app.domains.reviews import service as review_service
from app.api.deps import get_current_user, get_db
from app.domains.users.models import User

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


@router.get("/me", response_model=UserResponse)
def get_user_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/me/become-worker", response_model=UserResponse)
def become_worker(
        profile_data: WorkerProfileCreate,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    try:
        return user_service.upgrade_to_worker(db, current_user, profile_data.model_dump())
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/me/worker-profile", response_model=UserResponse)
def update_worker_profile(
        profile_update: WorkerProfileUpdate,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    if current_user.role != "worker" or not current_user.worker_profile:
        raise HTTPException(status_code=400, detail="El usuario no es un trabajador activo.")
    try:
        update_data = profile_update.model_dump(exclude_unset=True)
        return user_service.update_worker_profile(db, current_user.id, update_data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/me/worker-profile", status_code=status.HTTP_200_OK)
def downgrade_worker_profile(
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    try:
        user_service.downgrade_worker(db=db, user_id=current_user.id)
        return {"message": "Perfil de trabajador dado de baja exitosamente"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/workers/featured", response_model=list[WorkerFeaturedResponse])
def get_featured_workers(db: Session = Depends(get_db)):
    return user_service.get_featured_workers(db)


@router.get("/workers/search", response_model=list[UserResponse])
def search_workers(
        q: str = None,
        city: str = None,
        profession: str = None,
        min_rating: float = 0.0,
        db: Session = Depends(get_db)
):
    return user_service.search_workers(db, q=q, city=city, profession=profession, min_rating=min_rating)


@router.get("/workers/{worker_id}", response_model=UserResponse)
def get_worker_profile(worker_id: int, db: Session = Depends(get_db)):
    worker = user_service.get_worker_full_profile(db, worker_id)
    if not worker:
        raise HTTPException(status_code=404, detail="No se encontró el trabajador solicitado.")

    # Mantenemos la lógica de forzar las reseñas por si el servicio anterior no las mapea completas
    worker.reviews = review_service.get_worker_reviews(db, worker_id)
    return worker


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