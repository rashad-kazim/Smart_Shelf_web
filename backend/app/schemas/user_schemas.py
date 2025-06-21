# app/schemas/user_schemas.py

from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from app.database.models import UserRole 

class UserBase(BaseModel):
    email: EmailStr
    name: str = Field(..., max_length=100)
    surname: str = Field(..., max_length=100)
    role: UserRole
    country: Optional[str] = Field(..., max_length=100)

class UserCreate(UserBase):
    password: str

class UserPreferencesUpdate(BaseModel):
    theme: Optional[str] = Field(None, pattern=r'^(light|dark)$')
    language: Optional[str] = Field(None, pattern=r'^(en|tr|pl)$')

# Kullanıcı güncellerken alınacak veriler. Tüm alanlar opsiyoneldir.
class UserUpdate(BaseModel):
    name: Optional[str] = None
    surname: Optional[str] = None
    role: Optional[UserRole] = None
    country: Optional[str] = None
    is_active: Optional[bool] = None
# -------------------------

class UserResponse(UserBase):
    id: int
    is_active: bool
    preferred_theme: str
    preferred_language: str
    created_at: datetime

    class Config:
        from_attributes = True