from fastapi import APIRouter, HTTPException, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from models.mentor import Mentor, MentorCreate, MentorUpdate
from services.mentor_service import MentorService
from services.mentor_link_service import MentorLinkService
from services.action_service import ActionService
from typing import List, Optional

router = APIRouter(prefix="/api/public", tags=["public"])

async def get_db():
    from server import db
    return db

@router.get("/mentor/{campaign}/{slug}")
async def get_mentor_by_slug(campaign: str, slug: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    """
    Get mentor public data by campaign and slug.
    Returns mentor info + available actions with URLs for that campaign.
    """
    mentor_service = MentorService(db)
    link_service = MentorLinkService(db)
    action_service = ActionService(db)
    
    # Verify campaign exists
    campaign_doc = await db.campaigns.find_one({"key": campaign, "active": True})
    if not campaign_doc:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    # Get mentor
    mentor = await mentor_service.get_mentor_by_slug(slug)
    if not mentor:
        raise HTTPException(status_code=404, detail="Mentor not found")
    
    # Get mentor's links for this campaign
    links = {}
    async for link in db.mentor_links.find({"mentor_id": mentor.id, "campaign_key": campaign}):
        links[link["action_key"]] = link["url"]
    
    # Get active actions for this campaign
    actions = []
    async for action in db.actions.find({"campaign_key": campaign, "active": True}).sort("order", 1):
        actions.append(action)
    
    # Build response with only actions that have links
    available_actions = []
    for action in actions:
        if action["action_key"] in links:
            available_actions.append({
                "action_key": action["action_key"],
                "label": action["label"],
                "url": links[action["action_key"]],
                "order": action["order"]
            })
    
    # Sort by order
    available_actions.sort(key=lambda x: x["order"])
    
    return {
        "campaign": {
            "key": campaign,
            "name": campaign_doc["name"]
        },
        "mentor": {
            "first_name": mentor.first_name,
            "last_name": mentor.last_name,
            "photo_url": mentor.photo_url,
            "slug": mentor.slug
        },
        "actions": available_actions
    }