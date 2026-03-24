# app/api/v1/routes/auth.py
import requests # <-- IMPORTANTE: Necesitamos requests para hacer el canje
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
    user = user_repository.get_user_by_email(db, email=form_data.username)

    if not user or not user.password_hash:
        raise HTTPException(status_code=400, detail="Email o contraseña incorrectos")

    if not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Email o contraseña incorrectos")

    return {
        "access_token": create_access_token(user.id),
        "token_type": "bearer"
    }


# app/api/v1/routes/auth.py
# ... tus imports arriba (asegurate de tener `import requests`) ...

@router.post("/google")
def login_google(token_data: GoogleToken, db: Session = Depends(get_db)):
    print("\n--- INICIANDO LOGIN GOOGLE ---")
    print("1. [BACKEND] Petición recibida en /google")
    try:
        print("2. [BACKEND] Intercambiando código con Google...")
        token_url = "https://oauth2.googleapis.com/token"
        payload = {
            "code": token_data.token,
            "client_id": settings.GOOGLE_CLIENT_ID,
            "client_secret": settings.GOOGLE_CLIENT_SECRET,
            "redirect_uri": "postmessage",
            "grant_type": "authorization_code",
        }

        # Le ponemos un timeout de 10 segundos para que no se cuelgue infinito
        response = requests.post(token_url, data=payload, timeout=10)
        print("3. [BACKEND] Respuesta de Google recibida. Status:", response.status_code)

        token_info = response.json()
        if "error" in token_info:
            print("!!! Error de Google al canjear:", token_info)
            raise ValueError("El código de autorización es inválido o ya fue usado.")

        google_id_token = token_info.get("id_token")
        print("4. [BACKEND] ID Token obtenido. Validando firma...")

        idinfo = id_token.verify_oauth2_token(
            google_id_token,
            google_requests.Request(),
            settings.GOOGLE_CLIENT_ID
        )
        print("5. [BACKEND] Token validado. Email del usuario:", idinfo.get('email'))

        email = idinfo['email']
        name = idinfo.get('name', 'Usuario de Google')
        google_id = idinfo['sub']
        picture_url = idinfo.get('picture')

        print("6. [BACKEND] Buscando usuario en la Base de Datos...")
        user = user_repository.get_user_by_email(db, email=email)

        if not user:
            print("7. [BACKEND] Usuario no existe. Creando uno nuevo...")
            new_user_data = {
                "email": email,
                "nickname": name.replace(" ", "_").lower()[:50],
                "password_hash": None,
                "google_id": google_id,
                "auth_provider": "google",
                "profile_picture_url": picture_url
            }
            user = user_repository.create_user(db, new_user_data)
            print("8. [BACKEND] Usuario creado con éxito. ID:", user.id)
        else:
            print("7. [BACKEND] Usuario existente encontrado. ID:", user.id)

        print("9. [BACKEND] Generando token local de FastAPI y devolviendo...")
        return {
            "access_token": create_access_token(user.id),
            "token_type": "bearer"
        }

    except Exception as e:
        # Si explota CUALQUIER COSA, la atrapamos acá y la imprimimos
        print("!!! [BACKEND] ERROR FATAL CATCH !!! ->", str(e))
        raise HTTPException(status_code=401, detail=f"Error interno: {str(e)}")