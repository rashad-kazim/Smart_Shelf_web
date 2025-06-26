# backend/seed.py

import sys
from os.path import abspath, dirname
from datetime import datetime, timedelta
from sqlalchemy.orm import Session

# Projenin ana dizinini Python path'ine ekle
sys.path.insert(0, dirname(abspath(__file__)))

from app.database.connection import engine, Base, SessionLocal
from app.database.models import User, Store, Device, UserRole
from app.security.security import get_password_hash, encrypt_data

def setup_database():
    """Veritabanını ve tabloları sıfırdan oluşturur."""
    print("Dropping all tables and recreating...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully.")

from sqlalchemy.orm import Session

def seed_data(db: Session):
    """Veritabanını tek bir işlem (transaction) içinde test verileriyle doldurur."""
    try:
        print("Seeding database with test data...")

        # --- 1. Kullanıcı Nesnelerini Oluşturma ---
        print("Preparing users...")
        common_password = get_password_hash("testpassword123")
        admin_password = get_password_hash("Admin448.")

        users_to_create = [
            User(name="Rasad", surname="Admin", email="kresad555@gmail.com", hashed_password=admin_password, role=UserRole.Admin, country="Poland", city="Warsaw"),
            User(name="Jan", surname="Kowalski", email="chief.pl@example.com", hashed_password=common_password, role=UserRole.Country_Chief, country="Poland", city="Krakow"),
            User(name="Ahmet", surname="Yılmaz", email="chief.tr@example.com", hashed_password=common_password, role=UserRole.Country_Chief, country="Turkey", city="Ankara"),
            User(name="Piotr", surname="Nowak", email="engineer.pl@example.com", hashed_password=common_password, role=UserRole.Engineer, country="Poland", city="Warsaw"),
            User(name="Ayşe", surname="Kaya", email="engineer.tr@example.com", hashed_password=common_password, role=UserRole.Engineer, country="Turkey", city="Istanbul"),
            User(name="Ewa", surname="Wiśniewska", email="analyst.pl@example.com", hashed_password=common_password, role=UserRole.Analyst, country="Poland", city="Lodz"),
        ]
        db.add_all(users_to_create)
        
        # Objelere ID atanması için veritabanına FLUSH gönderiyoruz, ama COMMIT etmiyoruz.
        # Bu sayede kullanıcı ID'lerini mağazalarda kullanabiliriz.
        db.flush() 
        print(f"{len(users_to_create)} users prepared.")

        # --- 2. Mağaza ve Cihaz Nesnelerini Oluşturma ---
        print("Preparing stores and devices...")
        engineer_pl_id = next(user.id for user in users_to_create if user.email == "engineer.pl@example.com")
        engineer_tr_id = next(user.id for user in users_to_create if user.email == "engineer.tr@example.com")

        store1 = Store(
            name="Biedronka Warszawa", country="Poland", city="Warsaw", installer_id=engineer_pl_id, server_token="srv_poland_1"
        )
        store2 = Store(
            name="Carrefour İstanbul", country="Turkey", city="Istanbul", installer_id=engineer_tr_id, server_token="srv_turkey_1"
        )
        
        # Mağazaları da FLUSH ile session'a ekleyip ID'lerini alıyoruz
        db.add_all([store1, store2])
        db.flush()
        
        devices_to_create = [
            Device(store_id=store1.id, screen_size="130cm", wifi_password=encrypt_data("Pass1")),
            Device(store_id=store1.id, screen_size="100cm", wifi_password=encrypt_data("Pass2")),
            Device(store_id=store2.id, screen_size="130cm", wifi_password=encrypt_data("Pass3")),
        ]
        db.add_all(devices_to_create)
        
        # --- 3. Her Şeyi Tek Seferde Veritabanına Yazma ---
        # Eğer bu noktaya kadar hata olmadıysa, tüm değişiklikleri tek seferde COMMIT ediyoruz.
        db.commit()
        
        print(f"\n✅ Database seeding completed successfully!")
        print(f"   - {len(users_to_create)} users created.")
        print(f"   - 2 stores created.")
        print(f"   - {len(devices_to_create)} devices created.")

    except Exception as e:
        print(f"\n❌ An error occurred during seeding. Rolling back all changes.")
        print(f"   Error: {e}")
        # Herhangi bir hata durumunda, tüm işlemleri geri alıyoruz.
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    db_session = SessionLocal()
    setup_database()
    seed_data(db_session)