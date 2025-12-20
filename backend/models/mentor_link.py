from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class MentorLinkBase(BaseModel):
    mentor_id: str
    campaign_key: str  # Campaign this link belongs to
    action_key: str
    url: str = Field(..., min_length=1)

class MentorLinkCreate(MentorLinkBase):
    pass

class MentorLinkUpdate(BaseModel):
    url: Optional[str] = None

class MentorLink(MentorLinkBase):
    id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class MentorLinkBulkUpdate(BaseModel):
    campaign_key: str
    action_key: str
    url: str
    apply_to: str = "all"  # all, active, group
    group_name: Optional[str] = None
    overwrite_existing: bool = True
