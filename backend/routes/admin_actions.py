from fastapi import APIRouter, HTTPException, Depends, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from models.action import Action, ActionCreate, ActionUpdate
from services.action_service import ActionService
from typing import List, Optional

router = APIRouter(prefix="/api/admin/actions", tags=["admin-actions"])

async def get_db():
    from server import db
    return db

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
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get actions, optionally filtered by campaign"""
    service = ActionService(db)
    
    if campaign_key:
        return await service.get_actions_by_campaign(campaign_key, active_only=active_only)
    else:
        return await service.get_all_actions(active_only=active_only)

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

@router.delete("/{action_id}")
async def delete_action(action_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    """Delete an action by its ID"""
    service = ActionService(db)
    try:
        success = await service.delete_action(action_id)
        if not success:
            raise HTTPException(status_code=404, detail="Action not found")
        return {"message": "Action deleted successfully"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
