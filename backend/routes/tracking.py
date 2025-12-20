from fastapi import APIRouter, HTTPException, Depends, Request
from motor.motor_asyncio import AsyncIOMotorDatabase
from models.event import EventCreate, EventStats
from services.event_service import EventService
from typing import List

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