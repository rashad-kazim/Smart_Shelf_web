from fastapi import APIRouter, HTTPException, Depends
from app.schemas.store_schemas import StoreCreate, StoreResponse
from app.database.connection import db
from app.utils.token_utils import generate_server_token
from typing import List

router = APIRouter(prefix="/api/stores", tags=["stores"])

@router.get("/", response_model=List[StoreResponse])
async def get_stores():
    """List all stores"""
    connection = db.get_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection error")

    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM stores ORDER BY created_at DESC")
        stores = cursor.fetchall()
        return stores
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Data retrieval error: {str(e)}")
    finally:
        cursor.close()

@router.get("/{store_id}", response_model=StoreResponse)
async def get_store(store_id: int):
    """Get single store details"""
    connection = db.get_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM stores WHERE id = %s", (store_id,))
        store = cursor.fetchone()
        
        if not store:
            raise HTTPException(status_code=404, detail="Store not found")
        
        return store
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Veri çekme hatası: {str(e)}")
    finally:
        cursor.close()

@router.post("/", response_model=StoreResponse)
async def create_store(store: StoreCreate):
    """New store creation"""
    connection = db.get_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    cursor = connection.cursor(dictionary=True)
    try:
        # Server token üret
        server_token = generate_server_token()
        
        query = """
        INSERT INTO stores (name, country, city, branch, address, server_token)
        VALUES (%s, %s, %s, %s, %s, %s)
        """
        values = (
            store.name,
            store.country,
            store.city,
            store.branch,
            store.address,
            server_token
        )
        
        cursor.execute(query, values)
        connection.commit()
        
        # Oluşturulan mağazayı getir
        store_id = cursor.lastrowid
        cursor.execute("SELECT * FROM stores WHERE id = %s", (store_id,))
        created_store = cursor.fetchone()
        
        return created_store
    except Exception as e:
        connection.rollback()
        raise HTTPException(status_code=500, detail=f"Store creation error: {str(e)}")
    finally:
        cursor.close()


@router.post("/{store_id}/regenerate-token")
async def regenerate_server_token(store_id: int):
    """Mağaza server tokenını yeniler"""
    connection = db.get_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Veritabanı bağlantı hatası")
    
    cursor = connection.cursor(dictionary=True)
    try:
        # Controlla store exists
        cursor.execute("SELECT id FROM stores WHERE id = %s", (store_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Store not found")

        # Generate new server token and update it
        new_token = generate_server_token()
        cursor.execute(
            "UPDATE stores SET server_token = %s WHERE id = %s",
            (new_token, store_id)
        )
        connection.commit()

        return {"message": "Token added successfully", "new_token": new_token}
    except HTTPException:
        raise
    except Exception as e:
        connection.rollback()
        raise HTTPException(status_code=500, detail=f"Token regeneration error: {str(e)}")
    finally:
        cursor.close()





@router.delete("/{store_id}")
async def delete_store(store_id: int):
    """Delete a store by ID"""
    connection = db.get_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection error")

    cursor = connection.cursor()
    try:
        # Check if the store exists
        cursor.execute("SELECT id FROM stores WHERE id = %s", (store_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Store not found")

        # Delete the store
        cursor.execute("DELETE FROM stores WHERE id = %s", (store_id,))
        connection.commit()

        return {"message": "Store deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        connection.rollback()
        raise HTTPException(status_code=500, detail=f"Store deletion error: {str(e)}")
    finally:
        cursor.close()