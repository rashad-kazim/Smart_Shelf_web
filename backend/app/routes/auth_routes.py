# app/routes/auth_routes.py

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.schemas import token_schemas
from app.crud import user_crud
from app.security import security

# README'ye uygun olarak, bu endpoint'ler /api/auth altında olacak.
router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/login", response_model=token_schemas.LoginResponse)
async def login_for_access_token(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    # Kullanıcıyı e-posta (form_data.username) ve şifre ile doğrula
    user = user_crud.authenticate_user(db, email=form_data.username, password=form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Kullanıcı bilgileriyle (sub: subject) bir token oluştur
    access_token = security.create_access_token(
        data={"sub": user.email}
    )
    
    # README'deki yanıt formatına uygun olarak geri döndür
    return {"user": user, "token": access_token}