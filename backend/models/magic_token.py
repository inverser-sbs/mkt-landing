from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class MagicTokenBase(BaseModel):
    mentor_id: str
    expires_at: datetime

class MagicTokenCreate(MagicTokenBase):
    pass

class MagicToken(MagicTokenBase):
    id: str
    token_hash: str
    created_at: datetime
    is_valid: bool = True
    
    class Config:
        from_attributes = True

class MagicTokenResponse(BaseModel):
    magic_link: str
    expires_at: datetime