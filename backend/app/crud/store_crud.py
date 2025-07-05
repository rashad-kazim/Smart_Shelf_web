# app/crud/store_crud.py

from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import SQLAlchemyError
from app.database import models
from app.schemas import store_schemas, device_schemas
from app.utils.token_utils import generate_server_token, generate_esp32_token

def get_store(db: Session, store_id: int):
    """ID'ye göre tek bir mağazayı getirir ve ilişkili verileri yükler."""
    return db.query(models.Store).options(
        joinedload(models.Store.devices),
        joinedload(models.Store.installer)
    ).filter(models.Store.id == store_id).first()

def get_stores(db: Session, skip: int = 0, limit: int = 100, country: str = None, city: str = None):
    """Tüm mağazaları, opsiyonel ülke ve şehir filtreleriyle birlikte getirir."""
    query = db.query(models.Store).options(
        joinedload(models.Store.devices),
        joinedload(models.Store.installer)
    )
    if country:
        query = query.filter(models.Store.country.ilike(f"%{country}%"))
    if city:
        query = query.filter(models.Store.city.ilike(f"%{city}%"))
    
    return query.offset(skip).limit(limit).all()

def get_stores_by_country(db: Session, country: str, skip: int = 0, limit: int = 100, city: str = None):
    """Belirli bir ülkedeki mağazaları, opsiyonel şehir filtresiyle getirir."""
    query = db.query(models.Store).filter(models.Store.country.ilike(f"%{country}%")).options(
        joinedload(models.Store.devices),
        joinedload(models.Store.installer)
    )
    if city:
        query = query.filter(models.Store.city.ilike(f"%{city}%"))

    return query.offset(skip).limit(limit).all()

def create_store(db: Session, store: store_schemas.StoreCreate, installer_id: int):
    """Yeni bir mağaza ve ilişkili cihazlarını oluşturur."""
    devices_data = store.devices
    store_data = store.model_dump(exclude={'devices'})

    db_store = models.Store(
        name=store_data.get("name"),
        country=store_data.get("country"),
        city=store_data.get("city"),
        branch=store_data.get("branch"),
        address=store_data.get("address"),
        working_hours=store_data.get("working_hours"),
        server_local_ip=store_data.get("server_local_ip"),
        owner_name=store_data.get("ownerName"),
        owner_surname=store_data.get("ownerSurname"),
        installer_id=installer_id,
        server_token=generate_server_token(),
        esp32_token=generate_esp32_token()
    )
    db.add(db_store)
    db.commit()
    db.refresh(db_store)

    if devices_data:
        for device_data in devices_data:
            new_device = models.Device(
                store_id=db_store.id,
                device_local_id=device_data.id,
                screen_size=device_data.screen_size,
                wifi_ssid=device_data.wifi_ssid,
                wifi_password=device_data.wifi_password,
                all_day_work=device_data.all_day_work,
                awake_time=device_data.awake_time,
                sleep_time=device_data.sleep_time,
                software_version=device_data.software_version,
                product_name_font_size=device_data.product_name_font_size,
                product_price_font_size_before_discount=device_data.product_price_font_size_before_discount,
                product_price_font_size_after_discount=device_data.product_price_font_size_after_discount,
                product_barcode_font_size=device_data.product_barcode_font_size,
                product_barcode_numbers_font_size=device_data.product_barcode_numbers_font_size
            )
            db.add(new_device)
        db.commit()
        db.refresh(db_store)

    return get_store(db, store_id=db_store.id)

