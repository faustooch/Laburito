# app/schemas/user.py
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from app.models.user import Role
from datetime import date
from app.schemas.review import ReviewDetail  # <--- Importamos el detalle de reseña


# --------- Requests ---------

class UserCreate(BaseModel):
    email: EmailStr
    nickname: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=8, max_length=100)


class UserUpdate(BaseModel):
    nickname: Optional[str] = Field(None, min_length=3, max_length=50)
    city: Optional[str] = None
    address: Optional[str] = None
    date_of_birth: Optional[date] = None


class WorkerProfileCreate(BaseModel):
    profession: str = Field(..., min_length=3, max_length=50)
    description: str = Field(..., min_length=10, max_length=500)
    contact_phone: str = Field(..., min_length=8, max_length=20)
    contact_email: EmailStr


class WorkerProfileUpdate(BaseModel):
    profession: Optional[str] = Field(None, min_length=3, max_length=50)
    description: Optional[str] = Field(None, min_length=10, max_length=500)
    contact_phone: Optional[str] = Field(None, min_length=8, max_length=20)
    contact_email: Optional[EmailStr] = None


class GoogleToken(BaseModel):
    token: str


# --------- Responses ---------

class WorkerProfileResponse(BaseModel):
    profession: Optional[str]
    description: Optional[str]
    contact_phone: Optional[str]
    contact_email: Optional[EmailStr]

    class Config:
        from_attributes = True


class ClientProfileResponse(BaseModel):
    contact_phone: Optional[str]
    default_address: Optional[str]

    class Config:
        from_attributes = True


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    nickname: str
    is_active: bool
    role: Role
    auth_provider: str
    city: Optional[str] = None
    address: Optional[str] = None
    date_of_birth: Optional[date] = None
    profile_picture_url: Optional[str] = None

    # Datos dinámicos para el perfil del trabajador
    rating: float = 0.0
    reviews: List[ReviewDetail] = []  # <--- Lista de reseñas detalladas

    worker_profile: Optional[WorkerProfileResponse] = None
    client_profile: Optional[ClientProfileResponse] = None

    class Config:
        from_attributes = True


class WorkerFeaturedResponse(BaseModel):
    id: int
    nickname: str
    profile_picture_url: Optional[str] = None
    city: Optional[str] = None
    rating: float = 0.0
    worker_profile: Optional[WorkerProfileResponse] = None

    class Config:
        from_attributes = True