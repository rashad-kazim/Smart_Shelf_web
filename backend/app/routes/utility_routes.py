# app/routes/utility_routes.py

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from countryinfo import CountryInfo
import geonamescache

from app.database import models
from app.database.connection import get_db
from app.security.security import get_current_user

router = APIRouter(prefix="/api/utils", tags=["Utilities"])
gc = geonamescache.GeonamesCache()

@router.get("/countries", response_model=List[str])
def get_all_countries(
    current_user: models.User = Depends(get_current_user)
):
    """
    Ülkeleri role göre listeler.
    """
    if current_user.role == models.UserRole.Admin:
        try:
            all_countries_dict = CountryInfo().all()
            country_names = sorted(list(all_countries_dict.keys()))
            return country_names
        except Exception:
            return []
    else:
        return [current_user.country] if current_user.country else []


@router.get("/cities", response_model=List[str])
def get_cities_for_country(
    country: str,
    current_user: models.User = Depends(get_current_user)
):
    """
    Belirli bir ülkenin 'benzersiz' şehir listesini döndürür.
    """
    if current_user.role != models.UserRole.Admin and current_user.country.lower() != country.lower():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only view cities in your own country."
        )

    try:
        # Ülke kodunu al (örn: 'Poland' -> 'PL')
        country_code = CountryInfo(country.lower()).iso()["alpha2"]
        
        # Geonamescache'den tüm şehir verilerini çek
        all_cities_data = gc.get_cities()
        
        # İlgili ülkeye ait tüm şehir isimlerini (tekrarlar dahil) bir listeye topla
        filtered_cities_with_duplicates = [
            city_data["name"]
            for city_data in all_cities_data.values()
            if city_data["countrycode"] == country_code
        ]
        
        # --- DÜZELTME: Tekrarları temizleme ---
        # 1. Listeyi bir 'set'e dönüştürerek tekrarları otomatik olarak kaldır.
        # 2. Set'i tekrar bir 'list'eye çevir.
        # 3. Sonucu alfabetik olarak sırala.
        unique_cities = sorted(list(set(filtered_cities_with_duplicates)))
        
        return unique_cities

    except Exception:
        # Herhangi bir hata durumunda (ülke bulunamadı vb.), güvenli bir şekilde boş liste döndür.
        return []