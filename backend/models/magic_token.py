from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class MagicTokenCreate(BaseModel):
    mentor_id: str
    campaign_key: str
    days_valid: int = 30

class MagicToken(BaseModel):
    id: str
    mentor_id: str
    campaign_key: str
    token_hash: str
    expires_at: datetime
    created_at: datetime
    is_valid: bool = True

class MagicTokenResponse(BaseModel):
    magic_link: str
    expires_at: datetime
    campaign_key: Optional[str] = None
