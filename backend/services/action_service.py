from motor.motor_asyncio import AsyncIOMotorDatabase
from models.action import Action, ActionCreate, ActionUpdate
from datetime import datetime
from typing import Optional, List

class ActionService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.collection = db.actions
    
    async def create_action(self, action_data: ActionCreate) -> Action:
        # Check if action_key already exists
        existing = await self.collection.find_one({"action_key": action_data.action_key})
        if existing:
            raise ValueError(f"Action key '{action_data.action_key}' already exists")
        
        action_dict = action_data.dict()
        action_dict["created_at"] = datetime.utcnow()
        action_dict["updated_at"] = datetime.utcnow()
        
        result = await self.collection.insert_one(action_dict)
        action_dict["id"] = str(result.inserted_id)
        action_dict["_id"] = result.inserted_id
        
        return Action(**action_dict)
    
    async def get_action_by_key(self, action_key: str) -> Optional[Action]:
        action = await self.collection.find_one({"action_key": action_key})
        if not action:
            return None
        
        action["id"] = str(action["_id"])
        return Action(**action)
    
    async def get_all_actions(self, active_only: bool = False) -> List[Action]:
        query = {}
        if active_only:
            query["active"] = True
        
        actions = []
        async for action in self.collection.find(query).sort("order", 1):
            action["id"] = str(action["_id"])
            actions.append(Action(**action))
        
        return actions
    
    async def update_action(self, action_key: str, action_data: ActionUpdate) -> Optional[Action]:
        update_dict = {k: v for k, v in action_data.dict(exclude_unset=True).items() if v is not None}
        
        if update_dict:
            update_dict["updated_at"] = datetime.utcnow()
            await self.collection.update_one(
                {"action_key": action_key},
                {"$set": update_dict}
            )
        
        return await self.get_action_by_key(action_key)
    
    async def delete_action(self, action_key: str) -> bool:
        result = await self.collection.delete_one({"action_key": action_key})
        return result.deleted_count > 0