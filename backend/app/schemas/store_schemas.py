# app/schemas/store_schemas.py

from pydantic import BaseModel, computed_field
from typing import Optional, List
# HATA DÜZELTMESİ: timedelta buraya eklendi
from datetime import datetime, timedelta, timezone 
from .device_schemas import DeviceCreate, DeviceResponse

from .user_schemas import UserResponse

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
    server_local_ip: Optional[str] = None
    devices: List[DeviceCreate] = []

# StoreUpdate modelini oluştururken, güncellenebilir alanları belirtiyoruz.
class StoreUpdate(BaseModel):
    name: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    branch: Optional[str] = None
    address: Optional[str] = None
    # DÜZELTME: Frontend'den gelen camelCase fieldları kabul et
    ownerName: Optional[str] = None
    ownerSurname: Optional[str] = None
    working_hours: Optional[str] = None
    server_local_ip: Optional[str] = None
    devices: Optional[List[DeviceCreate]] = None

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
    server_local_ip: Optional[str] = None
    created_at: datetime
    last_seen: Optional[datetime] = None
    owner_name: Optional[str] = None
    owner_surname: Optional[str] = None
    working_hours: Optional[str] = None

    
    installer: Optional[UserResponse] = None
    devices: List[DeviceResponse] = []

    
    @computed_field
    @property
    def installerName(self) -> Optional[str]:
        # Artık self.installer'a erişebilir
        return self.installer.name if self.installer else None

    @computed_field
    @property
    def installerSurname(self) -> Optional[str]:
        # Artık self.installer'a erişebilir
        return self.installer.surname if self.installer else None

    @computed_field
    @property
    def status(self) -> str:
        if self.last_seen:
            try:
                # last_seen'i timezone-aware yapmak için UTC timezone'u ekle
                if self.last_seen.tzinfo is None:
                    # Eğer timezone bilgisi yoksa UTC olarak varsay
                    last_seen_aware = self.last_seen.replace(tzinfo=timezone.utc)
                else:
                    last_seen_aware = self.last_seen
                
                # Şimdi iki timezone-aware datetime'ı karşılaştırabiliriz
                if (datetime.now(timezone.utc) - last_seen_aware) < timedelta(minutes=5):
                    return "Online"
            except Exception:
                # Herhangi bir hata durumunda Offline döndür
                return "Offline"
        return "Offline"

    @computed_field
    @property
    def num_esp32_connected(self) -> int:
        # Artık self.devices'a erişebilir
        return len(self.devices) if self.devices else 0
      
    class Config:
        from_attributes = True