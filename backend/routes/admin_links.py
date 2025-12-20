from fastapi import APIRouter, HTTPException, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from models.mentor_link import MentorLink, MentorLinkCreate, MentorLinkBulkUpdate
from services.mentor_link_service import MentorLinkService
from typing import List

router = APIRouter(prefix="/api/admin/links", tags=["admin-links"])

async def get_db():
    from server import db
    return db

@router.post("", response_model=MentorLink)
async def create_or_update_link(link: MentorLinkCreate, db: AsyncIOMotorDatabase = Depends(get_db)):
    service = MentorLinkService(db)
    return await service.create_or_update_link(link)

@router.get("/mentor/{mentor_id}", response_model=List[MentorLink])
async def get_mentor_links(mentor_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    service = MentorLinkService(db)
    return await service.get_mentor_links(mentor_id)

@router.delete("/mentor/{mentor_id}/action/{action_key}")
async def delete_link(
    mentor_id: str,
    action_key: str,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    service = MentorLinkService(db)
    success = await service.delete_link(mentor_id, action_key)
    if not success:
        raise HTTPException(status_code=404, detail="Link not found")
    return {"message": "Link deleted successfully"}

@router.post("/bulk-update")
async def bulk_update_links(
    bulk_data: MentorLinkBulkUpdate,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    service = MentorLinkService(db)
    try:
        result = await service.bulk_update_links(bulk_data)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))