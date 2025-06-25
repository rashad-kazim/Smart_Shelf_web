# app/routes/utility_routes.py

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
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
    Ülkeleri role göre listeler:
    - Admin: Tüm dünya ülkelerini görür.
    - Diğerleri: Sadece kendi ülkelerini görürler.
    """
    # Kural 1: Eğer kullanıcı Admin ise, tüm ülkeleri döndür.
    if current_user.role == models.UserRole.Admin:
        try:
            all_countries_dict = CountryInfo().all()
            country_names = sorted(list(all_countries_dict.keys()))
            return country_names
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Could not fetch country list: {e}")
    
    # Kural 2: Eğer kullanıcı Admin değilse, sadece kendi ülkesini içeren bir liste döndür.
    else:
        if not current_user.country:
            return []
        return [current_user.country]


@router.get("/cities", response_model=List[str])
def get_cities_for_country(
    country: str,
    current_user: models.User = Depends(get_current_user)
):
    """
    Belirli bir ülkenin şehirlerini listeler ve yetki kontrolü yapar.
    - Admin: Herhangi bir ülkenin şehirlerini görebilir.
    - Diğerleri: Sadece kendi ülkelerinin şehirlerini görebilir.
    """
    # Yetki Kontrolü: Eğer kullanıcı Admin değilse ve kendi ülkesi dışında
    # bir ülkenin şehirlerini sorguluyorsa, isteği reddet.
    if current_user.role != models.UserRole.Admin and current_user.country != country:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only view cities in your own country."
        )

    try:
        country_info = CountryInfo(country)
        cities = country_info.provinces()
        return sorted(cities)
    except KeyError:
        return []
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not fetch city list for {country}: {e}")
