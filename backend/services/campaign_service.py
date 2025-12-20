from motor.motor_asyncio import AsyncIOMotorDatabase
from models.campaign import Campaign, CampaignCreate, CampaignUpdate
from datetime import datetime
from typing import List, Optional

class CampaignService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.collection = db.campaigns
    
    async def create_campaign(self, campaign_data: CampaignCreate) -> Campaign:
        # Check if key already exists
        existing = await self.collection.find_one({"key": campaign_data.key})
        if existing:
            raise ValueError(f"Campaign key '{campaign_data.key}' already exists")
        
        # Reserved keys
        reserved = ['admin', 'edit', 'api', 'login', 'assets', 'static', 'track', 'analytics']
        if campaign_data.key in reserved:
            raise ValueError(f"Campaign key '{campaign_data.key}' is reserved")
        
        campaign_dict = campaign_data.dict()
        campaign_dict["created_at"] = datetime.utcnow()
        campaign_dict["updated_at"] = datetime.utcnow()
        
        result = await self.collection.insert_one(campaign_dict)
        campaign_dict["id"] = str(result.inserted_id)
        campaign_dict["_id"] = result.inserted_id
        
        return Campaign(**campaign_dict)
    
    async def get_all_campaigns(self, active_only: bool = False) -> List[Campaign]:
        query = {}
        if active_only:
            query["active"] = True
        
        campaigns = []
        async for campaign in self.collection.find(query).sort("sort_order", 1):
            campaign["id"] = str(campaign["_id"])
            campaigns.append(Campaign(**campaign))
        
        return campaigns
    
    async def get_campaign_by_key(self, key: str) -> Optional[Campaign]:
        campaign = await self.collection.find_one({"key": key})
        if not campaign:
            return None
        
        campaign["id"] = str(campaign["_id"])
        return Campaign(**campaign)
    
    async def update_campaign(self, key: str, campaign_data: CampaignUpdate) -> Optional[Campaign]:
        update_dict = {k: v for k, v in campaign_data.dict(exclude_unset=True).items() if v is not None}
        
        if update_dict:
            update_dict["updated_at"] = datetime.utcnow()
            await self.collection.update_one(
                {"key": key},
                {"$set": update_dict}
            )
        
        return await self.get_campaign_by_key(key)
    
    async def delete_campaign(self, key: str) -> bool:
        # Don't allow deleting if it has data
        actions_count = await self.db.actions.count_documents({"campaign_key": key})
        if actions_count > 0:
            raise ValueError(f"Cannot delete campaign with {actions_count} actions. Delete actions first.")
        
        result = await self.collection.delete_one({"key": key})
        return result.deleted_count > 0
