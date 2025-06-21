# app/crud/log_crud.py

from sqlalchemy.orm import Session
from app.database import models
from app.schemas import log_schemas
from datetime import datetime, timedelta

# Log CRUD işlemleri
# Bu modül, log kayıtlarını oluşturma, okuma ve silme işlemlerini içerir.

# Log oluşturma işlemi
def create_log(db: Session, store_id: int, log: log_schemas.LogCreate):
    db_log = models.Log(
        **log.model_dump(),
        store_id=store_id
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

# Logları listeleme işlemi
def get_logs_by_store(db: Session, store_id: int, days: int = 30, skip: int = 0, limit: int = 100):
    time_filter = datetime.utcnow() - timedelta(days=days)
    return db.query(models.Log).filter(
        models.Log.store_id == store_id,
        models.Log.timestamp >= time_filter
    ).order_by(models.Log.timestamp.desc()).offset(skip).limit(limit).all()

# Logları silme işlemi
def delete_old_logs(db: Session, days: int = 30):
    """30 günden eski logları siler. Bu bir arka plan görevi olarak çalıştırılmalı."""
    time_filter = datetime.utcnow() - timedelta(days=days)
    num_deleted = db.query(models.Log).filter(models.Log.timestamp < time_filter).delete()
    db.commit()
    return num_deleted