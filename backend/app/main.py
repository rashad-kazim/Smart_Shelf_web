from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import stores
from app.database.models import init_database

app = FastAPI(
    title="Supermarket Price Display API",
    description="Digital price display system for supermarket shelves",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(stores.router)

@app.on_event("startup")
async def startup_event():
    """Runs when the application starts"""
    print("Starting application...")
    if init_database():
        print("Database initialized successfully")
    else:
        print("Database initialization error!")

@app.get("/")
async def root():
    return {"message": "Supermarket Price Display API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}