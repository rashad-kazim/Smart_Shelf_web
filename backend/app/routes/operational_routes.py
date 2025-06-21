# app/routes/operational_routes.py

from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.database import models
from app.database.connection import get_db
from app.schemas import log_schemas
from app.crud import log_crud
from app.security.security import get_current_user

router = APIRouter(prefix="/api/ops", tags=["Operational"])

# İkinci katman sunucunun 'hayattayım' sinyali gönderdiği endpoint
@router.post("/heartbeat")
def server_heartbeat(request: Request, db: Session = Depends(get_db)):
    """2. Katman sunucudan 'hayattayım' sinyali alır ve mağazanın son görülme zamanını günceller."""
    server_token = request.headers.get("X-Server-Token")
    if not server_token:
        raise HTTPException(status_code=401, detail="Server token missing")

    db_store = db.query(models.Store).filter(models.Store.server_token == server_token).first()
    if not db_store:
        raise HTTPException(status_code=404, detail="Store with this token not found")
    
    db_store.last_seen = datetime.utcnow()
    db.commit()
    
    return {"status": "ok", "store": db_store.name, "timestamp": db_store.last_seen}

# Log gönderme endpointi
@router.post("/logs")
def submit_log_for_store(
    log: log_schemas.LogCreate,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    2. Katman sunucudan log kabul eder. Logun hangi mağazaya ait olduğunu token'dan anlar.
    """
    server_token = request.headers.get("X-Server-Token")
    if not server_token:
        raise HTTPException(status_code=401, detail="Server token missing")
        
    db_store = db.query(models.Store).filter(models.Store.server_token == server_token).first()
    if not db_store:
        raise HTTPException(status_code=404, detail="Store with this token not found")

    return log_crud.create_log(db=db, store_id=db_store.id, log=log)

# Mağaza loglarını getirme endpointi
@router.get("/logs/{store_id}", response_model=List[log_schemas.LogResponse])
def get_store_logs(
    store_id: int,
    days: int = 30,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Bir mağazanın son 'days' günlük loglarını Frontend için getirir."""
    return log_crud.get_logs_by_store(db=db, store_id=store_id, days=days)