# app/models/review.py
from sqlalchemy import Column, Integer, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)

    # ID del cliente que deja la reseña
    reviewer_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # ID del trabajador que recibe la reseña
    worker_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Calificación (1 a 5)
    rating = Column(Integer, nullable=False)

    # Comentario opcional
    comment = Column(Text, nullable=True)

    # Relaciones para navegar fácilmente desde la reseña hacia los usuarios
    reviewer = relationship("User", foreign_keys=[reviewer_id])
    worker = relationship("User", foreign_keys=[worker_id])