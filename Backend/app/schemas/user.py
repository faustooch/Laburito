# app/schemas/user.py
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from app.models.user import Role  # Asegurate de tener este Enum en models/user.py


# --------- Requests (Lo que el cliente nos envía) ---------

class UserCreate(BaseModel):
    email: EmailStr
    nickname: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=8, max_length=100)


class UserUpdate(BaseModel):
    # Mantenemos el tuyo intacto para no romper la ruta PUT
    nickname: Optional[str] = Field(None, min_length=3, max_length=50)
    # Opcional: Si el día de mañana querés dejar que cambien su contraseña
    # password: Optional[str] = Field(None, min_length=8, max_length=100)

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
    role: Role  # Sumamos el rol

    # Incluimos los perfiles (serán null si el usuario no tiene ese rol)
    worker_profile: Optional[WorkerProfileResponse] = None
    client_profile: Optional[ClientProfileResponse] = None

    class Config:
        from_attributes = True