from motor.motor_asyncio import AsyncIOMotorDatabase
from models.action import Action, ActionCreate, ActionUpdate
from datetime import datetime
from typing import Optional, List

class ActionService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.collection = db.actions
    
    def _apply_fallbacks(self, action: dict) -> dict:
        """Apply fallback values for backward compatibility"""
        action["id"] = str(action["_id"])
        if "display_slots" not in action or not action["display_slots"]:
            action["display_slots"] = ["cta"]
        if "button_key" not in action or not action["button_key"]:
            action["button_key"] = action.get("action_key")
        if "status" not in action:
            action["status"] = "active" if action.get("active", True) else "inactive"
        return action
    
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
        
        action = self._apply_fallbacks(action)
        return Action(**action)
    
    async def get_action_by_key(self, campaign_key: str, action_key: str) -> Optional[Action]:
        action = await self.collection.find_one({
            "campaign_key": campaign_key,
            "action_key": action_key
        })
        if not action:
            return None
        
        action = self._apply_fallbacks(action)
        return Action(**action)
    
    async def get_actions_by_campaign(
        self, 
        campaign_key: str, 
        active_only: bool = False,
        include_retired: bool = False
    ) -> List[Action]:
        """Get all actions for a specific campaign"""
        query = {"campaign_key": campaign_key}
        
        if active_only:
            query["active"] = True
            query["status"] = {"$ne": "retired"}
        elif not include_retired:
            # By default, exclude retired actions
            query["status"] = {"$ne": "retired"}
        
        actions = []
        async for action in self.collection.find(query).sort("order", 1):
            action = self._apply_fallbacks(action)
            actions.append(Action(**action))
        
        return actions
    
    async def get_all_actions(self, active_only: bool = False, include_retired: bool = False) -> List[Action]:
        """Get all actions across all campaigns"""
        query = {}
        
        if active_only:
            query["active"] = True
            query["status"] = {"$ne": "retired"}
        elif not include_retired:
            query["status"] = {"$ne": "retired"}
        
        actions = []
        async for action in self.collection.find(query).sort([("campaign_key", 1), ("order", 1)]):
            action = self._apply_fallbacks(action)
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
    
    async def retire_action(self, action_id: str) -> Optional[Action]:
        """Retire an action (soft delete that keeps data for audit)"""
        from bson import ObjectId
        
        await self.collection.update_one(
            {"_id": ObjectId(action_id)},
            {"$set": {
                "status": "retired",
                "active": False,
                "updated_at": datetime.utcnow()
            }}
        )
        
        return await self.get_action_by_id(action_id)
    
    async def replace_action(
        self, 
        campaign_key: str,
        old_action_key: str, 
        new_action_key: str,
        migrate_links: bool = True,
        migrate_events: bool = False
    ) -> dict:
        """
        Replace an old action with a new one.
        Optionally migrate mentor_links from old to new.
        """
        # Verify both actions exist
        old_action = await self.get_action_by_key(campaign_key, old_action_key)
        new_action = await self.get_action_by_key(campaign_key, new_action_key)
        
        if not old_action:
            raise ValueError(f"Old action '{old_action_key}' not found")
        if not new_action:
            raise ValueError(f"New action '{new_action_key}' not found")
        
        result = {
            "old_action": old_action_key,
            "new_action": new_action_key,
            "links_migrated": 0,
            "events_migrated": 0
        }
        
        # Migrate mentor_links
        if migrate_links:
            update_result = await self.db.mentor_links.update_many(
                {"campaign_key": campaign_key, "action_key": old_action_key},
                {"$set": {"action_key": new_action_key, "updated_at": datetime.utcnow()}}
            )
            result["links_migrated"] = update_result.modified_count
        
        # Migrate events (optional)
        if migrate_events:
            update_result = await self.db.mentor_events.update_many(
                {"campaign_key": campaign_key, "action_key": old_action_key},
                {"$set": {"action_key": new_action_key}}
            )
            result["events_migrated"] = update_result.modified_count
        
        return result
    
    async def get_action_link_count(self, action_id: str, valid_only: bool = True) -> int:
        """
        Get the number of mentor_links using this action.
        
        Args:
            action_id: The action ID
            valid_only: If True, only count links where:
                - mentor exists
                - url is not empty
        """
        action = await self.get_action_by_id(action_id)
        if not action:
            return 0
        
        if valid_only:
            # Get all existing mentor IDs
            mentor_ids = set()
            async for mentor in self.db.mentors.find({}, {"id": 1}):
                mentor_ids.add(mentor.get("id"))
            
            # Count only valid links
            count = 0
            async for link in self.db.mentor_links.find({
                "campaign_key": action.campaign_key,
                "action_key": action.action_key
            }):
                # Check if mentor exists and URL is not empty
                if link.get("mentor_id") in mentor_ids:
                    url = link.get("url", "").strip()
                    if url:
                        count += 1
            return count
        else:
            # Raw count (includes orphans and empty URLs)
            return await self.db.mentor_links.count_documents({
                "campaign_key": action.campaign_key,
                "action_key": action.action_key
            })
    
    async def get_valid_links_for_action(self, action_id: str) -> dict:
        """
        Get detailed info about links for an action.
        Returns counts of valid, orphan, and empty URL links.
        """
        action = await self.get_action_by_id(action_id)
        if not action:
            return {"valid": 0, "orphan": 0, "empty_url": 0, "total": 0}
        
        # Get all existing mentor IDs
        mentor_ids = set()
        async for mentor in self.db.mentors.find({}, {"id": 1}):
            mentor_ids.add(mentor.get("id"))
        
        valid = 0
        orphan = 0
        empty_url = 0
        
        async for link in self.db.mentor_links.find({
            "campaign_key": action.campaign_key,
            "action_key": action.action_key
        }):
            mentor_id = link.get("mentor_id")
            url = link.get("url", "").strip()
            
            if mentor_id not in mentor_ids:
                orphan += 1
            elif not url:
                empty_url += 1
            else:
                valid += 1
        
        return {
            "valid": valid,
            "orphan": orphan, 
            "empty_url": empty_url,
            "total": valid + orphan + empty_url
        }
    
    async def cleanup_orphan_data(self) -> dict:
        """
        Clean up orphan data across the system.
        Removes:
        - mentor_links with non-existent mentor_id
        - mentor_links with empty URLs
        - magic_tokens with non-existent mentor_id
        
        Returns counts of deleted items.
        """
        # Get all existing mentor IDs
        mentor_ids = set()
        async for mentor in self.db.mentors.find({}, {"id": 1}):
            mentor_ids.add(mentor.get("id"))
        
        result = {
            "orphan_links_deleted": 0,
            "empty_url_links_deleted": 0,
            "orphan_tokens_deleted": 0
        }
        
        # Find and delete orphan mentor_links
        async for link in self.db.mentor_links.find({}):
            should_delete = False
            
            # Check if mentor exists
            if link.get("mentor_id") not in mentor_ids:
                should_delete = True
                result["orphan_links_deleted"] += 1
            # Check if URL is empty
            elif not link.get("url", "").strip():
                should_delete = True
                result["empty_url_links_deleted"] += 1
            
            if should_delete:
                await self.db.mentor_links.delete_one({"_id": link["_id"]})
        
        # Find and delete orphan magic_tokens
        async for token in self.db.magic_tokens.find({}):
            if token.get("mentor_id") not in mentor_ids:
                await self.db.magic_tokens.delete_one({"_id": token["_id"]})
                result["orphan_tokens_deleted"] += 1
        
        return result
    
    async def delete_action(self, action_id: str, force: bool = False) -> bool:
        """
        Delete an action.
        
        Rules:
        - If force=False: Only delete if no VALID mentor_links exist
          (valid = mentor exists AND url is not empty)
        - If force=True: Delete action AND all associated mentor_links
        
        Orphan links and empty URL links are automatically cleaned up.
        """
        from bson import ObjectId
        
        action = await self.get_action_by_id(action_id)
        if not action:
            return False
        
        # Get detailed link info
        link_info = await self.get_valid_links_for_action(action_id)
        
        # Auto-cleanup orphan and empty URL links first
        cleanup_count = 0
        if link_info["orphan"] > 0 or link_info["empty_url"] > 0:
            # Get existing mentor IDs
            mentor_ids = set()
            async for mentor in self.db.mentors.find({}, {"id": 1}):
                mentor_ids.add(mentor.get("id"))
            
            # Delete orphan and empty URL links for this action
            async for link in self.db.mentor_links.find({
                "campaign_key": action.campaign_key,
                "action_key": action.action_key
            }):
                should_delete = False
                if link.get("mentor_id") not in mentor_ids:
                    should_delete = True
                elif not link.get("url", "").strip():
                    should_delete = True
                
                if should_delete:
                    await self.db.mentor_links.delete_one({"_id": link["_id"]})
                    cleanup_count += 1
        
        # Check if valid links remain
        valid_count = link_info["valid"]
        
        if valid_count > 0:
            if force:
                # Force delete: remove all remaining links
                await self.db.mentor_links.delete_many({
                    "campaign_key": action.campaign_key,
                    "action_key": action.action_key
                })
            else:
                raise ValueError(
                    f"No se puede eliminar: {valid_count} mentor(es) tienen URLs activas para esta acción. "
                    f"Usa 'Eliminar forzado' para eliminar de todas formas, o 'Archivar' para conservar los datos."
                )
        
        # Delete the action
        result = await self.collection.delete_one({"_id": ObjectId(action_id)})
        return result.deleted_count > 0
