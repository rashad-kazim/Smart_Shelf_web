# backend/seed.py

import os
import json # JSON modülünü import ediyoruz
from sqlalchemy.orm import Session
from app.database.connection import engine, Base, SessionLocal
from app.database import models
from app.security.security import get_password_hash
from app.utils.token_utils import generate_server_token, generate_esp32_token

# DÜZELTME: Veriler artık JSON dosyalarından okunacak.
# Bu, kodu daha temiz tutar ve veriyi koddan ayırır.
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
USERS_JSON_PATH = os.path.join(BASE_DIR, 'test_data', 'users.json')
STORES_JSON_PATH = os.path.join(BASE_DIR, 'test_data', 'stores.json')


def setup_database():
    print("Dropping all tables and recreating...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully.")

def seed_users(db: Session):
    print("Preparing users...")
    
    # DÜZELTME: Veriyi JSON dosyasından oku
    try:
        with open(USERS_JSON_PATH, 'r', encoding='utf-8') as f:
            users_data = json.load(f)
    except FileNotFoundError:
        print(f"ERROR: '{USERS_JSON_PATH}' not found. Please create it.")
        print("Seeding stopped.")
        return # Dosya yoksa işlemi durdur

    for user_data in users_data:
        # Şifreyi hash'le
        password = user_data.pop('password', 'default_password')
        user_data['hashed_password'] = get_password_hash(password)
        
        # models.User, string rolünü otomatik olarak Enum'a çevirecektir.
        user = models.User(**user_data)
        db.add(user)
    
    print(f"{len(users_data)} users prepared.")

def seed_stores_and_devices(db: Session):
    print("Preparing stores and devices...")

    try:
        with open(STORES_JSON_PATH, 'r', encoding='utf-8') as f:
            stores_data = json.load(f)
    except FileNotFoundError:
        print(f"ERROR: '{STORES_JSON_PATH}' not found. Please create it.")
        print("Skipping store seeding.")
        return # Dosya yoksa işlemi durdur

    all_users = db.query(models.User).all()
    
    for store_data in stores_data:
        # 'installerName' anahtarını JSON'dan oku
        installer = next((u for u in all_users if u.name == store_data.get("installerName")), None)
        
        db_store = models.Store(
            name=store_data["name"],
            country=store_data["country"],
            city=store_data["city"],
            branch=store_data.get("branch"),
            address=store_data["address"],
            owner_name=store_data["ownerName"], # JSON'daki anahtarla eşleştir
            owner_surname=store_data["ownerSurname"], # JSON'daki anahtarla eşleştir
            working_hours=store_data["working_hours"],
            server_token=generate_server_token(),
            esp32_token=generate_esp32_token(),
            installer_id=installer.id if installer else None
        )
        db.add(db_store)
        db.flush() 

        device_local_id_counter = 1
        for device_data in store_data.get("devices", []):
            db.add(models.Device(
                **device_data,
                device_local_id=device_local_id_counter,
                store_id=db_store.id
            ))
            device_local_id_counter += 1

def run_seeding():
    db = SessionLocal()
    try:
        setup_database()
        print("Seeding database with test data...")
        
        seed_users(db)
        print("Committing users...")
        db.commit() 
        print("Users committed successfully.")
        
        seed_stores_and_devices(db)
        print("Committing stores and devices...")
        db.commit()
        print("Stores and devices committed successfully.")
        
        print("\n✅ Database seeding completed successfully!")
        
    except Exception as e:
        print(f"\n❌ An error occurred during seeding. Rolling back all changes.")
        print(f"  Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    run_seeding()