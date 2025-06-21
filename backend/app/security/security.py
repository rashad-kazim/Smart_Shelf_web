# security.py
# app/security/security.py

from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.core.config import settings
from app.database.connection import get_db
from app.database import models
from app.schemas import token_schemas
from app.crud import user_crud

from cryptography.fernet import Fernet

# Şifreleme bağlamını oluşturuyoruz. "bcrypt" en yaygın ve güvenli algoritmalardan biridir.
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# --- ŞİFRELEME FONKSİYONLARI BAŞLANGICI ---
cipher_suite = Fernet(settings.ENCRYPTION_KEY.encode())

# Bu şema, Swagger UI'a "Bearer Token" için basit bir metin kutusu göstermesini söyler.
bearer_scheme = HTTPBearer()

def encrypt_data(data: str) -> str:
    """Verilen string'i şifreler."""
    if not data:
        return data
    encrypted_data = cipher_suite.encrypt(data.encode())
    return encrypted_data.decode()
 
def decrypt_data(encrypted_data: str) -> str:
    """Şifrelenmiş veriyi çözer."""
    if not encrypted_data:
        return encrypted_data
    try:
        decrypted_data = cipher_suite.decrypt(encrypted_data.encode())
        return decrypted_data.decode()
    except Exception:
        # Eğer veri çözülemezse (geçersiz format vb.), boş veya bir hata string'i döndür.
        return ""

# Fernet şifreleme için gerekli anahtarı alıyoruz.
def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Girilen şifre ile hash'lenmiş şifreyi karşılaştırır."""
    return pwd_context.verify(plain_password, hashed_password)

# Şifreleme anahtarını ayarlıyoruz. Bu, .env dosyasından alınır.
def get_password_hash(password: str) -> str:
    """Verilen şifreyi hash'ler."""
    return pwd_context.hash(password)

# JWT token oluşturmak için gerekli fonksiyonlar
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """JWT access token üretir."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        # .env dosyasından gelen süre kadar geçerli bir token oluşturur.
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")
    return encoded_jwt

# Kullanıcıdan gelen token'ı doğrulamak için kullanılan fonksiyon
def get_current_user(
    db: Session = Depends(get_db), 
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)
) -> models.User:
    """
    HTTP 'Authorization' başlığından Bearer token'ı doğrular ve mevcut kullanıcıyı döndürür.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    token = credentials.credentials # Token'ı credentials nesnesinden alıyoruz
    
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = token_schemas.TokenData(email=email)
    except JWTError:
        raise credentials_exception
    
    user = user_crud.get_user_by_email(db, email=token_data.email)
    if user is None:
        raise credentials_exception
    return user
    """
    Token'ı doğrular ve mevcut kullanıcıyı döndürür. 
    Bu fonksiyon, korumalı endpoint'lerde dependency olarak kullanılacak.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = token_schemas.TokenData(email=email)
    except JWTError:
        raise credentials_exception
    
    user = user_crud.get_user_by_email(db, email=token_data.email)
    if user is None:
        raise credentials_exception
    return user