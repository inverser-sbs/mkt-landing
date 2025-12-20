from fastapi import APIRouter, HTTPException, Depends, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from models.action import Action, ActionCreate, ActionUpdate
from services.action_service import ActionService
from typing import List, Optional
from pydantic import BaseModel

router = APIRouter(prefix="/api/admin/actions", tags=["admin-actions"])

async def get_db():
    from server import db
    return db

class ReplaceActionRequest(BaseModel):
    campaign_key: str
    old_action_key: str
    new_action_key: str
    migrate_links: bool = True
    migrate_events: bool = False

@router.post("", response_model=Action)
async def create_action(action: ActionCreate, db: AsyncIOMotorDatabase = Depends(get_db)):
    """Create a new action for a campaign"""
    service = ActionService(db)
    try:
        return await service.create_action(action)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("", response_model=List[Action])
async def get_actions(
    campaign_key: Optional[str] = Query(None, description="Filter by campaign key"),
    active_only: bool = Query(False, description="Only return active actions"),
    include_retired: bool = Query(False, description="Include retired actions"),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get actions, optionally filtered by campaign"""
    service = ActionService(db)
    
    if campaign_key:
        return await service.get_actions_by_campaign(
            campaign_key, 
            active_only=active_only,
            include_retired=include_retired
        )
    else:
        return await service.get_all_actions(
            active_only=active_only,
            include_retired=include_retired
        )

@router.get("/{campaign_key}/{action_key}", response_model=Action)
async def get_action(
    campaign_key: str,
    action_key: str,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get a specific action by campaign and action key"""
    service = ActionService(db)
    action = await service.get_action_by_key(campaign_key, action_key)
    if not action:
        raise HTTPException(status_code=404, detail="Action not found")
    return action

@router.get("/{action_id}/link-count")
async def get_action_link_count(action_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    """Get the number of mentor links using this action"""
    service = ActionService(db)
    count = await service.get_action_link_count(action_id)
    return {"count": count}

@router.put("/{action_id}", response_model=Action)
async def update_action(
    action_id: str,
    action: ActionUpdate,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update an action by its ID"""
    service = ActionService(db)
    updated = await service.update_action(action_id, action)
    if not updated:
        raise HTTPException(status_code=404, detail="Action not found")
    return updated

@router.post("/{action_id}/retire", response_model=Action)
async def retire_action(action_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    """
    Retire an action (soft delete).
    - Sets status to 'retired'
    - Action won't appear in normal lists
    - Won't render on landing pages
    - Preserves mentor_links for audit/history
    """
    service = ActionService(db)
    retired = await service.retire_action(action_id)
    if not retired:
        raise HTTPException(status_code=404, detail="Action not found")
    return retired

@router.post("/replace")
async def replace_action(request: ReplaceActionRequest, db: AsyncIOMotorDatabase = Depends(get_db)):
    """
    Replace an old action with a new one.
    - Migrates mentor_links from old action to new action
    - Optionally migrates events
    - After migration, you can retire the old action
    """
    service = ActionService(db)
    try:
        result = await service.replace_action(
            campaign_key=request.campaign_key,
            old_action_key=request.old_action_key,
            new_action_key=request.new_action_key,
            migrate_links=request.migrate_links,
            migrate_events=request.migrate_events
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{action_id}")
async def delete_action(
    action_id: str, 
    force: bool = Query(False, description="Force delete even if mentor_links exist"),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Delete an action by its ID.
    - If force=false (default): fails if mentor_links exist
    - If force=true: deletes all associated mentor_links first
    - For soft delete, use POST /{action_id}/retire instead
    """
    service = ActionService(db)
    try:
        success = await service.delete_action(action_id, force=force)
        if not success:
            raise HTTPException(status_code=404, detail="Action not found")
        return {"message": "Action deleted successfully"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
