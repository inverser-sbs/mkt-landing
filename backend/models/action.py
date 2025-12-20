from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ActionBase(BaseModel):
    action_key: str = Field(..., min_length=1, max_length=50)
    label: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    active: bool = True
    order: int = 0
    action_type: str = "url"  # Por ahora solo URL

class ActionCreate(ActionBase):
    pass

class ActionUpdate(BaseModel):
    label: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    active: Optional[bool] = None
    order: Optional[int] = None
    action_type: Optional[str] = None

class Action(ActionBase):
    id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True