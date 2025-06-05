from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class StoreCreate(BaseModel):
    name: str
    country: str
    city: str
    branch: Optional[str] = None
    address: Optional[str] = None

class StoreResponse(BaseModel):
    id: int
    name: str
    country: str
    city: str
    branch: Optional[str] = None
    address: Optional[str] = None
    server_token: Optional[str] = None
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True