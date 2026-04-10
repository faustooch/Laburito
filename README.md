# Laburito

## Descripcion
Proyecto web para conectar usuarios con profesionales por categorias. Incluye perfiles de trabajadores, busqueda, resenas de usuarios, autenticacion y un resumen de estadisticas.

## Arquitectura por dominio
Se refactorizo backend y frontend para organizar el codigo por dominios funcionales.

- Dominios backend: `auth`, `users`, `reviews`, `stats`, `professions`
- Dominios frontend: `auth`, `users`, `reviews`, `stats`, `professions`, `legal`
- Modulos compartidos:
  - Backend: `api/deps`, `core`, `db`
  - Frontend: `shared/components`, `shared/services`

## Estructura completa del proyecto
Nota: se listan archivos de codigo y configuracion del proyecto. Se omiten directorios generados (`Backend/.venv`, `Frontend/node_modules`, `Frontend/dist`, caches de Python).

```text
.
|-- README.md
|-- Backend/
|   |-- .env
|   |-- requirements.txt
|   |-- test_main.http
|   `-- app/
|       |-- main.py
|       |-- api/
|       |   `-- deps.py
|       |-- core/
|       |   |-- config.py
|       |   `-- security.py
|       |-- db/
|       |   |-- base.py
|       |   `-- session.py
|       `-- domains/
|           |-- auth/
|           |   |-- service.py
|           |   `-- api/
|           |       `-- routes.py
|           |-- professions/
|           |   `-- api/
|           |       `-- routes.py
|           |-- reviews/
|           |   |-- models.py
|           |   |-- repository.py
|           |   |-- schemas.py
|           |   |-- service.py
|           |   `-- api/
|           |       `-- routes.py
|           |-- stats/
|           |   |-- repository.py
|           |   |-- schemas.py
|           |   |-- service.py
|           |   `-- api/
|           |       `-- routes.py
|           `-- users/
|               |-- models.py
|               |-- repository.py
|               |-- schemas.py
|               |-- service.py
|               `-- api/
|                   `-- routes.py
`-- Frontend/
    |-- .gitignore
    |-- eslint.config.js
    |-- index.html
    |-- package-lock.json
    |-- package.json
    |-- README.md
    |-- vite.config.js
    |-- public/
    |   |-- favicon.svg
    |   |-- icons.svg
    |   `-- categories/
    |       |-- Aires.jpg
    |       |-- albañileria.jpg
    |       |-- carpinteria.jpg
    |       |-- cerrajeria.jpg
    |       |-- electricidad.jpg
    |       |-- fletes.webp
    |       |-- herreria.jpg
    |       |-- jardineria.jpg
    |       |-- limpieza.jpg
    |       |-- otro.webp
    |       |-- pintura.webp
    |       |-- plomeria.jpg
    |       `-- reparacionPC.webp
    `-- src/
        |-- App.css
        |-- index.css
        |-- main.jsx
        |-- assets/
        |   |-- hero.png
        |   |-- react.svg
        |   `-- vite.svg
        |-- app/
        |   |-- App.jsx
        |   `-- pages/
        |       `-- HomePage.jsx
        |-- domains/
        |   |-- auth/
        |   |   |-- context/
        |   |   |   `-- AuthContext.jsx
        |   |   |-- pages/
        |   |   |   |-- LoginPage.jsx
        |   |   |   `-- RegisterPage.jsx
        |   |   `-- services/
        |   |       `-- authService.js
        |   |-- legal/
        |   |   `-- pages/
        |   |       `-- TermsPage.jsx
        |   |-- professions/
        |   |   |-- components/
        |   |   |   |-- CategoryCard.jsx
        |   |   |   `-- CategorySlider.jsx
        |   |   |-- pages/
        |   |   |   |-- BecomeWorkerPage.jsx
        |   |   |   `-- SearchPage.jsx
        |   |   |-- services/
        |   |   |   `-- professionService.js
        |   |   `-- utils/
        |   |       `-- categoryImages.js
        |   |-- reviews/
        |   |   |-- components/
        |   |   |   |-- ReviewForm.jsx
        |   |   |   `-- ReviewList.jsx
        |   |   `-- services/
        |   |       `-- reviewService.js
        |   |-- stats/
        |   |   `-- services/
        |   |       `-- statsService.js
        |   `-- users/
        |       |-- components/
        |       |   |-- FeaturedWorkers.jsx
        |       |   |-- WorkerCard.jsx
        |       |   `-- WorkerTable.jsx
        |       |-- pages/
        |       |   |-- ProfilePage.jsx
        |       |   `-- WorkerProfilePage.jsx
        |       `-- services/
        |           `-- userService.js
        `-- shared/
            |-- components/
            |   |-- Footer.jsx
            |   |-- Header.jsx
            |   |-- ProtectedRoute.jsx
            |   `-- WelcomeBanner.jsx
            `-- services/
                `-- api.js
```

## Frontend
- Entrada en `src/main.jsx`.
- Router principal en `src/app/App.jsx`.
- Codigo funcional organizado por dominio en `src/domains/*`.
- Componentes y servicios reutilizables en `src/shared/*`.

## Backend
- Entrada de FastAPI en `app/main.py`.
- Dependencias compartidas en `app/api/deps.py`.
- Configuracion y seguridad en `app/core/*`.
- Sesion/base ORM en `app/db/*`.
- Dominio dividido en `app/domains/*` con `api`, `service`, `repository`, `schemas` y `models` segun corresponda.

## Tecnologias
Frontend:
- React 19
- Vite 8
- Tailwind CSS 4
- React Router 7
- Axios
- Google OAuth (`@react-oauth/google`)
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
Requisitos: Node.js (frontend), Python 3.10+ (backend) y PostgreSQL.

Backend:
```bash
cd Backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Frontend:
```bash
cd Frontend
npm install
npm run dev
```

## Variables de entorno
Crear `Backend/.env` con:

```env
GOOGLE_CLIENT_ID=tu_client_id
GOOGLE_CLIENT_SECRET=tu_client_secret
POSTGRES_PASSWORD=tu_password
SECRET_KEY=tu_secret

POSTGRES_SERVER=localhost
POSTGRES_USER=postgres
POSTGRES_DB=fastapi_db
POSTGRES_PORT=5432
```
