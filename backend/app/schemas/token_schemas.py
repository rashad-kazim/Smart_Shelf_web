# app/schemas/token_schemas.py

from pydantic import BaseModel
from typing import Optional  # HATA DÜZELTMESİ: Optional buraya eklendi
from . import user_schemas

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# README'ye uygun login yanıtı modeli
class LoginResponse(BaseModel):
    user: user_schemas.UserResponse
    token: str