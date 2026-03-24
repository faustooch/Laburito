# app/api/v1/routes/users.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.schemas.user import UserCreate, UserResponse, UserUpdate, WorkerProfileCreate
from app.services import user_service
from app.api.deps import get_current_user, get_db
from app.models.user import User

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