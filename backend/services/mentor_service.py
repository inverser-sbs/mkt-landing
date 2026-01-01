from motor.motor_asyncio import AsyncIOMotorDatabase
from models.mentor import Mentor, MentorCreate, MentorUpdate
from datetime import datetime
from typing import Optional, List
from uuid import uuid4
import os
import logging

logger = logging.getLogger(__name__)

def get_frontend_url() -> str:
    """
    Get FRONTEND_URL dynamically - REQUIRED for public URLs.
    Returns empty string if not configured (caller must handle).
    """
    # Try FRONTEND_URL first, then PUBLIC_API_URL as fallback
    url = os.environ.get('FRONTEND_URL', '').strip()
    if not url:
        url = os.environ.get('PUBLIC_API_URL', '').strip()
    
    if url:
        url = url.rstrip('/')
    
    return url

class MentorService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.collection = db.mentors
    
    def _prepare_mentor(self, mentor: dict) -> dict:
        """Prepare mentor document for response"""
        # Use existing 'id' field if present, otherwise generate from _id
        if "id" not in mentor:
            mentor["id"] = str(mentor["_id"])
        # Get FRONTEND_URL dynamically
        frontend_url = get_frontend_url()
        mentor["public_url"] = f"{frontend_url}/{mentor['slug']}"
        return mentor
    
    async def create_mentor(self, mentor_data: MentorCreate) -> Mentor:
        # Check if slug already exists
        existing = await self.collection.find_one({"slug": mentor_data.slug})
        if existing:
            raise ValueError(f"Slug '{mentor_data.slug}' already exists")
        
        mentor_dict = mentor_data.dict()
        mentor_dict["id"] = str(uuid4())  # Generate UUID for id
        mentor_dict["created_at"] = datetime.utcnow()
        mentor_dict["updated_at"] = datetime.utcnow()
        
        await self.collection.insert_one(mentor_dict)
        # Get FRONTEND_URL dynamically
        frontend_url = get_frontend_url()
        mentor_dict["public_url"] = f"{frontend_url}/{mentor_data.slug}"
        
        return Mentor(**mentor_dict)
    
    async def get_mentor_by_slug(self, slug: str) -> Optional[Mentor]:
        mentor = await self.collection.find_one({"slug": slug, "active": True})
        if not mentor:
            return None
        
        mentor = self._prepare_mentor(mentor)
        return Mentor(**mentor)
    
    async def get_mentor_by_id(self, mentor_id: str) -> Optional[Mentor]:
        """Get mentor by UUID id field (not _id)"""
        # First try by 'id' field (UUID)
        mentor = await self.collection.find_one({"id": mentor_id})
        if mentor:
            mentor = self._prepare_mentor(mentor)
            return Mentor(**mentor)
        
        # Fallback: try by ObjectId for backward compatibility
        from bson import ObjectId
        try:
            mentor = await self.collection.find_one({"_id": ObjectId(mentor_id)})
            if mentor:
                mentor = self._prepare_mentor(mentor)
                return Mentor(**mentor)
        except:
            pass
        
        return None
    
    async def get_all_mentors(self, active_only: bool = False, group: Optional[str] = None) -> List[Mentor]:
        query = {}
        if active_only:
            query["active"] = True
        if group:
            query["mentor_group"] = group
        
        mentors = []
        async for mentor in self.collection.find(query):
            mentor = self._prepare_mentor(mentor)
            mentors.append(Mentor(**mentor))
        
        return mentors
    
    async def update_mentor(self, mentor_id: str, mentor_data: MentorUpdate) -> Optional[Mentor]:
        update_dict = {k: v for k, v in mentor_data.dict(exclude_unset=True).items() if v is not None}
        
        if "slug" in update_dict:
            # Check if new slug already exists
            existing = await self.collection.find_one({
                "slug": update_dict["slug"],
                "id": {"$ne": mentor_id}
            })
            if existing:
                raise ValueError(f"Slug '{update_dict['slug']}' already exists")
        
        if update_dict:
            update_dict["updated_at"] = datetime.utcnow()
            result = await self.collection.update_one(
                {"id": mentor_id},
                {"$set": update_dict}
            )
            
            # Fallback to ObjectId if not found by id
            if result.matched_count == 0:
                from bson import ObjectId
                try:
                    await self.collection.update_one(
                        {"_id": ObjectId(mentor_id)},
                        {"$set": update_dict}
                    )
                except:
                    pass
        
        return await self.get_mentor_by_id(mentor_id)
    
    async def delete_mentor(self, mentor_id: str) -> bool:
        # Try by id field first
        result = await self.collection.delete_one({"id": mentor_id})
        if result.deleted_count > 0:
            return True
        
        # Fallback to ObjectId
        from bson import ObjectId
        try:
            result = await self.collection.delete_one({"_id": ObjectId(mentor_id)})
            return result.deleted_count > 0
        except:
            return False
