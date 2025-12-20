from fastapi import APIRouter, HTTPException, Depends, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from services.mentor_service import MentorService
from services.mentor_link_service import MentorLinkService
from services.magic_token_service import MagicTokenService
from models.mentor_link import MentorLinkCreate
from typing import Dict

router = APIRouter(prefix="/api/edit", tags=["mentor-edit"])

async def get_db():
    from server import db
    return db

@router.get("/{slug}")
async def get_mentor_edit_data(
    slug: str,
    token: str = Query(...),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Validate token and return mentor data for editing.
    """
    mentor_service = MentorService(db)
    link_service = MentorLinkService(db)
    token_service = MagicTokenService(db)
    
    # Get mentor
    mentor = await mentor_service.get_mentor_by_slug(slug)
    if not mentor:
        raise HTTPException(status_code=404, detail="Mentor not found")
    
    # Validate token
    is_valid = await token_service.validate_token(mentor.id, token)
    if not is_valid:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token. Please request a new edit link."
        )
    
    # Get mentor's links
    links = await link_service.get_mentor_links_dict(mentor.id)
    
    # Get all active actions
    from services.action_service import ActionService
    action_service = ActionService(db)
    actions = await action_service.get_all_actions(active_only=True)
    
    # Build response
    actions_data = []
    for action in actions:
        actions_data.append({
            "action_key": action.action_key,
            "label": action.label,
            "description": action.description,
            "current_url": links.get(action.action_key, "")
        })
    
    return {
        "mentor": {
            "first_name": mentor.first_name,
            "last_name": mentor.last_name,
            "slug": mentor.slug
        },
        "actions": actions_data
    }

@router.put("/{slug}")
async def update_mentor_links(
    slug: str,
    links: Dict[str, str],
    token: str = Query(...),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Update mentor's links.
    Only allows updating URLs for existing actions.
    """
    mentor_service = MentorService(db)
    link_service = MentorLinkService(db)
    token_service = MagicTokenService(db)
    
    # Get mentor
    mentor = await mentor_service.get_mentor_by_slug(slug)
    if not mentor:
        raise HTTPException(status_code=404, detail="Mentor not found")
    
    # Validate token
    is_valid = await token_service.validate_token(mentor.id, token)
    if not is_valid:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )
    
    # Update links
    updated_count = 0
    for action_key, url in links.items():
        if url and url.strip():  # Only update if URL is provided
            link_data = MentorLinkCreate(
                mentor_id=mentor.id,
                action_key=action_key,
                url=url.strip()
            )
            await link_service.create_or_update_link(link_data)
            updated_count += 1
        else:
            # Delete link if URL is empty
            await link_service.delete_link(mentor.id, action_key)
    
    return {
        "success": True,
        "message": f"Updated {updated_count} links successfully"
    }