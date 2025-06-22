# backend/seed.py

import sys
from os.path import abspath, dirname
from datetime import datetime, timedelta

# Projenin ana dizinini Python path'ine ekle
sys.path.insert(0, dirname(abspath(__file__)))

from app.database.connection import engine, Base, SessionLocal
from app.database.models import User, Store, Device, UserRole
from app.security.security import get_password_hash, encrypt_data

# --- Veritabanı ve Tablo Oluşturma ---
def setup_database():
    """Veritabanını ve tabloları sıfırdan oluşturur."""
    print("Dropping all tables and recreating...")
    # Not: Bu, mevcut tüm verileri siler!
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully.")

# --- Test Verileri ---
def seed_data(db):
    """Veritabanını test verileriyle doldurur."""
    print("Seeding database with test data...")

    # --- 1. Kullanıcıları Oluşturma ---
    print("Creating users...")
    
    # Şifreler
    admin_password = get_password_hash("Admin448.")
    common_password = get_password_hash("testpassword123")


    # Kullanıcı Verileri
    users_to_create = [
        # Şirket Rolleri
        User(name="Rasad", surname="Kazimov", email="kresad555@gmail.com", hashed_password=admin_password, role=UserRole.Admin, country="Poland", preferred_language="en"),
        User(name="Jan", surname="Kowalski", email="chief.pl@example.com", hashed_password=common_password, role=UserRole.Country_Chief, country="Poland", preferred_language="pl"),
        User(name="Ahmet", surname="Yılmaz", email="chief.tr@example.com", hashed_password=common_password, role=UserRole.Country_Chief, country="Turkey", preferred_language="tr"),
        User(name="Piotr", surname="Nowak", email="engineer.pl@example.com", hashed_password=common_password, role=UserRole.Engineer, country="Poland", preferred_language="en"),
        User(name="Ayşe", surname="Kaya", email="engineer.tr@example.com", hashed_password=common_password, role=UserRole.Engineer, country="Turkey", preferred_language="tr"),
        User(name="Ewa", surname="Wiśniewska", email="analyst.pl@example.com", hashed_password=common_password, role=UserRole.Analyst, country="Poland", preferred_language="pl"),
        
        # Market Rolleri
        User(name="Zeynep", surname="Demir", email="runner.tr@example.com", hashed_password=common_password, role=UserRole.Runner, country="Turkey", preferred_language="tr"),
        User(name="Kasia", surname="Lis", email="supermarket.admin.pl@example.com", hashed_password=common_password, role=UserRole.Supermarket_Admin, country="Poland", preferred_language="pl"),
    ]
    db.add_all(users_to_create)
    db.commit()
    print(f"{len(users_to_create)} users created.")

    # Oluşturulan kullanıcıları ID'leriyle eşleştirelim
    admin_user = db.query(User).filter_by(email="admin@example.com").one()
    engineer_pl = db.query(User).filter_by(email="engineer.pl@example.com").one()
    engineer_tr = db.query(User).filter_by(email="engineer.tr@example.com").one()

    # --- 2. Mağazaları ve Cihazları Oluşturma ---
    print("Creating stores and devices...")

    # Mağaza 1: Polonya
    store1 = Store(
        name="Biedronka Warszawa", country="Poland", city="Warsaw", branch="Centrum",
        address="ul. Marszałkowska 1", owner_name="Adam", owner_surname="Mickiewicz",
        working_hours="06:00-23:00", installer_id=engineer_pl.id,
        server_token="srv_poland_warsaw_123", esp32_token="esp_poland_123",
        last_seen=datetime.utcnow() - timedelta(minutes=2) # Online görünmesi için
    )

    # Mağaza 2: Polonya
    store2 = Store(
        name="Lidl Kraków", country="Poland", city="Kraków", branch="Stare Miasto",
        address="Rynek Główny 5", owner_name="Juliusz", owner_surname="Słowacki",
        working_hours="07:00-22:00", installer_id=engineer_pl.id,
        server_token="srv_poland_krakow_456", esp32_token="esp_poland_123",
        last_seen=datetime.utcnow() - timedelta(minutes=10) # Offline görünmesi için
    )
    
    # Mağaza 3: Türkiye
    store3 = Store(
        name="Carrefour İstanbul", country="Turkey", city="Istanbul", branch="Kadıköy",
        address="Söğütlüçeşme Cd. No:10", owner_name="Orhan", owner_surname="Veli",
        working_hours="08:00-22:00", installer_id=engineer_tr.id,
        server_token="srv_turkey_istanbul_789", esp32_token="esp_turkey_456",
        last_seen=datetime.utcnow() - timedelta(minutes=1) # Online görünmesi için
    )
    db.add_all([store1, store2, store3])
    db.commit()
    print("3 stores created.")

    # Cihazlar
    devices_to_create = [
        # Mağaza 1 Cihazları
        Device(store_id=store1.id, screen_size="130cm", wifi_ssid="Biedronka-Staff", wifi_password=encrypt_data("BiedronkaPass1"), all_day_work=False, awake_time="06:00", sleep_time="23:00"),
        Device(store_id=store1.id, screen_size="100cm", wifi_ssid="Biedronka-Staff", wifi_password=encrypt_data("BiedronkaPass2"), all_day_work=True),
        
        # Mağaza 2 Cihazları
        Device(store_id=store2.id, screen_size="100cm", wifi_ssid="Lidl-WiFi", wifi_password=encrypt_data("LidlSecretPass"), all_day_work=True),
        
        # Mağaza 3 Cihazları
        Device(store_id=store3.id, screen_size="130cm", wifi_ssid="Carrefour-Net", wifi_password=encrypt_data("CarrefourSifre1"), all_day_work=False, awake_time="08:00", sleep_time="22:00"),
        Device(store_id=store3.id, screen_size="130cm", wifi_ssid="Carrefour-Net", wifi_password=encrypt_data("CarrefourSifre2"), all_day_work=False, awake_time="08:00", sleep_time="22:00"),
        Device(store_id=store3.id, screen_size="100cm", wifi_ssid="Carrefour-Net", wifi_password=encrypt_data("CarrefourSifre3"), all_day_work=True),
    ]
    db.add_all(devices_to_create)
    db.commit()
    print(f"{len(devices_to_create)} devices created.")
    print("\n✅ Database seeding completed successfully!")


if __name__ == "__main__":
    db_session = SessionLocal()
    try:
        setup_database()
        seed_data(db_session)
    except Exception as e:
        print(f"\n❌ An error occurred during seeding: {e}")
    finally:
        db_session.close()