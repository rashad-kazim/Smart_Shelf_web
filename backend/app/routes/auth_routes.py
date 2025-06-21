# app/routes/auth_routes.py

from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

# DÜZELTME: Limiter artık kendi dosyasından import ediliyor.
from app.core.limiter import limiter
from app.database import models
from app.database.connection import get_db
from app.schemas import token_schemas
from app.crud import user_crud
from app.security.security import create_access_token # Sadece create_access_token'a ihtiyacımız var burada

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/login", response_model=token_schemas.LoginResponse)
@limiter.limit("3/5minute")
async def login_for_access_token(
    request: Request,
    db: Session = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
):
    user = user_crud.authenticate_user(db, email=form_data.username, password=form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    COMPANY_ROLES = [
        models.UserRole.Admin,
        models.UserRole.Country_Chief,
        models.UserRole.Analyst,
        models.UserRole.Engineer
    ]
    
    if user.role not in COMPANY_ROLES:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This user account does not have permission to access the web panel."
        )

    access_token = create_access_token(
        data={"sub": user.email}
    )

    return {"user": user, "token": access_token}