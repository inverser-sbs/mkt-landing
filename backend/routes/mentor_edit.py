from fastapi import APIRouter, HTTPException, Depends, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from services.mentor_service import MentorService
from services.mentor_link_service import MentorLinkService
from services.magic_token_service import MagicTokenService
from services.action_service import ActionService
from models.mentor_link import MentorLinkCreate
from typing import Dict

router = APIRouter(prefix="/api/edit", tags=["mentor-edit"])

async def get_db():
    from server import db
    return db

@router.get("/{campaign_key}/{slug}")
async def get_mentor_edit_data(
    campaign_key: str,
    slug: str,
    token: str = Query(...),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Validate token and return mentor data for editing a specific campaign.
    """
    mentor_service = MentorService(db)
    link_service = MentorLinkService(db)
    token_service = MagicTokenService(db)
    action_service = ActionService(db)
    
    # Get mentor
    mentor = await mentor_service.get_mentor_by_slug(slug)
    if not mentor:
        raise HTTPException(status_code=404, detail="Mentor not found")
    
    # Get campaign
    campaign = await db.campaigns.find_one({"key": campaign_key, "active": True})
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found or inactive")
    
    # Validate token for this mentor+campaign
    is_valid = await token_service.validate_token(mentor.id, campaign_key, token)
    if not is_valid:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token. Please request a new edit link."
        )
    
    # Get mentor's links FOR THIS CAMPAIGN ONLY
    links = await link_service.get_mentor_links_dict(mentor.id, campaign_key)
    
    # Get active actions FOR THIS CAMPAIGN ONLY
    actions = await action_service.get_actions_by_campaign(campaign_key, active_only=True)
    
    # Build response
    actions_data = []
    for action in actions:
        actions_data.append({
            "action_key": action.action_key,
            "label": action.label,
            "description": action.description,
            "internal_note": action.internal_note,  # Add internal note for mentor visibility
            "current_url": links.get(action.action_key, "")
        })
    
    return {
        "mentor": {
            "first_name": mentor.first_name,
            "last_name": mentor.last_name,
            "slug": mentor.slug
        },
        "campaign": {
            "key": campaign["key"],
            "name": campaign["name"]
        },
        "actions": actions_data
    }

@router.put("/{campaign_key}/{slug}")
async def update_mentor_links(
    campaign_key: str,
    slug: str,
    links: Dict[str, str],
    token: str = Query(...),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Update mentor's links FOR A SPECIFIC CAMPAIGN.
    Only allows updating URLs for existing actions in that campaign.
    """
    mentor_service = MentorService(db)
    link_service = MentorLinkService(db)
    token_service = MagicTokenService(db)
    action_service = ActionService(db)
    
    # Get mentor
    mentor = await mentor_service.get_mentor_by_slug(slug)
    if not mentor:
        raise HTTPException(status_code=404, detail="Mentor not found")
    
    # Get campaign
    campaign = await db.campaigns.find_one({"key": campaign_key, "active": True})
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found or inactive")
    
    # Validate token for this mentor+campaign
    is_valid = await token_service.validate_token(mentor.id, campaign_key, token)
    if not is_valid:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )
    
    # Get valid actions for this campaign
    valid_actions = await action_service.get_actions_by_campaign(campaign_key, active_only=True)
    valid_action_keys = {a.action_key for a in valid_actions}
    
    # Update links (only for valid actions in this campaign)
    updated_count = 0
    for action_key, url in links.items():
        # Only process valid action keys for this campaign
        if action_key not in valid_action_keys:
            continue
            
        if url and url.strip():  # Only update if URL is provided
            link_data = MentorLinkCreate(
                mentor_id=mentor.id,
                campaign_key=campaign_key,
                action_key=action_key,
                url=url.strip()
            )
            await link_service.create_or_update_link(link_data)
            updated_count += 1
        else:
            # Delete link if URL is empty
            await link_service.delete_link(mentor.id, campaign_key, action_key)
    
    return {
        "success": True,
        "message": f"Updated {updated_count} links successfully",
        "campaign_key": campaign_key
    }


# Legacy support: redirect old /edit/{slug} to default campaign
@router.get("/{slug}")
async def legacy_get_mentor_edit(
    slug: str,
    token: str = Query(...),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Legacy endpoint - redirects to default campaign (cpn)
    """
    return await get_mentor_edit_data("cpn", slug, token, db)

@router.put("/{slug}")
async def legacy_update_mentor_links(
    slug: str,
    links: Dict[str, str],
    token: str = Query(...),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Legacy endpoint - updates links for default campaign (cpn)
    """
    return await update_mentor_links("cpn", slug, links, token, db)
