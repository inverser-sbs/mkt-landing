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

# =====================================================
# STATIC ROUTES FIRST (must come before dynamic routes)
# =====================================================

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

@router.post("/cleanup-orphans")
async def cleanup_orphan_data(db: AsyncIOMotorDatabase = Depends(get_db)):
    """
    Admin maintenance tool: Clean up orphan data.
    Removes:
    - mentor_links with non-existent mentor_id
    - mentor_links with empty URLs  
    - magic_tokens with non-existent mentor_id
    
    This prevents stale data from blocking action deletion.
    """
    service = ActionService(db)
    result = await service.cleanup_orphan_data()
    return {
        "message": "Limpieza completada",
        "deleted": result
    }

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

# =====================================================
# ROUTES WITH SINGLE DYNAMIC PARAM + STATIC SUFFIX
# =====================================================

@router.get("/{action_id}/link-count")
async def get_action_link_count(action_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    """
    Get detailed link count for this action.
    Returns:
    - valid: links with existing mentor and non-empty URL
    - orphan: links with non-existent mentor_id
    - empty_url: links with empty URL
    - total: total raw count
    """
    service = ActionService(db)
    link_info = await service.get_valid_links_for_action(action_id)
    return link_info

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

# =====================================================
# ROUTES WITH SINGLE DYNAMIC PARAM (no suffix)
# =====================================================

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
async def delete_action(
    action_id: str, 
    force: bool = Query(False, description="Force delete even if valid mentor_links exist"),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Delete an action by its ID.
    
    Rules:
    - Orphan links (mentor deleted) and empty URL links are auto-cleaned
    - If force=false (default): fails if VALID mentor_links exist (mentor exists + URL not empty)
    - If force=true: deletes action AND all associated mentor_links
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

# =====================================================
# ROUTES WITH TWO DYNAMIC PARAMS (must be last!)
# =====================================================

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
