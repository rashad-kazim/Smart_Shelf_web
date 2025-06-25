# app/routes/store_routes.py

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import models
from app.database.connection import get_db
from app.schemas import store_schemas
from app.crud import store_crud
from app.security.security import get_current_user
from app.utils import token_utils

router = APIRouter(prefix="/api/stores", tags=["Stores"])


@router.post("", response_model=store_schemas.StoreResponse, status_code=status.HTTP_201_CREATED)
def create_new_store(
    store: store_schemas.StoreCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Yeni bir mağaza oluşturur. Kurulumcu, isteği gönderen kullanıcıdır."""
    allowed_roles = [models.UserRole.Admin, models.UserRole.Engineer, models.UserRole.Country_Chief]
    if current_user.role not in allowed_roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to perform a new installation."
        )
    return store_crud.create_store(db=db, store=store, installer_id=current_user.id)


@router.get("", response_model=List[store_schemas.StoreResponse])
def read_stores(
    skip: int = 0,
    limit: int = 100,
    country: Optional[str] = None,
    city: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Mağazaları role göre ve filtrelere göre GÜVENLİ bir şekilde listeler."""
    
    if current_user.role == models.UserRole.Admin:
        stores_from_db = store_crud.get_stores(db, skip=skip, limit=limit, country=country, city=city)
        
    elif current_user.role in [models.UserRole.Country_Chief, models.UserRole.Engineer, models.UserRole.Analyst]:
        # GÜVENLİK: Frontend'den gelen 'country' filtresini yok sayar, her zaman kullanıcının kendi ülkesini kullanır.
        stores_from_db = store_crud.get_stores_by_country(
            db, country=current_user.country, city=city, skip=skip, limit=limit
        )
    else:
        stores_from_db = []
    
    # DOĞRU YÖNTEM: Hatalı for döngüsü ve __dict__ kullanımı kaldırıldı.
    # FastAPI ve Pydantic, veritabanı objelerini otomatik ve hatasız olarak JSON'a çevirir.
    return stores_from_db


@router.get("/{store_id}", response_model=store_schemas.StoreResponse)
def read_store(
    store_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """ID'ye göre tek bir mağazayı getirir ve yetki kontrolü yapar."""
    db_store = store_crud.get_store(db, store_id=store_id)
    if db_store is None:
        raise HTTPException(status_code=404, detail="Store not found")
    can_view = False
    if current_user.role == models.UserRole.Admin:
        can_view = True
    elif current_user.role in [models.UserRole.Country_Chief, models.UserRole.Engineer, models.UserRole.Analyst]:
        if current_user.country == db_store.country:
            can_view = True
    
    if not can_view:
        raise HTTPException(status_code=403, detail="Not authorized to view this store")
    return db_store

@router.put("/{store_id}", response_model=store_schemas.StoreResponse)
def update_store_details(
    store_id: int, store_in: store_schemas.StoreUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)
):
    """Bir mağazanın detaylarını günceller."""
    db_store = store_crud.get_store(db, store_id=store_id)
    if not db_store:
        raise HTTPException(status_code=404, detail="Store not found")

    can_update = False
    if current_user.role == models.UserRole.Admin:
        can_update = True
    elif current_user.role in [models.UserRole.Country_Chief, models.UserRole.Engineer, models.UserRole.Analyst]:
        if db_store.country == current_user.country:
            can_update = True
    
    if not can_update:
        raise HTTPException(status_code=403, detail="Not authorized to update this store.")
        
    return store_crud.update_store(db, db_store=db_store, store_in=store_in)


@router.delete("/{store_id}", response_model=store_schemas.StoreResponse)
def delete_store_by_id(
    store_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)
):
    """Bir mağazayı siler."""
    db_store = store_crud.get_store(db, store_id=store_id)
    if not db_store:
        raise HTTPException(status_code=404, detail="Store not found")
        
    can_delete = False
    if current_user.role in [models.UserRole.Admin, models.UserRole.Country_Chief]:
        if db_store.country == current_user.country or current_user.role == models.UserRole.Admin:
            can_delete = True

    if not can_delete:
        raise HTTPException(status_code=403, detail="Not authorized to delete this store.")

    return store_crud.delete_store(db, store_id=store_id)


@router.post("/{store_id}/generate-server-token", response_model=store_schemas.StoreResponse)
def generate_new_server_token(
    store_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Mağaza için yeni bir 2. Katman Sunucu Token'ı üretir."""
    if current_user.role != models.UserRole.Admin:
        raise HTTPException(status_code=403, detail="Not authorized")

    db_store = store_crud.get_store(db, store_id=store_id)
    if not db_store:
        raise HTTPException(status_code=404, detail="Store not found")
    
    return store_crud.regenerate_server_token(db, db_store=db_store)


@router.post("/{store_id}/generate-esp32-token", response_model=store_schemas.StoreResponse)
def generate_new_esp32_token(
    store_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Mağazadaki ESP32'ler için yeni bir ortak token üretir."""
    if current_user.role != models.UserRole.Admin:
        raise HTTPException(status_code=403, detail="Not authorized")

    db_store = store_crud.get_store(db, store_id=store_id)
    if not db_store:
        raise HTTPException(status_code=404, detail="Store not found")
    
    return store_crud.regenerate_esp32_token(db, db_store=db_store)
