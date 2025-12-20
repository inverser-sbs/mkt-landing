from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime
import re

class MentorBase(BaseModel):
    first_name: str = Field(..., min_length=1, max_length=100)
    last_name: str = Field(..., min_length=1, max_length=100)
    email: Optional[str] = None
    slug: str = Field(..., min_length=3, max_length=50)
    photo_url: Optional[str] = None
    active: bool = True
    mentor_group: Optional[str] = None

    @validator('slug')
    def validate_slug(cls, v):
        # Reserved words
        reserved = ['admin', 'edit', 'api', 'login', 'assets', 'static', 'track', 'analytics']
        if v.lower() in reserved:
            raise ValueError(f'Slug "{v}" is reserved')
        
        # Pattern validation
        pattern = r'^[a-z0-9]+(?:-[a-z0-9]+)*$'
        if not re.match(pattern, v):
            raise ValueError('Slug must contain only lowercase letters, numbers, and single hyphens')
        
        # Cannot start or end with hyphen
        if v.startswith('-') or v.endswith('-'):
            raise ValueError('Slug cannot start or end with hyphen')
        
        # No double hyphens
        if '--' in v:
            raise ValueError('Slug cannot contain double hyphens')
        
        return v.lower()

class MentorCreate(MentorBase):
    pass

class MentorUpdate(BaseModel):
    first_name: Optional[str] = Field(None, min_length=1, max_length=100)
    last_name: Optional[str] = Field(None, min_length=1, max_length=100)
    email: Optional[str] = None
    slug: Optional[str] = Field(None, min_length=3, max_length=50)
    photo_url: Optional[str] = None
    active: Optional[bool] = None
    mentor_group: Optional[str] = None

class Mentor(MentorBase):
    id: str
    created_at: datetime
    updated_at: datetime
    public_url: str
    
    class Config:
        from_attributes = True