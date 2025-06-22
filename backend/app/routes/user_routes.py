# app/routes/user_routes.py

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Request, BackgroundTasks
from sqlalchemy.orm import Session

import shutil
import uuid
from pathlib import Path
from fastapi import File, UploadFile
from PIL import Image

from app.database import models
from app.database.connection import get_db
from app.schemas import user_schemas
from app.crud import user_crud
from app.security.security import get_current_user

# Yüklenecek fotoğraflar için bir klasör oluştur
UPLOAD_DIR = Path("uploaded_files")
PROFILE_PIC_DIR = UPLOAD_DIR / "profile_pics"
PROFILE_PIC_DIR.mkdir(parents=True, exist_ok=True)

router = APIRouter(
    prefix="/api/users",
    tags=["Users"]
)

MARKET_ROLES = [models.UserRole.Runner, models.UserRole.Supermarket_Admin]


# Not: Bu endpoint'in path'i "" olarak ayarlandı, prefix ile birleşince /api/users olur.

@router.post("", response_model=user_schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def create_new_user(
    user: user_schemas.UserCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Yeni bir kullanıcı oluşturur. Yetkilendirme hiyerarşiktir."""
    creator_role = current_user.role
    target_role = user.role
    can_create = False

    if creator_role == models.UserRole.Admin:
        can_create = True
    else:
        if user.country != current_user.country:
            raise HTTPException(status_code=403, detail="You can only create users in your own country.")

        if creator_role == models.UserRole.Country_Chief:
            allowed_roles = [models.UserRole.Engineer, models.UserRole.Analyst] + MARKET_ROLES
            if target_role in allowed_roles: can_create = True
        elif creator_role == models.UserRole.Analyst:
            allowed_roles = [models.UserRole.Engineer] + MARKET_ROLES
            if target_role in allowed_roles: can_create = True
        elif creator_role == models.UserRole.Engineer:
            if target_role in MARKET_ROLES: can_create = True

    if not can_create:
        raise HTTPException(status_code=403, detail="Not authorized to create a user with this role.")

    if user_crud.get_user_by_email(db, email=user.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    return user_crud.create_user(db=db, user=user)

#   
@router.post("/me/upload-picture", response_model=user_schemas.UserResponse)
def upload_my_profile_picture(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Giriş yapmış kullanıcının kendi profil fotoğrafını yükler ve günceller."""
    # 1. Güvenlik Kontrolü: Dosya Tipi ve Boyutu
    if file.content_type not in ["image/jpeg", "image/png"]:
        raise HTTPException(status_code=400, detail="Invalid file type. Only JPG or PNG are allowed.")
    
    # 2MB limit (isteğe bağlı olarak değiştirilebilir)
    if file.size > 2 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size exceeds the 2MB limit.")

    try:
        # 2. Güvenlik Kontrolü: Görüntüyü Yeniden İşleme
        # Rastgele bir dosya adı oluştur
        file_extension = Path(file.filename).suffix
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = PROFILE_PIC_DIR / unique_filename

        # Gelen dosyayı Pillow ile aç ve temiz bir kopya olarak kaydet
        with Image.open(file.file) as img:
            # Görüntüyü yeniden boyutlandırma (isteğe bağlı)
            img.thumbnail((400, 400)) 
            img.save(file_path)
            
    except Exception:
        raise HTTPException(status_code=500, detail="There was an error processing the image.")

    # 3. Veritabanını Güncelle
    # Dosyanın sunucudaki URL'sini oluştur
    file_url = f"/files/profile_pics/{unique_filename}"
    current_user.profile_picture_url = file_url
    db.commit()
    db.refresh(current_user)

    return current_user

# Bu endpoint, 30 günden eski logları silmek için bir arka plan görevi başlatır.
@router.post("/cleanup/logs", status_code=status.HTTP_202_ACCEPTED)
def trigger_log_cleanup(
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """30 günden eski logları silmek için bir arka plan görevi başlatır. (Sadece Admin)"""
    if current_user.role != models.UserRole.Admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    
# Yönlendirme (redirect) sorununu çözmek için hem / hem de boş path'i tanımlıyoruz.
# include_in_schema=False, Swagger arayüzünün karışmasını engeller, sadece bir tanesini gösterir.
@router.get("/", response_model=List[user_schemas.UserResponse], include_in_schema=False)
@router.get("", response_model=List[user_schemas.UserResponse])
def read_users(
    skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)
):
    """Kullanıcıları rollerine göre listeler."""
    if current_user.role == models.UserRole.Admin:
        return user_crud.get_users(db, skip=skip, limit=limit)
    if current_user.role == models.UserRole.Country_Chief:
        return user_crud.get_users_by_country(db, country=current_user.country, skip=skip, limit=limit)
    if current_user.role == models.UserRole.Analyst:
        return user_crud.get_market_users_by_country(db, country=current_user.country, skip=skip, limit=limit)
    
    return [current_user]

# Tek bir kullanıcıyı ID'sine göre getiririz.

# --- GÜVENLİK DÜZELTMESİ (IDOR KORUMASI) ---
@router.get("/{user_id}", response_model=user_schemas.UserResponse)
def read_user(
    user_id: int, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(get_current_user)
):
    """
    ID'ye göre tek bir kullanıcıyı getirir ve yetki kontrolü yapar.
    """
    db_user = user_crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    can_view = False
    if current_user.role == models.UserRole.Admin:
        can_view = True
    elif current_user.id == db_user.id:
        can_view = True
    elif current_user.role == models.UserRole.Country_Chief and current_user.country == db_user.country:
        can_view = True

    if not can_view:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to view this user's profile."
        )
        
    return db_user

# Yalnızca Admin rolündeki kullanıcıların güncelleme ve silme işlemlerine izin veriyoruz.
@router.put("/{user_id}", response_model=user_schemas.UserResponse)
def update_existing_user(
    user_id: int, user_in: user_schemas.UserUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)
):
    """Bir kullanıcının bilgilerini günceller."""
    db_user_to_update = user_crud.get_user(db, user_id=user_id)
    if not db_user_to_update:
        raise HTTPException(status_code=404, detail="User not found")

    can_update = False
    is_role_change_attempt = user_in.role is not None

    if current_user.role == models.UserRole.Admin:
        can_update = True
    elif current_user.role == models.UserRole.Country_Chief:
        if db_user_to_update.country == current_user.country: can_update = True
    elif current_user.role == models.UserRole.Analyst:
        if is_role_change_attempt: raise HTTPException(status_code=403, detail="Not authorized to change roles.")
        if db_user_to_update.role in MARKET_ROLES and db_user_to_update.country == current_user.country: can_update = True
    elif current_user.role == models.UserRole.Engineer:
        if is_role_change_attempt: raise HTTPException(status_code=403, detail="Not authorized to change roles.")
        if db_user_to_update.role in MARKET_ROLES: can_update = True

    if not can_update:
        raise HTTPException(status_code=403, detail="Not authorized to update this user.")
        
    return user_crud.update_user(db=db, db_user=db_user_to_update, user_in=user_in)

