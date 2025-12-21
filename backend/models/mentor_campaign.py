from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime

# Status for mentor in a campaign
MentorCampaignStatus = Literal["active", "paused", "inactive"]

class MentorCampaignBase(BaseModel):
    mentor_id: str
    campaign_key: str
    status: MentorCampaignStatus = "active"

class MentorCampaignCreate(MentorCampaignBase):
    pass

class MentorCampaignUpdate(BaseModel):
    status: Optional[MentorCampaignStatus] = None

class MentorCampaign(MentorCampaignBase):
    id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class MentorWithCampaigns(BaseModel):
    """Extended mentor model with campaign assignments"""
    id: str
    first_name: str
    last_name: str
    email: Optional[str] = None
    slug: str
    photo_url: Optional[str] = None
    active: bool = True
    mentor_group: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    public_url: str  # Default URL (first campaign or base slug)
    # Campaign assignments with their own public_url
    campaigns: list = Field(default_factory=list)  # List of {campaign_key, status, has_magic_link, public_url}
