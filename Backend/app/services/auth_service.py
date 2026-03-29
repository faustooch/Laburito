# app/services/auth_service.py
import requests
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from app.core.config import settings
from app.repositories import user_repository
from app.core.security import verify_password


def authenticate_standard(db: Session, email: str, password: str):
    """Valida credenciales estándar y devuelve el usuario."""
    user = user_repository.get_user_by_email(db, email=email)

    if not user or not user.password_hash:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos"
        )

    if not verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos"
        )

    return user


def authenticate_google(db: Session, auth_code: str):
    """Intercambia el código, valida el JWT de Google y busca/crea al usuario."""
    token_url = "https://oauth2.googleapis.com/token"
    payload = {
        "code": auth_code,
        "client_id": settings.GOOGLE_CLIENT_ID,
        "client_secret": settings.GOOGLE_CLIENT_SECRET,
        "redirect_uri": "postmessage",
        "grant_type": "authorization_code",
    }

    # 1. Petición a Google (Aislamos fallas de red)
    try:
        response = requests.post(token_url, data=payload, timeout=10)
        token_info = response.json()
    except requests.RequestException:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Error de comunicación con los servidores de Google."
        )

    if "error" in token_info:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El código de autorización es inválido o ya fue usado."
        )

    # 2. Validación de la firma del token
    try:
        idinfo = id_token.verify_oauth2_token(
            token_info.get("id_token"),
            google_requests.Request(),
            settings.GOOGLE_CLIENT_ID
        )
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="La firma del token de Google es inválida."
        )

    # 3. Lógica de Base de Datos
    email = idinfo['email']
    user = user_repository.get_user_by_email(db, email=email)

    if not user:
        new_user_data = {
            "email": email,
            "nickname": idinfo.get('name', 'Usuario').replace(" ", "_").lower()[:50],
            "password_hash": None,
            "google_id": idinfo['sub'],
            "auth_provider": "google",
            "profile_picture_url": idinfo.get('picture')
        }
        # Si falla la creación, SQLAlchemy lanzará un error que será manejado
        # globalmente como 500, no como un 401 falso.
        user = user_repository.create_user(db, new_user_data)

    return user