def update_store(db: Session, db_store: models.Store, store_in: store_schemas.StoreUpdate):
    """
    Mağaza ve cihazları manuel olarak yöneterek en sağlam şekilde günceller.
    Önce mevcut cihazları, gelen veriye göre siler, günceller veya yenilerini ekler.
    """
    # 1. Mağazanın temel alanlarını güncelle (Bu kısım aynı kalıyor)
    store_data = store_in.model_dump(exclude_unset=True, exclude={'devices'})
    for key, value in store_data.items():
        if key == "ownerName": key = "owner_name"
        if key == "ownerSurname": key = "owner_surname"
        if hasattr(db_store, key):
            setattr(db_store, key, value)

    # 2. Cihazları manuel olarak senkronize et
    # Bu blok, 'nuke and pave' yerine daha kontrollü bir yaklaşım kullanır.
    if store_in.devices is not None:
        
        # Gelen cihaz ID'lerini bir kümede topla (hızlı arama için)
        incoming_device_ids = {device.id for device in store_in.devices}
        
        # Mevcut cihazları bir sözlükte topla (ID'ye göre hızlı erişim için)
        existing_devices_map = {device.device_local_id: device for device in db_store.devices}

        # SİLME İŞLEMİ: Veritabanında olan ama frontend'den gelmeyen cihazları bul ve sil.
        devices_to_delete = []
        for device_id, device in existing_devices_map.items():
            if device_id not in incoming_device_ids:
                devices_to_delete.append(device)
        
        for device in devices_to_delete:
            db.delete(device)

        # GÜNCELLEME ve EKLEME İŞLEMİ: Frontend'den gelen her cihaz için;
        for device_data in store_in.devices:
            # Eğer cihaz zaten veritabanında varsa, alanlarını güncelle.
            if device_data.id in existing_devices_map:
                existing_device = existing_devices_map[device_data.id]
                existing_device.screen_size = device_data.screen_size
                existing_device.wifi_ssid = device_data.wifi_ssid
                existing_device.wifi_password = device_data.wifi_password
                existing_device.all_day_work = device_data.all_day_work
                existing_device.awake_time = device_data.awake_time
                existing_device.sleep_time = device_data.sleep_time
                existing_device.software_version = device_data.software_version
                existing_device.product_name_font_size = device_data.product_name_font_size
                existing_device.product_price_font_size_before_discount = device_data.product_price_font_size_before_discount
                existing_device.product_price_font_size_after_discount = device_data.product_price_font_size_after_discount
                existing_device.product_barcode_font_size = device_data.product_barcode_font_size
                existing_device.product_barcode_numbers_font_size = device_data.product_barcode_numbers_font_size
            # Eğer cihaz veritabanında yoksa, yeni bir tane oluştur ve mağazaya ekle.
            else:
                new_device = models.Device(
                    store_id=db_store.id,  # Mağaza ilişkisini burada kuruyoruz
                    device_local_id=device_data.id,
                    screen_size=device_data.screen_size,
                    wifi_ssid=device_data.wifi_ssid,
                    wifi_password=device_data.wifi_password,
                    all_day_work=device_data.all_day_work,
                    awake_time=device_data.awake_time,
                    sleep_time=device_data.sleep_time,
                    software_version=device_data.software_version,
                    product_name_font_size=device_data.product_name_font_size,
                    product_price_font_size_before_discount=device_data.product_price_font_size_before_discount,
                    product_price_font_size_after_discount=device_data.product_price_font_size_after_discount,
                    product_barcode_font_size=device_data.product_barcode_font_size,
                    product_barcode_numbers_font_size=device_data.product_barcode_numbers_font_size
                )
                db.add(new_device) # Yeni cihazı session'a ekle

    # 3. Tüm değişiklikleri veritabanına işle
    try:
        db.commit()
        db.refresh(db_store)
    except Exception as e:
        db.rollback() # Hata durumunda işlemi geri al
        raise e

    return get_store(db, store_id=db_store.id)

def delete_store(db: Session, store_id: int):
    db_store = db.query(models.Store).filter(models.Store.id == store_id).first()
    if db_store:
        db.delete(db_store)
        db.commit()
    return db_store

def regenerate_server_token(db: Session, db_store: models.Store):
    db_store.server_token = generate_server_token()
    db.add(db_store)
    db.commit()
    db.refresh(db_store)
    return db_store

def regenerate_esp32_token(db: Session, db_store: models.Store):
    db_store.esp32_token = generate_esp32_token()
    db.add(db_store)
    db.commit()
    db.refresh(db_store)
    return db_store