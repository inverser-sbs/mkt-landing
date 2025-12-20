from motor.motor_asyncio import AsyncIOMotorDatabase
from models.mentor_link import MentorLink, MentorLinkCreate, MentorLinkUpdate, MentorLinkBulkUpdate
from datetime import datetime
from typing import Optional, List, Dict
from bson import ObjectId

class MentorLinkService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.collection = db.mentor_links
    
    async def create_or_update_link(self, link_data: MentorLinkCreate) -> MentorLink:
        # Check if link already exists for this mentor and action
        existing = await self.collection.find_one({
            "mentor_id": link_data.mentor_id,
            "action_key": link_data.action_key
        })
        
        link_dict = link_data.dict()
        link_dict["updated_at"] = datetime.utcnow()
        
        if existing:
            # Update existing
            await self.collection.update_one(
                {"_id": existing["_id"]},
                {"$set": link_dict}
            )
            link_dict["id"] = str(existing["_id"])
            link_dict["_id"] = existing["_id"]
            link_dict["created_at"] = existing["created_at"]
        else:
            # Create new
            link_dict["created_at"] = datetime.utcnow()
            result = await self.collection.insert_one(link_dict)
            link_dict["id"] = str(result.inserted_id)
            link_dict["_id"] = result.inserted_id
        
        return MentorLink(**link_dict)
    
    async def get_mentor_links(self, mentor_id: str) -> List[MentorLink]:
        links = []
        async for link in self.collection.find({"mentor_id": mentor_id}):
            link["id"] = str(link["_id"])
            links.append(MentorLink(**link))
        return links
    
    async def get_mentor_links_dict(self, mentor_id: str) -> Dict[str, str]:
        """Returns dict of action_key: url"""
        links = await self.get_mentor_links(mentor_id)
        return {link.action_key: link.url for link in links}
    
    async def delete_link(self, mentor_id: str, action_key: str) -> bool:
        result = await self.collection.delete_one({
            "mentor_id": mentor_id,
            "action_key": action_key
        })
        return result.deleted_count > 0
    
    async def bulk_update_links(self, bulk_data: MentorLinkBulkUpdate) -> Dict:
        """Update links for multiple mentors at once"""
        # Build query based on apply_to
        mentor_query = {}
        if bulk_data.apply_to == "active":
            mentor_query["active"] = True
        elif bulk_data.apply_to == "group":
            if not bulk_data.group_name:
                raise ValueError("group_name required when apply_to='group'")
            mentor_query["mentor_group"] = bulk_data.group_name
        
        # Get matching mentors
        mentors = []
        async for mentor in self.db.mentors.find(mentor_query):
            mentors.append(str(mentor["_id"]))
        
        updated_count = 0
        skipped_count = 0
        
        for mentor_id in mentors:
            # Check if link exists
            existing = await self.collection.find_one({
                "mentor_id": mentor_id,
                "action_key": bulk_data.action_key
            })
            
            if existing and not bulk_data.overwrite_existing:
                skipped_count += 1
                continue
            
            # Create or update
            link_data = MentorLinkCreate(
                mentor_id=mentor_id,
                action_key=bulk_data.action_key,
                url=bulk_data.url
            )
            await self.create_or_update_link(link_data)
            updated_count += 1
        
        return {
            "total_mentors": len(mentors),
            "updated": updated_count,
            "skipped": skipped_count
        }