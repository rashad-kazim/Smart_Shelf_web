# app/crud/store_crud.py

from sqlalchemy.orm import Session, joinedload
from app.database import models
from app.schemas import store_schemas
from app.utils.token_utils import generate_server_token, generate_esp32_token
from app.security.security import encrypt_data

# Store CRUD işlemleri
def get_store(db: Session, store_id: int):
    return db.query(models.Store).options(
        joinedload(models.Store.devices),
        joinedload(models.Store.installer)
    ).filter(models.Store.id == store_id).first()

# Store listeleme işlemi
def get_stores(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Store).options(
        joinedload(models.Store.devices),
        joinedload(models.Store.installer)
    ).offset(skip).limit(limit).all()

# Store oluşturma işlemi
def create_store(db: Session, store: store_schemas.StoreCreate, installer_id: int):
    """
    Yeni bir mağaza ve ona bağlı cihazları tek seferde oluşturur.
    """
    db_store = models.Store(
        name=store.name,
        country=store.country,
        city=store.city,
        branch=store.branch,
        address=store.address,
        installer_id=installer_id,
        owner_name=store.ownerName,
        owner_surname=store.ownerSurname,
        working_hours=store.working_hours,
        server_local_ip=store.server_local_ip
    )

    db.add(db_store)
    db.commit()
    db.refresh(db_store)

    for device_data in store.devices:
        if device_data.wifi_password:
            device_data.wifi_password = encrypt_data(device_data.wifi_password)

        db_device = models.Device(
            **device_data.model_dump(),
            store_id=db_store.id
        )
        db.add(db_device)
    
    db.commit()
    db.refresh(db_store)
    
    return db_store

# Store güncelleme işlemi
def update_store(db: Session, db_store: models.Store, store_in: store_schemas.StoreUpdate):
    update_data = store_in.model_dump(exclude_unset=True)
    # Pydantic modelindeki camelCase'i veritabanındaki snake_case'e çeviriyoruz
    if "ownerName" in update_data:
        update_data["owner_name"] = update_data.pop("ownerName")
    if "ownerSurname" in update_data:
        update_data["owner_surname"] = update_data.pop("ownerSurname")

    for key, value in update_data.items():
        setattr(db_store, key, value)
    db.add(db_store)
    db.commit()
    db.refresh(db_store)
    return db_store

# Store silme işlemi
def delete_store(db: Session, store_id: int):
    db_store = db.query(models.Store).filter(models.Store.id == store_id).first()
    if db_store:
        db.delete(db_store)
        db.commit()
    return db_store

# Store token'larını yenileme işlemleri
def regenerate_server_token(db: Session, db_store: models.Store):
    db_store.server_token = generate_server_token()
    db.add(db_store)
    db.commit()
    db.refresh(db_store)
    return db_store

# ESP32 token'ını yenileme işlemi
def regenerate_esp32_token(db: Session, db_store: models.Store):
    db_store.esp32_token = generate_esp32_token()
    db.add(db_store)
    db.commit()
    db.refresh(db_store)
    return db_store
# ------------------------------------