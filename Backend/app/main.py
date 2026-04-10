from fastapi import FastAPI
from app.db.session import engine
from app.db.base import Base
from fastapi.middleware.cors import CORSMiddleware

# Importamos los modelos para que SQLAlchemy los registre y cree las tablas
from app.domains.users import models as user
from app.domains.reviews import models as review

# Importamos el router de usuarios
from app.domains.users.api import routes as users
from app.domains.auth.api import routes as auth
from app.domains.reviews.api import routes as reviews
from app.domains.professions.api import routes as professions
from app.domains.stats.api import routes as stats

# Crea las tablas en la base de datos si no existen
Base.metadata.create_all(bind=engine)

# Inicializamos la app de FastAPI
app = FastAPI(title="API de Usuarios", version="1.0.0")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# 3. Agregamos el middleware al motor de FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            # Lista de URLs permitidas
    allow_credentials=True,           # Permitir envío de cookies/tokens
    allow_methods=["*"],              # Permitir todos los métodos (GET, POST, etc.)
    allow_headers=["*"],              # Permitir todos los headers
)

# Incluimos las rutas de usuarios
app.include_router(auth.router, prefix="/api/v1")
app.include_router(users.router, prefix="/api/v1")
app.include_router(reviews.router, prefix="/api/v1")
app.include_router(professions.router, prefix="/api/v1")
app.include_router(stats.router, prefix="/api/v1")

# Dejamos solo un endpoint raíz simple para verificar que la API funciona
@app.get("/")
def root():
    return {"mensaje": "API de Usuarios funcionando correctamente"}