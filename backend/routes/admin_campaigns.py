from fastapi import APIRouter, HTTPException, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from models.campaign import Campaign, CampaignCreate, CampaignUpdate
from services.campaign_service import CampaignService
from typing import List

router = APIRouter(prefix="/api/admin/campaigns", tags=["admin-campaigns"])

async def get_db():
    from server import db
    return db

@router.post("", response_model=Campaign)
async def create_campaign(campaign: CampaignCreate, db: AsyncIOMotorDatabase = Depends(get_db)):
    service = CampaignService(db)
    try:
        return await service.create_campaign(campaign)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("", response_model=List[Campaign])
async def get_all_campaigns(active_only: bool = False, db: AsyncIOMotorDatabase = Depends(get_db)):
    service = CampaignService(db)
    return await service.get_all_campaigns(active_only=active_only)

@router.get("/{key}", response_model=Campaign)
async def get_campaign(key: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    service = CampaignService(db)
    campaign = await service.get_campaign_by_key(key)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return campaign

@router.put("/{key}", response_model=Campaign)
async def update_campaign(
    key: str,
    campaign: CampaignUpdate,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    service = CampaignService(db)
    updated = await service.update_campaign(key, campaign)
    if not updated:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return updated

@router.delete("/{key}")
async def delete_campaign(key: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    service = CampaignService(db)
    try:
        success = await service.delete_campaign(key)
        if not success:
            raise HTTPException(status_code=404, detail="Campaign not found")
        return {"message": "Campaign deleted successfully"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
