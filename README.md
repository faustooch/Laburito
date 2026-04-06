# Laburito

## Descripcion
Proyecto web para conectar usuarios con profesionales por categorias. Incluye perfiles de trabajadores, busqueda, reseñas de usuarios, autenticacion y un resumen de estadisticas.

## Estructura del proyecto
```
Backend/
  app/
    api/
      v1/
        routes/        # Endpoints REST
    core/              # Configuracion y seguridad
    db/                # Sesion y base ORM
    models/            # Modelos SQLAlchemy
    repositories/      # Acceso a datos
    schemas/           # Esquemas Pydantic
    services/          # Logica de negocio
Frontend/
  src/
    components/        # Componentes UI reutilizables
    context/           # Estado global (auth)
    pages/             # Vistas y rutas
    services/          # Cliente de API
    utils/             # Helpers
```

## Frontend
- Entrada en `src/main.jsx` y composicion principal en `src/App.jsx`.
- `components/` contiene tarjetas, sliders, header, footer y formularios de reseñas.
- `pages/` agrupa las pantallas principales: home, login, registro, perfil y busqueda.
- `context/` maneja el estado de autenticacion y el token.
- `services/` centraliza llamadas HTTP al backend con Axios.
- `utils/` incluye helpers como el mapeo de imagenes de categorias.

## Backend
- `app/main.py` inicializa FastAPI, CORS, crea tablas y monta los routers.
- `api/v1/routes/` expone endpoints de auth, usuarios, profesiones, resenas y estadisticas.
- `core/` contiene configuracion desde .env y utilidades de seguridad (hash y JWT).
- `db/` define la sesion SQLAlchemy y la base declarativa.
- `models/`, `schemas/`, `repositories/` y `services/` separan dominio, validacion, acceso a datos y logica.

## Tecnologias
Frontend:
- React 19, Vite 8
- Tailwind CSS 4
- React Router 7
- Axios
- Google OAuth (@react-oauth/google)
- ESLint

Backend:
- Python
- FastAPI
- SQLAlchemy
- Pydantic Settings
- PostgreSQL
- JWT y bcrypt para autenticacion
- OAuth2 Password Flow y login con Google

## Instalacion
Requisitos: Node.js (para el front), Python 3.10+ y una base PostgreSQL en ejecucion.

Backend:
```
cd Backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Frontend:
```
cd Frontend
npm install
npm run dev
```

## Variables de entorno
Crear un archivo `Backend/.env` con los siguientes valores:

```
GOOGLE_CLIENT_ID=tu_client_id
GOOGLE_CLIENT_SECRET=tu_client_secret
POSTGRES_PASSWORD=tu_password
SECRET_KEY=tu_secret

POSTGRES_SERVER=localhost
POSTGRES_USER=postgres
POSTGRES_DB=fastapi_db
POSTGRES_PORT=5432
```
