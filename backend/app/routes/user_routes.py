from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Request, BackgroundTasks
from sqlalchemy.orm import Session

from app.database import models
from app.database.connection import get_db
from app.schemas import user_schemas
from app.crud import user_crud
from app.security.security import get_current_user

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
    """
    Yeni bir kullanıcı oluşturur. Yetkilendirme hiyerarşiye göredir.
    """
    creator_role = current_user.role
    target_role = user.role
    can_create = False

    # --- YENİ ve DETAYLI YETKİLENDİRME MANTIĞI ---
    if creator_role == models.UserRole.Admin:
        can_create = True
        
    elif creator_role == models.UserRole.Country_Chief:
        allowed_roles = [models.UserRole.Engineer, models.UserRole.Analyst] + MARKET_ROLES
        if target_role in allowed_roles and user.country == current_user.country:
            can_create = True
            
    elif creator_role == models.UserRole.Analyst:
        allowed_roles = [models.UserRole.Engineer] + MARKET_ROLES
        if target_role in allowed_roles:
            can_create = True
            
    elif creator_role == models.UserRole.Engineer:
        if target_role in MARKET_ROLES:
            can_create = True

    if not can_create:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to create a user with this role."
        )
    # --- YETKİLENDİRME SONU ---

    db_user = user_crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    return user_crud.create_user(db=db, user=user)

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
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Kullanıcıları rollerine göre listeler:
    - Admin: Tüm kullanıcıları görür.
    - Country Chief: Sadece kendi ülkesindeki kullanıcıları görür.
    - Diğerleri: Sadece kendi bilgilerini görür.
    """
    # HATA DÜZELTMESİ: Karşılaştırmayı doğrudan Enum üyesi ile yapıyoruz.
    if current_user.role is models.UserRole.Admin:
        users = user_crud.get_users(db, skip=skip, limit=limit)
    elif current_user.role is models.UserRole.Country_Chief:
        users = user_crud.get_users_by_country(db, country=current_user.country, skip=skip, limit=limit)
    else:
        # Diğer roller (Engineer, Analyst vb.) sadece kendi bilgilerini görebilir.
        users = [current_user]
        
    return users
# --- DÜZELTME SONU ---

# Tek bir kullanıcıyı ID'sine göre getiririz.
@router.get("/{user_id}", response_model=user_schemas.UserResponse)
def read_user(
    user_id: int, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(get_current_user)
):
    """
    ID'ye göre tek bir kullanıcıyı getirir.
    """
    db_user = user_crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

# Yalnızca Admin rolündeki kullanıcıların güncelleme ve silme işlemlerine izin veriyoruz.
@router.put("/{user_id}", response_model=user_schemas.UserResponse)
def update_existing_user(
    user_id: int,
    user_in: user_schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Bir kullanıcının bilgilerini günceller.
    - Admin herkesi güncelleyebilir.
    - Country Chief kendi ülkesindeki kendinden düşük rolleri güncelleyebilir.
    - Diğerleri güncelleme yapamaz.
    """
    creator_role = current_user.role
    can_update = False

    db_user_to_update = user_crud.get_user(db, user_id=user_id)
    if not db_user_to_update:
        raise HTTPException(status_code=404, detail="User not found")
        
    # KURAL: Analist rol değişikliği yapamaz. (ve diğerleri de)
    if user_in.role is not None and creator_role not in [models.UserRole.Admin, models.UserRole.Country_Chief]:
         raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to change user roles."
        )

    if creator_role == models.UserRole.Admin:
        can_update = True
    elif creator_role == models.UserRole.Country_Chief:
        if db_user_to_update.country == current_user.country:
            can_update = True

    if not can_update:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this user."
        )
    
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
    user_id: int, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Bir kullanıcıyı siler. Sadece Admin yapabilir.
    """
    if current_user.role != models.UserRole.Admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete user"
        )
    
    if current_user.id == user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Admin cannot delete itself"
        )

    deleted_user = user_crud.delete_user(db, user_id=user_id)
    if not deleted_user:
        raise HTTPException(status_code=404, detail="User not found")
        
    return deleted_user