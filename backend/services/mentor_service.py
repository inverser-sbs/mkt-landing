from motor.motor_asyncio import AsyncIOMotorDatabase
from models.mentor import Mentor, MentorCreate, MentorUpdate
from datetime import datetime
from typing import Optional, List
import os

FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:3000')

class MentorService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.collection = db.mentors
    
    async def create_mentor(self, mentor_data: MentorCreate) -> Mentor:
        # Check if slug already exists
        existing = await self.collection.find_one({"slug": mentor_data.slug})
        if existing:
            raise ValueError(f"Slug '{mentor_data.slug}' already exists")
        
        mentor_dict = mentor_data.dict()
        mentor_dict["created_at"] = datetime.utcnow()
        mentor_dict["updated_at"] = datetime.utcnow()
        
        result = await self.collection.insert_one(mentor_dict)
        mentor_dict["id"] = str(result.inserted_id)
        mentor_dict["_id"] = result.inserted_id
        mentor_dict["public_url"] = f"{FRONTEND_URL}/{mentor_data.slug}"
        
        return Mentor(**mentor_dict)
    
    async def get_mentor_by_slug(self, slug: str) -> Optional[Mentor]:
        mentor = await self.collection.find_one({"slug": slug, "active": True})
        if not mentor:
            return None
        
        mentor["id"] = str(mentor["_id"])
        mentor["public_url"] = f"{FRONTEND_URL}/{slug}"
        return Mentor(**mentor)
    
    async def get_mentor_by_id(self, mentor_id: str) -> Optional[Mentor]:
        from bson import ObjectId
        mentor = await self.collection.find_one({"_id": ObjectId(mentor_id)})
        if not mentor:
            return None
        
        mentor["id"] = str(mentor["_id"])
        mentor["public_url"] = f"{FRONTEND_URL}/{mentor['slug']}"
        return Mentor(**mentor)
    
    async def get_all_mentors(self, active_only: bool = False, group: Optional[str] = None) -> List[Mentor]:
        query = {}
        if active_only:
            query["active"] = True
        if group:
            query["mentor_group"] = group
        
        mentors = []
        async for mentor in self.collection.find(query):
            mentor["id"] = str(mentor["_id"])
            mentor["public_url"] = f"{FRONTEND_URL}/{mentor['slug']}"
            mentors.append(Mentor(**mentor))
        
        return mentors
    
    async def update_mentor(self, mentor_id: str, mentor_data: MentorUpdate) -> Optional[Mentor]:
        from bson import ObjectId
        
        update_dict = {k: v for k, v in mentor_data.dict(exclude_unset=True).items() if v is not None}
        
        if "slug" in update_dict:
            # Check if new slug already exists
            existing = await self.collection.find_one({
                "slug": update_dict["slug"],
                "_id": {"$ne": ObjectId(mentor_id)}
            })
            if existing:
                raise ValueError(f"Slug '{update_dict['slug']}' already exists")
        
        if update_dict:
            update_dict["updated_at"] = datetime.utcnow()
            await self.collection.update_one(
                {"_id": ObjectId(mentor_id)},
                {"$set": update_dict}
            )
        
        return await self.get_mentor_by_id(mentor_id)
    
    async def delete_mentor(self, mentor_id: str) -> bool:
        from bson import ObjectId
        result = await self.collection.delete_one({"_id": ObjectId(mentor_id)})
        return result.deleted_count > 0
