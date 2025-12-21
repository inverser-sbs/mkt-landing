from motor.motor_asyncio import AsyncIOMotorDatabase
from models.mentor_campaign import MentorCampaign, MentorCampaignCreate, MentorCampaignUpdate
from datetime import datetime
from typing import Optional, List, Dict
from uuid import uuid4

class MentorCampaignService:
    """Service for managing mentor-campaign assignments"""
    
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.collection = db.mentor_campaigns
    
    async def assign_mentor_to_campaign(
        self, 
        mentor_id: str, 
        campaign_key: str, 
        status: str = "active"
    ) -> MentorCampaign:
        """Assign a mentor to a campaign (or update existing assignment)"""
        # Verify mentor exists
        mentor = await self.db.mentors.find_one({"id": mentor_id})
        if not mentor:
            raise ValueError(f"Mentor '{mentor_id}' does not exist")
        
        # Verify campaign exists
        campaign = await self.db.campaigns.find_one({"key": campaign_key})
        if not campaign:
            raise ValueError(f"Campaign '{campaign_key}' does not exist")
        
        # Check if assignment already exists
        existing = await self.collection.find_one({
            "mentor_id": mentor_id,
            "campaign_key": campaign_key
        })
        
        if existing:
            # Update existing assignment
            await self.collection.update_one(
                {"_id": existing["_id"]},
                {"$set": {
                    "status": status,
                    "updated_at": datetime.utcnow()
                }}
            )
            existing["status"] = status
            existing["id"] = str(existing["_id"])
            return MentorCampaign(**existing)
        else:
            # Create new assignment
            assignment = {
                "id": str(uuid4()),
                "mentor_id": mentor_id,
                "campaign_key": campaign_key,
                "status": status,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            await self.collection.insert_one(assignment)
            return MentorCampaign(**assignment)
    
    async def remove_mentor_from_campaign(
        self, 
        mentor_id: str, 
        campaign_key: str,
        cleanup_data: bool = False
    ) -> Dict:
        """
        Remove a mentor from a campaign.
        If cleanup_data=True, also removes mentor_links and magic_tokens for this campaign.
        """
        result = {
            "assignment_removed": False,
            "links_deleted": 0,
            "tokens_deleted": 0
        }
        
        # Remove assignment
        delete_result = await self.collection.delete_one({
            "mentor_id": mentor_id,
            "campaign_key": campaign_key
        })
        result["assignment_removed"] = delete_result.deleted_count > 0
        
        if cleanup_data:
            # Delete mentor_links for this mentor+campaign
            links_result = await self.db.mentor_links.delete_many({
                "mentor_id": mentor_id,
                "campaign_key": campaign_key
            })
            result["links_deleted"] = links_result.deleted_count
            
            # Delete magic_tokens for this mentor+campaign
            tokens_result = await self.db.magic_tokens.delete_many({
                "mentor_id": mentor_id,
                "campaign_key": campaign_key
            })
            result["tokens_deleted"] = tokens_result.deleted_count
        
        return result
    
    async def get_mentor_campaigns(self, mentor_id: str) -> List[Dict]:
        """Get all campaigns a mentor is assigned to with their status"""
        assignments = []
        async for assignment in self.collection.find({"mentor_id": mentor_id}):
            # Get campaign info
            campaign = await self.db.campaigns.find_one({"key": assignment["campaign_key"]})
            
            # Check if magic link exists
            magic_token = await self.db.magic_tokens.find_one({
                "mentor_id": mentor_id,
                "campaign_key": assignment["campaign_key"]
            })
            
            assignments.append({
                "campaign_key": assignment["campaign_key"],
                "campaign_name": campaign.get("name") if campaign else assignment["campaign_key"],
                "status": assignment.get("status", "active"),
                "has_magic_link": magic_token is not None,
                "assigned_at": assignment.get("created_at")
            })
        
        return assignments
    
    async def get_campaign_mentors(
        self, 
        campaign_key: str, 
        status_filter: Optional[str] = None
    ) -> List[str]:
        """Get all mentor IDs assigned to a campaign"""
        query = {"campaign_key": campaign_key}
        if status_filter:
            query["status"] = status_filter
        
        mentor_ids = []
        async for assignment in self.collection.find(query):
            mentor_ids.append(assignment["mentor_id"])
        
        return mentor_ids
    
    async def is_mentor_in_campaign(self, mentor_id: str, campaign_key: str) -> bool:
        """Check if a mentor is assigned to a campaign"""
        assignment = await self.collection.find_one({
            "mentor_id": mentor_id,
            "campaign_key": campaign_key
        })
        return assignment is not None
    
    async def get_mentor_status_in_campaign(
        self, 
        mentor_id: str, 
        campaign_key: str
    ) -> Optional[str]:
        """Get mentor's status in a specific campaign"""
        assignment = await self.collection.find_one({
            "mentor_id": mentor_id,
            "campaign_key": campaign_key
        })
        if assignment:
            return assignment.get("status", "active")
        return None
    
    async def update_mentor_campaign_status(
        self, 
        mentor_id: str, 
        campaign_key: str, 
        status: str
    ) -> bool:
        """Update mentor's status in a campaign"""
        result = await self.collection.update_one(
            {"mentor_id": mentor_id, "campaign_key": campaign_key},
            {"$set": {"status": status, "updated_at": datetime.utcnow()}}
        )
        return result.modified_count > 0
    
    async def bulk_assign_mentor(
        self, 
        mentor_id: str, 
        campaign_keys: List[str],
        remove_others: bool = False
    ) -> Dict:
        """
        Assign mentor to multiple campaigns at once.
        If remove_others=True, removes mentor from campaigns not in the list.
        """
        result = {
            "assigned": [],
            "removed": [],
            "errors": []
        }
        
        # Get current assignments
        current_assignments = await self.get_mentor_campaigns(mentor_id)
        current_keys = {a["campaign_key"] for a in current_assignments}
        
        # Assign to new campaigns
        for campaign_key in campaign_keys:
            try:
                await self.assign_mentor_to_campaign(mentor_id, campaign_key)
                if campaign_key not in current_keys:
                    result["assigned"].append(campaign_key)
            except ValueError as e:
                result["errors"].append({"campaign_key": campaign_key, "error": str(e)})
        
        # Remove from campaigns not in list
        if remove_others:
            for current in current_assignments:
                if current["campaign_key"] not in campaign_keys:
                    await self.remove_mentor_from_campaign(
                        mentor_id, 
                        current["campaign_key"],
                        cleanup_data=False  # Don't delete data by default
                    )
                    result["removed"].append(current["campaign_key"])
        
        return result
    
    async def ensure_indexes(self):
        """Create necessary indexes for mentor_campaigns collection"""
        await self.collection.create_index(
            [("mentor_id", 1), ("campaign_key", 1)],
            unique=True
        )
        await self.collection.create_index([("campaign_key", 1)])
        await self.collection.create_index([("mentor_id", 1)])
