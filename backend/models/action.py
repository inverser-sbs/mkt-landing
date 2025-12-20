from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime
import re

class ActionBase(BaseModel):
    campaign_key: str = Field(..., min_length=2, max_length=50)
    action_key: str = Field(..., min_length=1, max_length=50)
    button_key: Optional[str] = Field(None, max_length=50)  # Botón del template
    label: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    active: bool = True
    order: int = 0
    action_type: str = "url"  # Por ahora solo URL
    display_slots: List[str] = Field(default_factory=lambda: ["cta"])  # Slots donde se muestra
    
    @validator('action_key')
    def validate_action_key(cls, v):
        pattern = r'^[a-z0-9_-]+$'
        if not re.match(pattern, v):
            raise ValueError('Action key must contain only lowercase letters, numbers, hyphens and underscores')
        return v.lower()
    
    @validator('button_key')
    def validate_button_key(cls, v):
        if v is None:
            return v
        pattern = r'^[a-z0-9_-]+$'
        if not re.match(pattern, v):
            raise ValueError('Button key must contain only lowercase letters, numbers, hyphens and underscores')
        return v.lower()

class ActionCreate(ActionBase):
    pass

class ActionUpdate(BaseModel):
    label: Optional[str] = Field(None, min_length=1, max_length=100)
    button_key: Optional[str] = Field(None, max_length=50)
    description: Optional[str] = None
    active: Optional[bool] = None
    order: Optional[int] = None
    action_type: Optional[str] = None
    display_slots: Optional[List[str]] = None

class Action(ActionBase):
    id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
