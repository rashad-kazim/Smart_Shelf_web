# app/schemas/device_schemas.py

from pydantic import BaseModel, computed_field
from typing import Optional, List

class DeviceBase(BaseModel):
    # Bu şema, hem oluşturma hem de güncelleme için temel alanları tanımlar.
    # Frontend'in gönderdiği 'id', bizim device_local_id'mizdir.
    id: int 
    
    screen_size: Optional[str] = None
    wifi_ssid: Optional[str] = None
    wifi_password: Optional[str] = None
    all_day_work: Optional[bool] = False
    awake_time: Optional[str] = None
    sleep_time: Optional[str] = None
    software_version: Optional[str] = "1.0.0"

    product_name_font_size: Optional[int] = 12
    product_price_font_size_before_discount: Optional[int] = 12
    product_price_font_size_after_discount: Optional[int] = 12
    product_barcode_font_size: Optional[int] = 12
    product_barcode_numbers_font_size: Optional[int] = 12
    

class DeviceCreate(DeviceBase):
    pass

class DeviceUpdate(DeviceBase):
    # Update için tüm alanları optional yapıyoruz
    id: Optional[int] = None
    screen_size: Optional[str] = None
    wifi_ssid: Optional[str] = None
    wifi_password: Optional[str] = None
    all_day_work: Optional[bool] = None
    awake_time: Optional[str] = None
    sleep_time: Optional[str] = None
    software_version: Optional[str] = None
    product_name_font_size: Optional[int] = None
    product_price_font_size_before_discount: Optional[int] = None
    product_price_font_size_after_discount: Optional[int] = None
    product_barcode_font_size: Optional[int] = None
    product_barcode_numbers_font_size: Optional[int] = None

# BU ŞEMA, API'DEN FRONTEND'E VERİ GÖNDERİRKEN KULLANILIR
class DeviceResponse(BaseModel):
    # Veritabanından gelen alanlar
    device_local_id: int
    store_id: int
    screen_size: Optional[str] = None
    wifi_ssid: Optional[str] = None
    wifi_password: Optional[str] = None 
    all_day_work: Optional[bool] = False
    awake_time: Optional[str] = None
    sleep_time: Optional[str] = None
    software_version: Optional[str] = "1.0.0"
    product_name_font_size: Optional[int] = 12
    product_price_font_size_before_discount: Optional[int] = 12
    product_price_font_size_after_discount: Optional[int] = 12
    product_barcode_font_size: Optional[int] = 12
    product_barcode_numbers_font_size: Optional[int] = 12

    # --- HATA ÇÖZÜMÜ ---
    # `db_id` alanını isteğe bağlı (Optional) yapıyoruz.
    # Bu, veritabanı modelinde bu isimde bir alan olmasa bile Pydantic'in hata vermesini engeller.


    # Frontend'in her zaman 'id' olarak beklemesi için bir property oluşturuyoruz.
    # Bu, frontend kodunu daha tutarlı hale getirir.
    @computed_field
    @property
    def id(self) -> int:
        return self.device_local_id

    class Config:
        from_attributes = True # SQLAlchemy modelinden Pydantic modeline otomatik dönüşüm sağlar