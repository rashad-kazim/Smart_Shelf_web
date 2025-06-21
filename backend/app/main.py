# app/main.py

import os
from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.database import models
from app.database.connection import engine
from app.routes import auth_routes, user_routes, store_routes, operational_routes, firmware_routes, utility_routes

# DÜZELTME: Gerekli tüm slowapi importları burada ve doğru yerdeler
from app.core.limiter import limiter
from slowapi.errors import RateLimitExceeded # Exception'ın doğru yolu 'errors'
from slowapi.middleware import SlowAPIMiddleware
from slowapi.extension import _rate_limit_exceeded_handler

# Veritabanı tablolarını oluştur
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Smart Shelf Management API",
    description="API for managing smart shelf devices, stores, and users.",
    version="1.0.0"
)

# Limiter nesnesini ana uygulama state'ine ekliyoruz
app.state.limiter = limiter
# Hata handler'ını da ekliyoruz
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Hız limitlendirme middleware'ini ekliyoruz
app.add_middleware(SlowAPIMiddleware)

# Firmware dosyalarının sunulacağı static klasörü ayarla
firmware_dir = Path("firmware_updates")
firmware_dir.mkdir(exist_ok=True)
app.mount("/firmware_updates", StaticFiles(directory=firmware_dir), name="firmware_updates")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(auth_routes.router)
app.include_router(user_routes.router)
app.include_router(store_routes.router)
app.include_router(operational_routes.router)
app.include_router(firmware_routes.router)
app.include_router(utility_routes.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Smart Shelf Management API!"}