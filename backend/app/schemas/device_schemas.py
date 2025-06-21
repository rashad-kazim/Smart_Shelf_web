# app/schemas/device_schemas.py

from pydantic import BaseModel
from typing import Optional

class DeviceBase(BaseModel):
    screen_size: Optional[str] = None
    wifi_ssid: Optional[str] = None
    wifi_password: Optional[str] = None
    all_day_work: Optional[bool] = False
    awake_time: Optional[str] = None
    sleep_time: Optional[str] = None
    software_version: Optional[str] = "1.0.0"

class DeviceCreate(DeviceBase):
    pass

class DeviceResponse(DeviceBase):
    id: int
    store_id: int
    
    # Şifreyi asla API yanıtında göndermeyiz
    wifi_password: Optional[str] = None 

    class Config:
        from_attributes = True