# app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import models
from app.database.connection import engine
# Router'ları import ediyoruz
from app.routes import auth_routes, user_routes,store_routes

# Veritabanı tablolarını oluştur
# Bu komut, sunucu her başladığında tabloların varlığını kontrol eder
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Smart Shelf Management API",
    description="API for managing smart shelf devices, stores, and users.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    # Geliştirme ortamı için "http://localhost:3000" yeterlidir.
    # Gelecekte başka adreslerden de istek gelebilmesi için "*" eklenebilir.
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"], # Tüm HTTP metotlarına (GET, POST, vb.) izin ver.
    allow_headers=["*"], # Tüm başlıklara izin ver.
)

# Routes
# Hem auth hem de user router'larını uygulamaya dahil ediyoruz
app.include_router(auth_routes.router)
app.include_router(user_routes.router) 
app.include_router(store_routes.router)
# app/main.py

import os
from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.database import models
from app.database.connection import engine

# Gerekli tüm rotaları import ediyoruz
from app.routes import auth_routes, user_routes, store_routes, operational_routes, firmware_routes, utility_routes

# slowapi için gerekli importlar
from app.core.limiter import limiter
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from slowapi.extension import _rate_limit_exceeded_handler

# Veritabanı tablolarını oluştur
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Smart Shelf Management API",
    description="API for managing smart shelf devices, stores, and users.",
    version="1.0.0"
)

origins = [
    "http://localhost:3000",  # React geliştirme sunucusu
    "http://127.0.0.1:3000", # Bazen tarayıcılar bunu kullanabilir
    # Gelecekte canlıya çıktığınızda "https://sizin-domaininiz.com" gibi adresleri de buraya eklemelisiniz.
]

# Middleware'ler (CORS, Limiter vb.) en üste eklenir
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

# Statik dosya yönlendirmeleri
UPLOAD_DIR = Path("uploaded_files")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/files", StaticFiles(directory=UPLOAD_DIR), name="files")

FIRMWARE_DIR = Path("firmware_updates")
FIRMWARE_DIR.mkdir(exist_ok=True)
app.mount("/firmware_updates", StaticFiles(directory=FIRMWARE_DIR), name="firmware_updates")

# --- API ROTALARINI UYGULAMAYA DAHİL ETME ---
# Bu blok, uygulamanın hangi endpoint'lere cevap vereceğini belirler.
app.include_router(auth_routes.router)
app.include_router(user_routes.router)
app.include_router(store_routes.router) # store_routes artık dahil edildi.
app.include_router(operational_routes.router)
app.include_router(firmware_routes.router)
app.include_router(utility_routes.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Smart Shelf Management API!"}

@app.get("/")
def read_root():
    return {"message": "Welcome to the Smart Shelf Management API!"}