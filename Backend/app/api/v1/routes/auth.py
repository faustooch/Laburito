# app/api/v1/routes/auth.py
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.core.config import settings
from app.repositories import user_repository
from app.core.security import verify_password, create_access_token

from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from app.schemas.user import GoogleToken
router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login")
def login(
        db: Session = Depends(get_db),
        form_data: OAuth2PasswordRequestForm = Depends()
):
    # OAuth2 usa 'username' por defecto, nosotros le pediremos al usuario que ponga su email ahí
    user = user_repository.get_user_by_email(db, email=form_data.username)

    # Verificamos que el usuario exista y que la contraseña coincida
    # Primero verificamos si el usuario existe y si tiene una contraseña local guardada
    if not user or not user.password_hash:
        raise HTTPException(status_code=400, detail="Email o contraseña incorrectos")

    # Si tiene contraseña local, ahí recién la comparamos
    if not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Email o contraseña incorrectos")

    # Si todo está bien, generamos y devolvemos el token
    return {
        "access_token": create_access_token(user.id),
        "token_type": "bearer"
    }


@router.post("/google")
def login_google(token_data: GoogleToken, db: Session = Depends(get_db)):
    try:
        # 1. Validamos el token con los servidores de Google
        idinfo = id_token.verify_oauth2_token(
            token_data.token,
            google_requests.Request(),
            settings.GOOGLE_CLIENT_ID
        )

        # 2. Extraemos la info del usuario desde el token validado
        email = idinfo['email']
        name = idinfo.get('name', 'Usuario de Google')
        google_id = idinfo['sub']  # 'sub' es el ID único del usuario en Google

        # 3. Buscamos si ya existe en nuestra base de datos
        user = user_repository.get_user_by_email(db, email=email)

        if not user:
            # Si no existe, lo creamos automáticamente
            new_user_data = {
                "email": email,
                # Generamos un nickname temporal basado en su nombre
                "nickname": name.replace(" ", "_").lower()[:50],
                "password_hash": None,  # No tiene contraseña local
                "google_id": google_id,
                "auth_provider": "google"
            }
            # OJO: Aquí no usamos el user_service.create_user porque ese espera una contraseña plana.
            # Lo guardamos directo con el repositorio.
            user = user_repository.create_user(db, new_user_data)

        # 4. Generamos nuestro JWT local para el usuario
        return {
            "access_token": create_access_token(user.id),
            "token_type": "bearer"
        }

    except ValueError:
        # Si el token es inventado, expiró, o no es de tu CLIENT_ID
        raise HTTPException(status_code=401, detail="Token de Google inválido o expirado")