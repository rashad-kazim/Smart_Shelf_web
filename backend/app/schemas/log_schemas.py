# app/schemas/log_schemas.py

from pydantic import BaseModel, Field, field_validator
from datetime import datetime, timezone
from typing import Optional

class LogBase(BaseModel):
    source: str = Field(..., description="Örn: 'server' veya 'ESP32-A1B2'")
    level: str = Field(..., description="Örn: 'INFO', 'ERROR', 'WARN'")
    message: str = Field(..., description="Log mesajı")

class LogCreate(LogBase):
    timestamp: datetime = Field(..., description="Log oluşturulma zamanı (UTC)")
    
    @field_validator('timestamp')
    @classmethod
    def ensure_utc_timestamp(cls, v: datetime) -> datetime:
        """
        Gelen timestamp'in UTC formatında olduğundan emin olur.
        Eğer timezone bilgisi yoksa, UTC olarak varsayar.
        Eğer farklı timezone'daysa, UTC'ye çevirir.
        """
        if v is None:
            raise ValueError("Timestamp gereklidir")
        
        # Eğer timezone bilgisi yoksa, UTC olarak varsay
        if v.tzinfo is None:
            return v.replace(tzinfo=timezone.utc)
        
        # Farklı timezone'daysa UTC'ye çevir
        return v.astimezone(timezone.utc)

class LogResponse(LogBase):
    id: int
    store_id: int
    timestamp: datetime

    class Config:
        from_attributes = True