# app/database/models.py

import enum
from sqlalchemy import (Column, Integer, String, Text, Boolean, DateTime,
                        ForeignKey, Enum)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .connection import Base

class UserRole(str, enum.Enum):
    Admin = "Admin"
    Country_Chief = "Country Chief"
    Analyst = "Analyst"
    Engineer = "Engineer"
    Runner = "Runner"
    Supermarket_Admin = "Supermarket_Admin"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    surname = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    country = Column(String(100))
    is_active = Column(Boolean, default=True)
    profile_picture_url = Column(String(512), nullable=True)
    
    preferred_theme = Column(String(50), default='light')
    preferred_language = Column(String(10), default='en')
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    stores = relationship("Store", back_populates="installer")

class Store(Base):
    __tablename__ = "stores"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    country = Column(String(100), nullable=False)
    city = Column(String(100), nullable=False)
    branch = Column(String(100))
    address = Column(Text)
    server_token = Column(String(255), unique=True)
    esp32_token = Column(String(255))
    installer_id = Column(Integer, ForeignKey("users.id"))
    server_local_ip = Column(String(50), nullable=True)

    # İstenen tüm yeni sütunlar
    owner_name = Column(String(100))
    owner_surname = Column(String(100))
    working_hours = Column(String(50))

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_seen = Column(DateTime(timezone=True))

    installer = relationship("User", back_populates="stores")
    devices = relationship("Device", back_populates="store", cascade="all, delete-orphan")
    logs = relationship("Log", back_populates="store", cascade="all, delete-orphan")

class Device(Base):
    __tablename__ = "devices"
    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey("stores.id"), nullable=False)
    screen_size = Column(String(50))
    
    # İstenen tüm yeni sütunlar
    wifi_ssid = Column(String(100))
    wifi_password = Column(String(255)) # Gelecekte şifrelenmeli
    all_day_work = Column(Boolean, default=False)
    awake_time = Column(String(10)) # "08:00" formatı
    sleep_time = Column(String(10)) # "22:00" formatı

    software_version = Column(String(50), default="1.0.0")

    store = relationship("Store", back_populates="devices")

class Log(Base):
    __tablename__ = "logs"
    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey("stores.id"), nullable=False)
    source = Column(String(100))
    level = Column(String(50))
    message = Column(Text, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    store = relationship("Store", back_populates="logs")

class FirmwareUpdate(Base):
    __tablename__ = "firmware_updates"
    id = Column(Integer, primary_key=True, index=True)
    target = Column(String(50), nullable=False) # "server" or "esp32"
    version = Column(String(50), nullable=False)
    file_url = Column(String(512), nullable=False)
    release_notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())