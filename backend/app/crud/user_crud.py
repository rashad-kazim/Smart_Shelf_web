# app/crud/user_crud.py

from sqlalchemy.orm import Session,joinedload
from typing import Optional
from app.database import models
from app.schemas import user_schemas
from app.security import security

# --- YENİ EKLENEN FONKSİYON ---
def get_user(db: Session, user_id: int):
    """ID'ye göre tek bir kullanıcıyı getirir."""
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    """E-posta adresine göre kullanıcıyı getirir."""
    return db.query(models.User).filter(models.User.email == email).first()

def get_users(db: Session, user_type: str, current_user_id: int, skip: int = 0, limit: int = 100):
    """
    Kullanıcı tipine göre kullanıcıları GÜVENLİ bir şekilde listeler ve
    isteği yapan kullanıcının kendisini listeden hariç tutar.
    """
    # Sorguya Store tablosunu dahil ederek başlıyoruz (Runner'lar için gerekli)
    query = db.query(models.User).options(joinedload(models.User.store))

    # --- GÜVENLİK DÜZELTMESİ: user_type'a göre filtreleme ---
    if user_type == "company":
        query = query.filter(models.User.role.in_([
            models.UserRole.Admin,
            models.UserRole.Country_Chief,
            models.UserRole.Engineer,
            models.UserRole.Analyst
        ]))
    elif user_type == "supermarket":
        query = query.filter(models.User.role == models.UserRole.Runner)
    
    # Her zaman, isteği yapan kullanıcının kendisini sonuçlardan çıkar
    query = query.filter(models.User.id != current_user_id)

    users = query.offset(skip).limit(limit).all()

    # Runner kullanıcıları için mağaza ve lokasyon bilgilerini zenginleştir
    for user in users:
        if user.role == models.UserRole.Runner and user.store:
            user.assigned_store_name = user.store.name
            # Runner'ın ülkesi ve şehri, atandığı mağazadan gelir
            user.country = user.store.country 
            user.city = user.store.city

    return users

def create_user(db: Session, user: user_schemas.UserCreate):
    """Yeni bir kullanıcı oluşturur."""
    hashed_password = security.get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        hashed_password=hashed_password,
        name=user.name,
        surname=user.surname,
        role=user.role,
        country=user.country,
        # --- YENİ EKLENEN SATIR ---
        city=user.city, # Şehir bilgisini veritabanı modeline ekliyoruz.
        profile_picture=user.profile_picture,
        assigned_store_id=user.assigned_store_id
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# --- YENİ EKLENEN FONKSİYON ---
def update_user(db: Session, db_user: models.User, user_in: user_schemas.UserUpdate):
    """Mevcut bir kullanıcının bilgilerini günceller."""
    update_data = user_in.model_dump(exclude_unset=True)

    # --- YENİ EKLENEN BLOK: Şifre Güncelleme Mantığı ---
    if "password" in update_data and update_data["password"]:
        # Yeni şifreyi hash'le ve veritabanına öyle kaydet
        hashed_password = security.get_password_hash(update_data["password"])
        db_user.hashed_password = hashed_password
        # 'password' anahtarını update_data'dan çıkar ki düz metin olarak kaydedilmesin
        del update_data["password"]
    # --- BLOK SONU ---

    for key, value in update_data.items():
        setattr(db_user, key, value)
        
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
# -----------------------------

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

def update_user_preferences(db: Session, user: models.User, preferences: user_schemas.UserPreferencesUpdate):
    """Kullanıcının dil ve tema tercihlerini günceller."""
    if preferences.language is not None:
        user.language = preferences.language
    if preferences.theme is not None:
        user.theme = preferences.theme
    
    db.add(user)
    db.commit()
    db.refresh(user)
    return user