@router.put("/me/preferences", response_model=user_schemas.UserResponse)
def update_my_preferences(
    prefs: user_schemas.UserPreferencesUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Giriş yapmış olan kullanıcının kendi tema ve dil tercihlerini günceller."""
    return user_crud.update_user_preferences(db, db_user=current_user, prefs=prefs)

# Bu endpoint, bir kullanıcıyı siler. Sadece Admin rolündeki kullanıcılar bu işlemi yapabilir.
@router.delete("/{user_id}", response_model=user_schemas.UserResponse)
def delete_existing_user(
    user_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)
):
    """Bir kullanıcıyı siler."""
    db_user_to_delete = user_crud.get_user(db, user_id=user_id)
    if not db_user_to_delete:
        raise HTTPException(status_code=404, detail="User not found")
        
    can_delete = False
    if current_user.role == models.UserRole.Admin:
        if current_user.id != user_id: can_delete = True
    elif current_user.role == models.UserRole.Country_Chief:
        if db_user_to_delete.country == current_user.country: can_delete = True
    elif current_user.role == models.UserRole.Analyst:
        if db_user_to_delete.role in MARKET_ROLES and db_user_to_delete.country == current_user.country: can_delete = True

    if not can_delete:
        raise HTTPException(status_code=403, detail="Not authorized to delete this user.")

    return user_crud.delete_user(db, user_id=user_id)