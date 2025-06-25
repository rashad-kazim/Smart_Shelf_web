from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
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

# Not: Bu endpoint'in path'i "" olarak ayarlandı, prefix ile birleşince /api/users olur.
@router.post("", response_model=user_schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def create_new_user(
    user: user_schemas.UserCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Yeni bir kullanıcı oluşturur. 
    Sadece 'Admin' rolündeki kullanıcılar bu işlemi yapabilir.
    """
    if current_user.role != models.UserRole.Admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to create a user"
        )
    
    db_user = user_crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    return user_crud.create_user(db=db, user=user)


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
    Tüm kullanıcıları listeler. Sadece yetkili bir kullanıcı (geçerli token sahibi) erişebilir.
    """
    users = user_crud.get_users(db, skip=skip, limit=limit)
    return users

# --- DÜZELTME: /me endpoint'i, /{user_id}'den ÖNCE tanımlandı ---
@router.get("/me", response_model=user_schemas.UserResponse)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    """
    Geçerli token'a sahip olan kullanıcının kendi bilgilerini döndürür.
    Bu, sayfa yenilendiğinde oturumu doğrulamak için kullanılır.
    """
    return current_user
# --- DÜZELTME SONU ---

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

@router.put("/{user_id}", response_model=user_schemas.UserResponse)
def update_existing_user(
    user_id: int,
    user_in: user_schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Bir kullanıcının bilgilerini günceller. Sadece Admin yapabilir.
    """
    if current_user.role != models.UserRole.Admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update user"
        )

    db_user = user_crud.get_user(db, user_id=user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    updated_user = user_crud.update_user(db=db, db_user=db_user, user_in=user_in)
    return updated_user


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