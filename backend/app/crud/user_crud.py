# app/crud/user_crud.py

from sqlalchemy.orm import Session
from typing import Optional
from app.database import models
from app.schemas import user_schemas
from app.security import security

# --- YENİ EKLENEN FONKSİYON ---
def get_user(db: Session, user_id: int):
    """ID'ye göre tek bir kullanıcıyı getirir."""
    return db.query(models.User).filter(models.User.id == user_id).first()
# -----------------------------

def get_user_by_email(db: Session, email: str):
    """E-posta adresine göre kullanıcıyı getirir."""
    return db.query(models.User).filter(models.User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    """Veritabanındaki tüm kullanıcıları listeler."""
    return db.query(models.User).offset(skip).limit(limit).all()

# --- YENİ EKLENEN FONKSİYON ---
def get_users_by_country(db: Session, country: str, skip: int = 0, limit: int = 100):
    """Belirli bir ülkedeki kullanıcıları listeler."""
    return db.query(models.User).filter(models.User.country == country).offset(skip).limit(limit).all()
# --- EKLENEN FONKSİYONUN SONU ---

def create_user(db: Session, user: user_schemas.UserCreate):
    """Yeni bir kullanıcı oluşturur."""
    hashed_password = security.get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        hashed_password=hashed_password,
        name=user.name,
        surname=user.surname,
        role=user.role,
        country=user.country
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# --- YENİ EKLENEN FONKSİYON ---
def update_user(db: Session, db_user: models.User, user_in: user_schemas.UserUpdate):
    """Mevcut bir kullanıcının bilgilerini günceller."""
    update_data = user_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_user, key, value)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
# -----------------------------

def update_user_preferences(db: Session, db_user: models.User, prefs: user_schemas.UserPreferencesUpdate):
    """Bir kullanıcının tema ve dil tercihlerini günceller."""
    if prefs.theme is not None:
        db_user.preferred_theme = prefs.theme
    if prefs.language is not None:
        db_user.preferred_language = prefs.language
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# --- YENİ EKLENEN FONKSİYON ---
def delete_user(db: Session, user_id: int):
    """Bir kullanıcıyı siler."""
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user:
        db.delete(db_user)
        db.commit()
    return db_user
# -----------------------------

def authenticate_user(db: Session, email: str, password: str) -> Optional[models.User]:
    """Kullanıcıyı doğrular. Başarılıysa kullanıcıyı, değilse None döndürür."""
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not security.verify_password(password, user.hashed_password):
        return None
    return user
