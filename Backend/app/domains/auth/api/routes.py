from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.core.security import create_access_token
from app.domains.users.schemas import GoogleToken
from app.domains.auth import service as auth_service
router = APIRouter(prefix="/auth", tags=["auth"])
@router.post("/login")
def login(
        db: Session = Depends(get_db),
        form_data: OAuth2PasswordRequestForm = Depends()
):
    user = auth_service.authenticate_standard(
        db=db,
        email=form_data.username,
        password=form_data.password
    )
    return {
        "access_token": create_access_token(user.id),
        "token_type": "bearer"
    }

@router.post("/google")
def login_google(
        token_data: GoogleToken,
        db: Session = Depends(get_db)
):
    user = auth_service.authenticate_google(
        db=db,
        auth_code=token_data.token
    )
    return {
        "access_token": create_access_token(user.id),
        "token_type": "bearer"
    }