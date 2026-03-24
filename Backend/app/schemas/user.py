# app/schemas/user.py
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from app.models.user import Role
from datetime import date


# --------- Requests (Lo que el cliente nos envía) ---------

class UserCreate(BaseModel):
    email: EmailStr
    nickname: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=8, max_length=100)


class UserUpdate(BaseModel):
    nickname: Optional[str] = Field(None, min_length=3, max_length=50)
    # --- SUMAMOS ESTOS CAMPOS PARA EL PUT /users/{id} ---
    city: Optional[str] = None
    address: Optional[str] = None
    date_of_birth: Optional[date] = None

# Agregalo debajo de UserUpdate
class WorkerProfileCreate(BaseModel):
    profession: str = Field(..., min_length=3, max_length=50)
    description: str = Field(..., min_length=10, max_length=500)
    contact_phone: str = Field(..., min_length=8, max_length=20)
    contact_email: EmailStr


class GoogleToken(BaseModel):
    token: str


# --------- Responses (Lo que nosotros le devolvemos al cliente) ---------

# Esquemas para los perfiles específicos
class WorkerProfileResponse(BaseModel):
    profession: Optional[str]
    description: Optional[str]
    contact_phone: Optional[str]
    contact_email: Optional[EmailStr]  # <-- Lo agregamos a la respuesta

    class Config:
        from_attributes = True

class WorkerProfileUpdate(BaseModel):
    profession: Optional[str] = Field(None, min_length=3, max_length=50)
    description: Optional[str] = Field(None, min_length=10, max_length=500)
    contact_phone: Optional[str] = Field(None, min_length=8, max_length=20)
    contact_email: Optional[EmailStr] = None


class ClientProfileResponse(BaseModel):
    contact_phone: Optional[str]
    default_address: Optional[str]

    class Config:
        from_attributes = True


# La respuesta principal del usuario
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

    prueba_patata: str = "estoy_vivo"

    worker_profile: Optional[WorkerProfileResponse] = None
    client_profile: Optional[ClientProfileResponse] = None

    class Config:
        from_attributes = True

# app/schemas/user.py
class WorkerFeaturedResponse(BaseModel):
    id: int
    nickname: str
    profile_picture_url: Optional[str] = None
    city: Optional[str] = None
    rating: float = 0.0 # <--- Imprescindible
    worker_profile: Optional[WorkerProfileResponse] = None

    class Config:
        from_attributes = True