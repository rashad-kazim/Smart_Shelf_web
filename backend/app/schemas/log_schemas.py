# log_schemas.py

# app/schemas/log_schemas.py

from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class LogBase(BaseModel):
    source: str # Örn: "server" veya "ESP32-A1B2"
    level: str  # Örn: "INFO", "ERROR", "WARN"
    message: str

class LogCreate(LogBase):
    pass

class LogResponse(LogBase):
    id: int
    store_id: int
    timestamp: datetime

    class Config:
        from_attributes = True