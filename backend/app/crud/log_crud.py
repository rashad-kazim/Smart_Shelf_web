# app/crud/log_crud.py

from sqlalchemy.orm import Session
from app.database import models
from app.schemas import log_schemas
from datetime import datetime, timedelta,date, timezone

# Log CRUD işlemleri
# Bu modül, log kayıtlarını oluşturma, okuma ve silme işlemlerini içerir.

last_cleanup_date: date=None
# Log oluşturma işlemi
def create_log(db: Session, store_id: int, log: log_schemas.LogCreate):
    """
    Yeni bir log oluşturur ve eğer günün ilk işlemiyse eski logları otomatik olarak temizler.
    """
    global last_cleanup_date
    today = date.today()

# Eğer daha önce hiç temizlik yapılmadıysa veya son temizlik dünden eskiyse...
    if last_cleanup_date is None or last_cleanup_date < today:
        print(f"Günün ilk logu alındı. {today} için eski loglar temizleniyor...")
        try:
            deleted_count = delete_old_logs(db)
            print(f"{deleted_count} adet eski log silindi.")
            last_cleanup_date = today # Temizlik yapıldığı tarihi güncelle
        except Exception as e:
            print(f"Otomatik log temizleme sırasında hata oluştu: {e}")

# Log oluşturma işlemi
    db_log = models.Log(
        **log.model_dump(),
        store_id=store_id
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

# --- Toplu log kaydı ---
def bulk_create_logs(db: Session, store_id: int, logs: list[log_schemas.LogCreate]):
    """
    Bir log listesini tek seferde, verimli bir şekilde veritabanına ekler.
    """
    # Gelen listedeki her bir log için bir veritabanı nesnesi oluştur.
    db_logs = [
        models.Log(**log.model_dump(), store_id=store_id)
        for log in logs
    ]
    
    # Tüm log nesnelerini tek bir işlemde veritabanına ekle.
    db.add_all(db_logs)
    db.commit()
    return {"status": "success", "logs_added": len(db_logs)}


# Logları listeleme işlemi
def get_logs_by_store(db: Session, store_id: int, days: int = 30, skip: int = 0, limit: int = 100):
    time_filter = datetime.now(timezone.utc) - timedelta(days=days)
    return db.query(models.Log).filter(
        models.Log.store_id == store_id,
        models.Log.timestamp >= time_filter
    ).order_by(models.Log.timestamp.desc()).offset(skip).limit(limit).all()

# Logları silme işlemi
def delete_old_logs(db: Session, days: int = 30):
    """30 günden eski logları siler. Bu bir arka plan görevi olarak çalıştırılmalı."""
    time_filter = datetime.now(timezone.utc) - timedelta(days=days)
    num_deleted = db.query(models.Log).filter(models.Log.timestamp < time_filter).delete()
    db.commit()
    return num_deleted