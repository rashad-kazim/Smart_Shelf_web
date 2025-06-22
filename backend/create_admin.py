# backend/create_admin.py
# Bu script, ilk yönetici (Admin) kullanıcısını oluşturmak için kullanılır.
# Çalışmadan önce veritabanı tablolarının mevcut olduğundan emin olur.

import getpass
import sys
from os.path import abspath, dirname

# Projenin ana dizinini Python path'ine ekle
sys.path.insert(0, dirname(abspath(__file__)))

# --- YENİ EKLENEN KISIM BAŞLANGICI ---
# Tabloları oluşturmak için gerekli modülleri import et
from app.database.connection import engine, Base, SessionLocal
# --- YENİ EKLENEN KISIM SONU ---

from app.database.models import User, UserRole
from app.security.security import get_password_hash


def create_tables():
    """Veritabanındaki tüm tabloları oluşturur."""
    print("Checking and creating tables if they don't exist...")
    try:
        Base.metadata.create_all(bind=engine)
        print("Tables are ready.")
    except Exception as e:
        print(f"An error occurred during table creation: {e}")
        # Tablo oluşturma başarısız olursa devam etme
        sys.exit(1)


def create_admin_user():
    """
    Komut satırından aldığı bilgilerle yeni bir Admin kullanıcısı oluşturur.
    """
    db = SessionLocal()
    print("\n--- Super User (Admin) Creation ---")
    
    try:
        # --- E-posta Bilgisini Al ---
        email = input("Enter admin email: ").strip()
        if not email:
            print("Email cannot be empty.")
            return

        # --- Kullanıcı Mevcut mu diye Kontrol Et ---
        user = db.query(User).filter(User.email == email).first()
        if user:
            print(f"User with email '{email}' already exists!")
            return

        # --- Şifre Bilgisini Güvenli Bir Şekilde Al ---
        password = getpass.getpass("Enter admin password: ")
        if not password:
            print("Password cannot be empty.")
            return
            
        confirm_password = getpass.getpass("Confirm admin password: ")
        if password != confirm_password:
            print("Passwords do not match!")
            return
        
        # --- Diğer Bilgileri Al ---
        name = input("Enter admin first name: ").strip()
        surname = input("Enter admin last name: ").strip()
        country = input("Enter admin country (e.g., Main Office, Poland): ").strip()

        if not all([name, surname, country]):
            print("First name, last name, and country cannot be empty.")
            return

        # --- Kullanıcıyı Oluştur ---
        hashed_password = get_password_hash(password)
        
        admin_user = User(
            email=email,
            hashed_password=hashed_password,
            name=name,
            surname=surname,
            role=UserRole.Admin,
            is_active=True,
            country=country
        )
        
        db.add(admin_user)
        db.commit()
        
        print("\n✅ Admin user created successfully!")
        print(f"   Email: {email}")
        print(f"   Role: {admin_user.role.value}")

    except Exception as e:
        print(f"\n❌ An error occurred: {e}")
    finally:
        print("---------------------------------")
        db.close()

if __name__ == "__main__":
    create_tables()      # Önce tabloları oluşturmayı dene
    create_admin_user()  # Sonra admin kullanıcısını oluştur