# app/routes/utility_routes.py

from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from countryinfo import CountryInfo

from app.database import models
from app.database.connection import get_db
from app.security.security import get_current_user

router = APIRouter(prefix="/api/utils", tags=["Utilities"])

@router.get("/countries", response_model=List[str])
def get_all_countries(
    current_user: models.User = Depends(get_current_user)
):
    """
    Tüm dünya ülkelerinin tam ve standart bir listesini döndürür.
    Bu liste, yeni mağaza eklerken tutarlılık sağlar.
    """
    try:
        # Kütüphaneyi kullanarak tüm ülkelerin bir sözlüğünü al
        all_countries_dict = CountryInfo().all()
        # Sadece ülke isimlerini alıp alfabetik olarak sırala
        country_names = sorted(list(all_countries_dict.keys()))
        return country_names
    except Exception as e:
        # Kütüphaneyle ilgili bir sorun olursa hata döndür
        raise HTTPException(status_code=500, detail=f"Could not fetch country list: {e}")


@router.get("/cities", response_model=List[str])
def get_cities_for_country(
    country: str,
    current_user: models.User = Depends(get_current_user)
):
    """
    Belirli bir ülkedeki tüm şehirleri (veya eyaletleri/bölgeleri) listeler.
    """
    try:
        country_info = CountryInfo(country)
        # Kütüphane bu listeyi 'provinces' olarak adlandırıyor, bu bizim amacımız için yeterli.
        cities = country_info.provinces()
        return sorted(cities)
    except KeyError:
        # Eğer kütüphane verilen ülke ismini bulamazsa, boş bir liste döndürürüz.
        # Bu, kullanıcı henüz yazmayı bitirmediğinde hata alınmasını engeller.
        return []
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not fetch city list for {country}: {e}")