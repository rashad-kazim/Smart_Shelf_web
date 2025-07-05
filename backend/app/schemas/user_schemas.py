# app/schemas/user_schemas.py

from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from app.database.models import UserRole 

class UserBase(BaseModel):
    email: EmailStr
    name: str
    surname: str
    role: UserRole
    country: Optional[str] = None
    city: Optional[str] = None

class UserCreate(UserBase):
    password: str
    assigned_store_id: Optional[int] = None # Market kullanıcısı için
    profile_picture: Optional[str] = None # Profil resmi için Base64 data

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    name: Optional[str] = None
    surname: Optional[str] = None
    role: Optional[UserRole] = None
    country: Optional[str] = None
    city: Optional[str] = None
    is_active: Optional[bool] = None
    assigned_store_id: Optional[int] = None
    profile_picture: Optional[str] = None
    password: Optional[str] = None

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    role: str
    
    language: Optional[str] = None
    theme: Optional[str] = None

    # --- YENİ EKLENEN ALANLAR ---
    profile_picture: Optional[str] = None
    assigned_store_id: Optional[int] = None
    assigned_store_name: Optional[str] = None

    class Config:
        from_attributes = True

class UserPreferencesUpdate(BaseModel):
    language: Optional[str] = None
    theme: Optional[str] = None


class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    surname: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None # Yeni şifre için opsiyonel alan
    profile_picture: Optional[str] = None

class LoginResponse(BaseModel):
    user: UserResponse
    token: str
    token_type: str = "bearer"