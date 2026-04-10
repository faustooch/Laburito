# app/models/user.py
import enum
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Enum as SQLEnum, Text, Date
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
    auth_provider = Column(String, default="local")  # 'local' o 'google'
    is_active = Column(Boolean, default=True)
    role = Column(SQLEnum(Role), default=Role.CLIENT, nullable=False)

    # --- NUEVAS COLUMNAS DE DATOS BASE ---
    city = Column(String, nullable=True)
    address = Column(String, nullable=True)
    date_of_birth = Column(Date, nullable=True)  # Usamos tipo Date real

    # --- NUEVA COLUMNA DE FOTO ---
    # Guardamos la URL, sea de Google o de nuestro servidor
    profile_picture_url = Column(String, nullable=True)

    # Relaciones con los perfiles (Uno a Uno)
    worker_profile = relationship("WorkerProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    client_profile = relationship("ClientProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")


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