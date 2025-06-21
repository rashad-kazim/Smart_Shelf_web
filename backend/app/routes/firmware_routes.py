# app/routes/firmware_routes.py

import shutil
from pathlib import Path
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form, Request
from sqlalchemy.orm import Session

from app.database import models
from app.database.connection import get_db
from app.schemas import firmware_schemas
from app.crud import firmware_crud
from app.security.security import get_current_user

router = APIRouter(prefix="/api/firmware", tags=["Firmware"])

# Güncellemelerin yükleneceği klasör
UPLOAD_DIRECTORY = Path("firmware_updates")
UPLOAD_DIRECTORY.mkdir(exist_ok=True)

# Upload a new firmware file
@router.post("/", response_model=firmware_schemas.FirmwareResponse, status_code=status.HTTP_201_CREATED)
def upload_firmware(
    file: UploadFile = File(...),
    version: str = Form(...),
    target: str = Form(...),
    release_notes: str = Form(None),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Uploads a new firmware file. Only Admins can perform this action.
    """
    if current_user.role != models.UserRole.Admin:
        raise HTTPException(status_code=403, detail="Not authorized")

    file_path = UPLOAD_DIRECTORY / file.filename
    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    file_url = f"/firmware_updates/{file.filename}"
    
    firmware_data = firmware_schemas.FirmwareCreate(
        version=version, target=target, release_notes=release_notes
    )
    return firmware_crud.create_firmware_update(db, firmware=firmware_data, file_url=file_url)

# List all firmware updates
@router.get("/", response_model=List[firmware_schemas.FirmwareResponse])
def list_firmware_updates(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Lists all firmware updates."""
    return firmware_crud.get_firmware_updates(db)

# @router.get("/{target}", response_model=firmware_schemas.FirmwareResponse)
@router.get("/latest")
def get_latest_firmware_version(
    target: str,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    For 2nd layer servers to check the latest firmware update.
    This endpoint should be protected with server_token.
    """
    server_token = request.headers.get("X-Server-Token")
    if not server_token:
        raise HTTPException(status_code=401, detail="Server token missing")
    
    # Token'a ait mağazanın varlığını kontrol et (daha detaylı yetkilendirme yapılabilir)
    store = db.query(models.Store).filter(models.Store.server_token == server_token).first()
    if not store:
        raise HTTPException(status_code=403, detail="Invalid server token")

    firmware = firmware_crud.get_latest_firmware(db, target=target)
    if not firmware:
        raise HTTPException(status_code=404, detail="No firmware found for the target")
    
    return firmware