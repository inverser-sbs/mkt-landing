from fastapi import APIRouter, HTTPException, Depends, Request, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from models.event import EventCreate, EventStats
from services.event_service import EventService
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime, timezone

router = APIRouter(prefix="/api/track", tags=["tracking"])

async def get_db():
    from server import db
    return db

class VideoWidgetTrack(BaseModel):
    mentor_id: Optional[str] = None
    campaign_key: Optional[str] = None
    action: str  # 'expand' | 'collapse' | 'play'
    video_url: Optional[str] = None
    timestamp: Optional[str] = None

@router.post("/video-widget")
async def track_video_widget(
    data: VideoWidgetTrack,
    request: Request,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Track video widget interactions (expand, collapse, play)"""
    try:
        ip = request.client.host if request.client else None
        
        await db.video_widget_events.insert_one({
            "mentor_id": data.mentor_id,
            "campaign_key": data.campaign_key,
            "action": data.action,
            "video_url": data.video_url,
            "ip": ip,
            "timestamp": datetime.now(timezone.utc),
            "user_agent": request.headers.get("user-agent", "")
        })
        
        return {"success": True}
    except Exception as e:
        print(f"Error tracking video widget: {e}")
        return {"success": False}

@router.get("/video-widget/stats/{campaign_key}")
async def get_video_widget_stats(
    campaign_key: str,
    days: int = Query(30, ge=1, le=365),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get video widget stats for a campaign"""
    from datetime import timedelta
    
    start_date = datetime.now(timezone.utc) - timedelta(days=days)
    
    pipeline = [
        {
            "$match": {
                "campaign_key": campaign_key,
                "timestamp": {"$gte": start_date}
            }
        },
        {
            "$group": {
                "_id": {
                    "mentor_id": "$mentor_id",
                    "action": "$action"
                },
                "count": {"$sum": 1}
            }
        }
    ]
    
    results = await db.video_widget_events.aggregate(pipeline).to_list(None)
    
    # Organize by mentor
    mentor_stats = {}
    for r in results:
        mentor_id = r["_id"]["mentor_id"]
        action = r["_id"]["action"]
        count = r["count"]
        
        if mentor_id not in mentor_stats:
            mentor_stats[mentor_id] = {"expand": 0, "collapse": 0, "play": 0}
        
        mentor_stats[mentor_id][action] = count
    
    return {
        "campaign_key": campaign_key,
        "days": days,
        "mentor_stats": mentor_stats,
        "total_expands": sum(s.get("expand", 0) for s in mentor_stats.values()),
        "total_plays": sum(s.get("play", 0) for s in mentor_stats.values())
    }

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
