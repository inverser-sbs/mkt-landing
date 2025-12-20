from fastapi import APIRouter, HTTPException, Depends, Request, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from models.event import EventCreate, EventStats
from services.event_service import EventService
from typing import List, Optional

router = APIRouter(prefix="/api/track", tags=["tracking"])

async def get_db():
    from server import db
    return db

@router.post("/event")
async def track_event(
    event: EventCreate,
    request: Request,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    service = EventService(db)
    
    # Get IP from request
    ip = request.client.host if request.client else None
    
    tracked_event = await service.track_event(event, ip=ip)
    return {"success": True, "event_id": tracked_event.id}


# ============================================
# CAMPAIGN-AWARE ANALYTICS ENDPOINTS
# ============================================

@router.get("/stats/campaign/{campaign_key}")
async def get_campaign_stats(
    campaign_key: str,
    days: int = Query(30, ge=1, le=365),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Get aggregated stats (KPIs) for a specific campaign.
    Returns: total_visits, total_clicks, ctr, active_mentors
    """
    # Verify campaign exists
    campaign = await db.campaigns.find_one({"key": campaign_key})
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    service = EventService(db)
    stats = await service.get_campaign_stats(campaign_key, days)
    stats["campaign"] = {
        "key": campaign["key"],
        "name": campaign["name"]
    }
    return stats


@router.get("/stats/campaign/{campaign_key}/mentors")
async def get_mentor_stats_by_campaign(
    campaign_key: str,
    days: int = Query(30, ge=1, le=365),
    limit: int = Query(50, ge=1, le=200),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Get stats for all mentors in a specific campaign.
    Returns list of mentor performance data ordered by visits.
    """
    # Verify campaign exists
    campaign = await db.campaigns.find_one({"key": campaign_key})
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    service = EventService(db)
    return await service.get_mentor_stats_by_campaign(campaign_key, days, limit)


@router.get("/stats/campaign/{campaign_key}/actions")
async def get_action_stats_by_campaign(
    campaign_key: str,
    days: int = Query(30, ge=1, le=365),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Get click stats for each action in a specific campaign.
    Returns list of action performance data.
    """
    # Verify campaign exists
    campaign = await db.campaigns.find_one({"key": campaign_key})
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    service = EventService(db)
    return await service.get_action_stats_by_campaign(campaign_key, days)


# ============================================
# LEGACY ENDPOINTS (backward compatibility)
# ============================================

@router.get("/stats/mentor/{mentor_id}", response_model=EventStats)
async def get_mentor_stats(
    mentor_id: str,
    days: int = 30,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    service = EventService(db)
    try:
        return await service.get_mentor_stats(mentor_id, days)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/stats/all", response_model=List[EventStats])
async def get_all_stats(days: int = 30, db: AsyncIOMotorDatabase = Depends(get_db)):
    service = EventService(db)
    return await service.get_all_stats(days)

@router.get("/stats/countries")
async def get_top_countries(
    mentor_id: str = None,
    days: int = 30,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    service = EventService(db)
    return await service.get_top_countries(mentor_id, days)
