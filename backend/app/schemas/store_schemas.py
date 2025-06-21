# app/schemas/store_schemas.py

from pydantic import BaseModel, computed_field
from typing import Optional, List
# HATA DÜZELTMESİ: timedelta buraya eklendi
from datetime import datetime, timedelta 
from .device_schemas import DeviceCreate, DeviceResponse

# StoreBase modelini oluştururken, mağaza ile ilgili temel alanları belirtiyoruz.
class StoreBase(BaseModel):
    name: str
    country: str
    city: str
    branch: Optional[str] = None
    address: Optional[str] = None

# StoreCreate modelini oluştururken, yeni mağaza oluşturma için gerekli alanları belirtiyoruz.
class StoreCreate(StoreBase):
    ownerName: str
    ownerSurname: str
    working_hours: str
    devices: List[DeviceCreate]

# StoreUpdate modelini oluştururken, güncellenebilir alanları belirtiyoruz.
class StoreUpdate(BaseModel):
    name: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    branch: Optional[str] = None
    address: Optional[str] = None
    ownerName: Optional[str] = None
    ownerSurname: Optional[str] = None
    working_hours: Optional[str] = None

# StoreResponse modelini oluştururken ilişkisel verileri de içerecek şekilde genişletiyoruz.
class StoreResponse(BaseModel):
    id: int
    name: str
    country: str
    city: str
    branch: Optional[str] = None
    address: Optional[str] = None
    server_token: Optional[str] = None
    esp32_token: Optional[str] = None
    created_at: datetime
    last_seen: Optional[datetime] = None
    owner_name: Optional[str]
    owner_surname: Optional[str]
    working_hours: Optional[str]
    
    installerName: Optional[str] = None
    installerSurname: Optional[str] = None
    devices: List[DeviceResponse] = []
    
    @computed_field
    @property
    def status(self) -> str:
        if self.last_seen and (datetime.utcnow() - self.last_seen) < timedelta(minutes=5):
            return "Online"
        return "Offline"

    @computed_field
    @property
    def num_esp32_connected(self) -> int:
        return len(self.devices)
      
    class Config:
        from_attributes = True