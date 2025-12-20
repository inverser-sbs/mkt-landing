from motor.motor_asyncio import AsyncIOMotorDatabase
from models.action import Action, ActionCreate, ActionUpdate
from datetime import datetime
from typing import Optional, List

class ActionService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.collection = db.actions
    
    async def create_action(self, action_data: ActionCreate) -> Action:
        # Check if action_key already exists FOR THIS CAMPAIGN
        existing = await self.collection.find_one({
            "campaign_key": action_data.campaign_key,
            "action_key": action_data.action_key
        })
        if existing:
            raise ValueError(f"Action key '{action_data.action_key}' already exists for campaign '{action_data.campaign_key}'")
        
        # Verify campaign exists
        campaign = await self.db.campaigns.find_one({"key": action_data.campaign_key})
        if not campaign:
            raise ValueError(f"Campaign '{action_data.campaign_key}' does not exist")
        
        action_dict = action_data.dict()
        action_dict["created_at"] = datetime.utcnow()
        action_dict["updated_at"] = datetime.utcnow()
        
        result = await self.collection.insert_one(action_dict)
        action_dict["id"] = str(result.inserted_id)
        action_dict["_id"] = result.inserted_id
        
        return Action(**action_dict)
    
    async def get_action_by_id(self, action_id: str) -> Optional[Action]:
        from bson import ObjectId
        action = await self.collection.find_one({"_id": ObjectId(action_id)})
        if not action:
            return None
        
        action["id"] = str(action["_id"])
        # Fallback for actions without display_slots
        if "display_slots" not in action or not action["display_slots"]:
            action["display_slots"] = ["cta"]
        # Fallback for actions without button_key (use action_key as button_key)
        if "button_key" not in action or not action["button_key"]:
            action["button_key"] = action.get("action_key")
        return Action(**action)
    
    async def get_action_by_key(self, campaign_key: str, action_key: str) -> Optional[Action]:
        action = await self.collection.find_one({
            "campaign_key": campaign_key,
            "action_key": action_key
        })
        if not action:
            return None
        
        action["id"] = str(action["_id"])
        # Fallback for actions without display_slots
        if "display_slots" not in action or not action["display_slots"]:
            action["display_slots"] = ["cta"]
        # Fallback for actions without button_key
        if "button_key" not in action or not action["button_key"]:
            action["button_key"] = action.get("action_key")
        return Action(**action)
    
    async def get_actions_by_campaign(self, campaign_key: str, active_only: bool = False) -> List[Action]:
        """Get all actions for a specific campaign"""
        query = {"campaign_key": campaign_key}
        if active_only:
            query["active"] = True
        
        actions = []
        async for action in self.collection.find(query).sort("order", 1):
            action["id"] = str(action["_id"])
            # Fallback for actions without display_slots
            if "display_slots" not in action or not action["display_slots"]:
                action["display_slots"] = ["cta"]
            # Fallback for actions without button_key
            if "button_key" not in action or not action["button_key"]:
                action["button_key"] = action.get("action_key")
            actions.append(Action(**action))
        
        return actions
    
    async def get_all_actions(self, active_only: bool = False) -> List[Action]:
        """Get all actions across all campaigns"""
        query = {}
        if active_only:
            query["active"] = True
        
        actions = []
        async for action in self.collection.find(query).sort([("campaign_key", 1), ("order", 1)]):
            action["id"] = str(action["_id"])
            # Fallback for actions without display_slots
            if "display_slots" not in action or not action["display_slots"]:
                action["display_slots"] = ["cta"]
            # Fallback for actions without button_key
            if "button_key" not in action or not action["button_key"]:
                action["button_key"] = action.get("action_key")
            actions.append(Action(**action))
        
        return actions
    
    async def update_action(self, action_id: str, action_data: ActionUpdate) -> Optional[Action]:
        from bson import ObjectId
        
        update_dict = {k: v for k, v in action_data.dict(exclude_unset=True).items() if v is not None}
        
        if update_dict:
            update_dict["updated_at"] = datetime.utcnow()
            await self.collection.update_one(
                {"_id": ObjectId(action_id)},
                {"$set": update_dict}
            )
        
        return await self.get_action_by_id(action_id)
    
    async def delete_action(self, action_id: str) -> bool:
        from bson import ObjectId
        
        # Check if any mentor has links using this action
        action = await self.get_action_by_id(action_id)
        if action:
            links_count = await self.db.mentor_links.count_documents({
                "campaign_key": action.campaign_key,
                "action_key": action.action_key
            })
            if links_count > 0:
                raise ValueError(f"Cannot delete action: {links_count} mentor(s) have links using this action")
        
        result = await self.collection.delete_one({"_id": ObjectId(action_id)})
        return result.deleted_count > 0
