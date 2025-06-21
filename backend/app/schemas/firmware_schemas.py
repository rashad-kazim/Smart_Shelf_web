# app/schemas/firmware_schemas.py

from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class FirmwareBase(BaseModel):
    version: str
    target: str # "server" veya "esp32"
    release_notes: Optional[str] = None

class FirmwareCreate(FirmwareBase):
    pass

class FirmwareResponse(FirmwareBase):
    id: int
    file_url: str
    created_at: datetime

    class Config:
        from_attributes = True