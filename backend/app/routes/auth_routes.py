# backend/app/routes/auth_routes.py

from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.crud import user_crud
from app.schemas import token_schemas, user_schemas # <-- user_schemas'ı da import edin
from app.security import security
from app.core.config import settings
from app.database import models

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


# --- TEK DEĞİŞİKLİK BU SATIRDA ---
# Önceki hatalı öneri: @router.post("/login", ...)
# Doğrusu:
@router.post("/token", response_model=user_schemas.LoginResponse)
# ---------------------------------
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    Kullanıcıyı doğrular, rolünü kontrol eder ve bir erişim jetonu oluşturur.
    """
    user = user_crud.authenticate_user(
        db, email=form_data.username, password=form_data.password
    )
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    if user.role == models.UserRole.Runner:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access to this web panel is not authorized for your role."
        )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    # --- DEĞİŞİKLİK 2: Cevabı Pydantic modeli olarak döndürün ---
    return user_schemas.LoginResponse(user=user, token=access_token)