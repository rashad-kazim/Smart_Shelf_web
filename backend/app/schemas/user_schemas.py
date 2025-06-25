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

class UserCreate(UserBase):
    password: str

# --- YENİ EKLENEN ŞEMA ---
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
    created_at: datetime

    class Config:
        from_attributes = True