from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class EventBase(BaseModel):
    mentor_id: str
    campaign_key: str  # ADDED for multi-campaign
    event_type: str  # visit | click
    action_key: Optional[str] = None  # solo para clicks
    country: Optional[str] = None
    ip_hash: Optional[str] = None
    user_agent: Optional[str] = None

class EventCreate(EventBase):
    pass

class Event(EventBase):
    id: str
    timestamp: datetime
    
    class Config:
        from_attributes = True

class EventStats(BaseModel):
    mentor_id: str
    mentor_name: str
    total_visits: int
    total_clicks: int
    visits_7d: int
    visits_30d: int
    clicks_by_action: dict