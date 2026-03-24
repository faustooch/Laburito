from fastapi import FastAPI
from app.db.session import engine
from app.db.base import Base

# Importamos los modelos para que SQLAlchemy los registre y cree las tablas
from app.models import user
from app.models import review

# Importamos el router de usuarios
from app.api.v1.routes import users
from app.api.v1.routes import auth
from app.api.v1.routes import reviews

# Crea las tablas en la base de datos si no existen
Base.metadata.create_all(bind=engine)

# Inicializamos la app de FastAPI
app = FastAPI(title="API de Usuarios", version="1.0.0")

# Incluimos las rutas de usuarios
app.include_router(auth.router, prefix="/api/v1")
app.include_router(users.router, prefix="/api/v1")
app.include_router(reviews.router, prefix="/api/v1")

# Dejamos solo un endpoint raíz simple para verificar que la API funciona
@app.get("/")
def root():
    return {"mensaje": "API de Usuarios funcionando correctamente"}