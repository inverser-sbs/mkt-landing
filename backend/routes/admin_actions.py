from fastapi import APIRouter, HTTPException, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from models.action import Action, ActionCreate, ActionUpdate
from services.action_service import ActionService
from typing import List

router = APIRouter(prefix="/api/admin/actions", tags=["admin-actions"])

async def get_db():
    from server import db
    return db

@router.post("", response_model=Action)
async def create_action(action: ActionCreate, db: AsyncIOMotorDatabase = Depends(get_db)):
    service = ActionService(db)
    try:
        return await service.create_action(action)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("", response_model=List[Action])
async def get_all_actions(active_only: bool = False, db: AsyncIOMotorDatabase = Depends(get_db)):
    service = ActionService(db)
    return await service.get_all_actions(active_only=active_only)

@router.get("/{action_key}", response_model=Action)
async def get_action(action_key: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    service = ActionService(db)
    action = await service.get_action_by_key(action_key)
    if not action:
        raise HTTPException(status_code=404, detail="Action not found")
    return action

@router.put("/{action_key}", response_model=Action)
async def update_action(
    action_key: str,
    action: ActionUpdate,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    service = ActionService(db)
    updated = await service.update_action(action_key, action)
    if not updated:
        raise HTTPException(status_code=404, detail="Action not found")
    return updated

@router.delete("/{action_key}")
async def delete_action(action_key: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    service = ActionService(db)
    success = await service.delete_action(action_key)
    if not success:
        raise HTTPException(status_code=404, detail="Action not found")
    return {"message": "Action deleted successfully"}