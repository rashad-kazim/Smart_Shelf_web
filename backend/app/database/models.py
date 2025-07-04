# backend/app/database/models.py

from sqlalchemy import (Column, Integer, String, Boolean, Enum, 
                        DateTime, func, ForeignKey, Text)
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.mysql import MEDIUMTEXT
from .connection import Base
import enum

class UserRole(str, enum.Enum):
    Admin = "Admin"
    Country_Chief = "Country_Chief"
    Engineer = "Engineer"
    Analyst = "Analyst"
    Runner = "Runner"

class Store(Base):
    __tablename__ = "stores"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    country = Column(String(100), nullable=False)
    city = Column(String(100), nullable=False)
    branch = Column(String(100), nullable=True)
    address = Column(String(255), nullable=True)
    server_token = Column(String(255), unique=True, nullable=True)
    esp32_token = Column(String(255), unique=True, nullable=True)
    server_local_ip = Column(String(50), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_seen = Column(DateTime(timezone=True), nullable=True)
    owner_name = Column(String(100), nullable=True)
    owner_surname = Column(String(100), nullable=True)
    working_hours = Column(String(100), nullable=True)
    
    installer_id = Column(Integer, ForeignKey("users.id", name='fk_store_installer'), nullable=True)
    
    # --- İLİŞKİLER ---
    installer = relationship("User", foreign_keys=[installer_id], back_populates="stores_installed")
    
    # --- DÜZELTME: Bu ilişkiye hangi ForeignKey'i kullanacağını belirtiyoruz ---
    # Bu ilişki, User tablosundaki 'assigned_store_id' sütununu kullanmalıdır.
    workers = relationship("User", foreign_keys="[User.assigned_store_id]", back_populates="store")
    
    devices = relationship("Device", back_populates="store", cascade="all, delete-orphan")
    logs = relationship("Log", back_populates="store", cascade="all, delete-orphan")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    surname = Column(String(100), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    country = Column(String(100), nullable=True)
    city = Column(String(100), nullable=True) 
    profile_picture = Column(MEDIUMTEXT, nullable=True)
    
    # Kısır döngüyü kırmak için bu ForeignKey'in, diğer tablo oluşturulduktan sonra eklenmesini sağlıyoruz.
    assigned_store_id = Column(Integer, ForeignKey("stores.id", use_alter=True, name='fk_user_assigned_store'), nullable=True)
    
    language = Column(String(10), default="en")
    theme = Column(String(20), default="light")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # --- İLİŞKİLER ---
    # "Bir kullanıcının ATANDIĞI mağaza" ilişkisi
    store = relationship("Store", foreign_keys=[assigned_store_id], back_populates="workers")
    
    # "Bir kullanıcının KURDUĞU mağazalar" ilişkisi
    stores_installed = relationship("Store", foreign_keys=[Store.installer_id], back_populates="installer")


class Device(Base):
    __tablename__ = "devices"
    
    # Bu ID, veritabanı için benzersiz birincil anahtardır ve global olarak artar.
    id = Column(Integer, primary_key=True, index=True)
    
    # --- YENİ EKLENEN ALAN ---
    # Bu ID, her mağaza içinde 1'den başlayacak olan, bizim kullanacağımız yerel ID'dir.
    device_local_id = Column(Integer, nullable=False, index=True)
    
    store_id = Column(Integer, ForeignKey("stores.id", name="fk_device_store"), nullable=False)
    screen_size = Column(String(100))
    wifi_ssid = Column(String(100))
    wifi_password = Column(String(255)) 
    all_day_work = Column(Boolean, default=False)
    awake_time = Column(String(10), nullable=True)
    sleep_time = Column(String(10), nullable=True)
    software_version = Column(String(50), default="1.0.0")

    product_name_font_size = Column(Integer, default=12)
    product_price_font_size_before_discount = Column(Integer, default=12)
    product_price_font_size_after_discount = Column(Integer, default=12)
    product_barcode_font_size = Column(Integer, default=12)
    product_barcode_numbers_font_size = Column(Integer, default=12)

    store = relationship("Store", back_populates="devices")


class Log(Base):
    __tablename__ = "logs"
    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey("stores.id", name="fk_log_store"), nullable=False)
    source = Column(String(100))
    level = Column(String(50))
    message = Column(Text, nullable=False)
    timestamp = Column(DateTime(timezone=True), nullable=False)
    
    store = relationship("Store", back_populates="logs")


class FirmwareUpdate(Base):
    __tablename__ = "firmware_updates"
    id = Column(Integer, primary_key=True, index=True)
    target = Column(String(50), nullable=False)
    version = Column(String(50), nullable=False)
    file_url = Column(String(512), nullable=False)
    release_notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())