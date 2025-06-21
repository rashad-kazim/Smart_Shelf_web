# app/crud/firmware_crud.py

# CRUD operations for firmware updates in the database
from sqlalchemy.orm import Session
from app.database import models
from app.schemas import firmware_schemas

# Get all firmware updates from the database with pagination
def get_firmware_updates(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.FirmwareUpdate).order_by(models.FirmwareUpdate.created_at.desc()).offset(skip).limit(limit).all()

# Create a new firmware update entry in the database
def create_firmware_update(db: Session, firmware: firmware_schemas.FirmwareCreate, file_url: str):
    db_firmware = models.FirmwareUpdate(
        **firmware.model_dump(),
        file_url=file_url
    )
    db.add(db_firmware)
    db.commit()
    db.refresh(db_firmware)
    return db_firmware

# Get the latest firmware update for a specific target (e.g., "server" or "esp32")
def get_latest_firmware(db: Session, target: str):
    return db.query(models.FirmwareUpdate).filter(models.FirmwareUpdate.target == target).order_by(models.FirmwareUpdate.created_at.desc()).first()