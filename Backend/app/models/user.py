# app/models/user.py
import enum
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Enum as SQLEnum, Text
from sqlalchemy.orm import relationship
from app.db.base import Base


# Definimos los roles permitidos
class Role(str, enum.Enum):
    ADMIN = "admin"
    CLIENT = "client"
    WORKER = "worker"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    nickname = Column(String, nullable=False)
    password_hash = Column(String, nullable=True)
    google_id = Column(String, unique=True, index=True, nullable=True)
    auth_provider = Column(String, default="local")
    is_active = Column(Boolean, default=True)

    # Agregamos la columna de rol, por defecto todos nacen como clientes
    role = Column(SQLEnum(Role), default=Role.CLIENT, nullable=False)

    # Relaciones con los perfiles (Uno a Uno)
    worker_profile = relationship("WorkerProfile", back_populates="user", uselist=False)
    client_profile = relationship("ClientProfile", back_populates="user", uselist=False)


class WorkerProfile(Base):
    __tablename__ = "worker_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)

    # Atributos específicos del trabajador
    profession = Column(String, index=True, nullable=True)  # Ej: Plomero, Electricista
    description = Column(Text, nullable=True)
    contact_phone = Column(String, nullable=True)
    contact_email = Column(String, nullable=True)

    user = relationship("User", back_populates="worker_profile")


class ClientProfile(Base):
    __tablename__ = "client_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)

    # Atributos específicos del cliente
    contact_phone = Column(String, nullable=True)
    default_address = Column(String, nullable=True)

    user = relationship("User", back_populates="client_profile")