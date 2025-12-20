from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime
import re

class CampaignBase(BaseModel):
    key: str = Field(..., min_length=2, max_length=50)
    name: str = Field(..., min_length=1, max_length=200)
    active: bool = True
    sort_order: int = 0
    
    @validator('key')
    def validate_key(cls, v):
        # Key must be lowercase, alphanumeric, hyphens only
        pattern = r'^[a-z0-9]+(?:-[a-z0-9]+)*$'
        if not re.match(pattern, v):
            raise ValueError('Campaign key must contain only lowercase letters, numbers, and single hyphens')
        
        if v.startswith('-') or v.endswith('-'):
            raise ValueError('Campaign key cannot start or end with hyphen')
        
        if '--' in v:
            raise ValueError('Campaign key cannot contain double hyphens')
        
        return v.lower()

class CampaignCreate(CampaignBase):
    pass

class CampaignUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    active: Optional[bool] = None
    sort_order: Optional[int] = None

class Campaign(CampaignBase):
    id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
