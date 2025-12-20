from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from models.mentor import Mentor, MentorCreate, MentorUpdate
from models.mentor_link import MentorLinkCreate
from services.mentor_service import MentorService
from services.mentor_link_service import MentorLinkService
from services.magic_token_service import MagicTokenService
from services.action_service import ActionService
from typing import List, Optional, Dict
import os
import shutil
from pathlib import Path
import uuid

router = APIRouter(prefix="/api/admin/mentors", tags=["admin-mentors"])

UPLOAD_DIR = Path("/app/backend/uploads/mentors")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

async def get_db():
    from server import db
    return db

@router.post("", response_model=Mentor)
async def create_mentor(mentor: MentorCreate, db: AsyncIOMotorDatabase = Depends(get_db)):
    service = MentorService(db)
    try:
        return await service.create_mentor(mentor)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("", response_model=List[Mentor])
async def get_all_mentors(
    active_only: bool = Query(False),
    group: Optional[str] = Query(None),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    service = MentorService(db)
    return await service.get_all_mentors(active_only=active_only, group=group)

@router.get("/{mentor_id}", response_model=Mentor)
async def get_mentor(mentor_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    service = MentorService(db)
    mentor = await service.get_mentor_by_id(mentor_id)
    if not mentor:
        raise HTTPException(status_code=404, detail="Mentor not found")
    return mentor

@router.put("/{mentor_id}", response_model=Mentor)
async def update_mentor(
    mentor_id: str,
    mentor: MentorUpdate,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    service = MentorService(db)
    try:
        updated = await service.update_mentor(mentor_id, mentor)
        if not updated:
            raise HTTPException(status_code=404, detail="Mentor not found")
        return updated
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{mentor_id}")
async def delete_mentor(mentor_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    service = MentorService(db)
    success = await service.delete_mentor(mentor_id)
    if not success:
        raise HTTPException(status_code=404, detail="Mentor not found")
    return {"message": "Mentor deleted successfully"}

@router.post("/{mentor_id}/photo")
async def upload_photo(
    mentor_id: str,
    file: UploadFile = File(...),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    # Validate file type
    allowed_types = ["image/jpeg", "image/png", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    # Generate unique filename
    ext = file.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    file_path = UPLOAD_DIR / filename
    
    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Update mentor (use /api prefix for Kubernetes ingress routing)
    photo_url = f"/api/uploads/mentors/{filename}"
    service = MentorService(db)
    mentor = await service.update_mentor(mentor_id, MentorUpdate(photo_url=photo_url))
    
    if not mentor:
        # Clean up uploaded file
        file_path.unlink()
        raise HTTPException(status_code=404, detail="Mentor not found")
    
    return {"photo_url": photo_url}


# ============================================
# LINKS BY CAMPAIGN
# ============================================

@router.get("/{mentor_id}/links/{campaign_key}")
async def get_mentor_links_for_campaign(
    mentor_id: str,
    campaign_key: str,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get all links for a mentor in a specific campaign"""
    link_service = MentorLinkService(db)
    action_service = ActionService(db)
    
    # Get links for this mentor+campaign
    links = await link_service.get_mentor_links_dict(mentor_id, campaign_key)
    
    # Get all actions for this campaign
    actions = await action_service.get_actions_by_campaign(campaign_key, active_only=False)
    
    # Build response with all actions (filled or empty)
    result = []
    for action in actions:
        result.append({
            "action_key": action.action_key,
            "label": action.label,
            "url": links.get(action.action_key, ""),
            "active": action.active
        })
    
    return result

@router.put("/{mentor_id}/links/{campaign_key}")
async def update_mentor_links_for_campaign(
    mentor_id: str,
    campaign_key: str,
    links: Dict[str, str],
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update mentor links for a specific campaign"""
    link_service = MentorLinkService(db)
    action_service = ActionService(db)
    
    # Verify mentor exists
    mentor_service = MentorService(db)
    mentor = await mentor_service.get_mentor_by_id(mentor_id)
    if not mentor:
        raise HTTPException(status_code=404, detail="Mentor not found")
    
    # Verify campaign exists
    campaign = await db.campaigns.find_one({"key": campaign_key})
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    # Get valid actions for this campaign
    valid_actions = await action_service.get_actions_by_campaign(campaign_key)
    valid_action_keys = {a.action_key for a in valid_actions}
    
    # Update links
    updated_count = 0
    for action_key, url in links.items():
        if action_key not in valid_action_keys:
            continue
            
        if url and url.strip():
            link_data = MentorLinkCreate(
                mentor_id=mentor_id,
                campaign_key=campaign_key,
                action_key=action_key,
                url=url.strip()
            )
            await link_service.create_or_update_link(link_data)
            updated_count += 1
        else:
            await link_service.delete_link(mentor_id, campaign_key, action_key)
    
    return {
        "success": True,
        "updated": updated_count
    }


# ============================================
# MAGIC LINKS BY CAMPAIGN
# ============================================

@router.post("/{mentor_id}/magic-link/{campaign_key}")
async def generate_magic_link(
    mentor_id: str,
    campaign_key: str,
    days_valid: int = Query(30, ge=1, le=365),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Generate a magic link for a specific mentor+campaign"""
    # Verify campaign exists
    campaign = await db.campaigns.find_one({"key": campaign_key, "active": True})
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found or inactive")
    
    token_service = MagicTokenService(db)
    try:
        return await token_service.generate_token(mentor_id, campaign_key, days_valid)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/{mentor_id}/magic-link/{campaign_key}/info")
async def get_magic_link_info(
    mentor_id: str,
    campaign_key: str,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get magic link info for a specific mentor+campaign"""
    token_service = MagicTokenService(db)
    info = await token_service.get_token_info(mentor_id, campaign_key)
    if not info:
        return {"has_token": False}
    return {"has_token": True, **info}

@router.get("/{mentor_id}/magic-links")
async def get_all_magic_links(
    mentor_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get all magic links for a mentor across all campaigns"""
    token_service = MagicTokenService(db)
    tokens = await token_service.get_all_tokens_for_mentor(mentor_id)
    return {"tokens": tokens}


# ============================================
# LEGACY ENDPOINTS (backward compatibility)
# ============================================

@router.post("/{mentor_id}/magic-link")
async def generate_magic_link_legacy(
    mentor_id: str,
    days_valid: int = Query(30, ge=1, le=365),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Legacy: Generate magic link for default campaign (cpn)"""
    return await generate_magic_link(mentor_id, "cpn", days_valid, db)

@router.get("/{mentor_id}/magic-link/info")
async def get_magic_link_info_legacy(
    mentor_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Legacy: Get magic link info for default campaign (cpn)"""
    return await get_magic_link_info(mentor_id, "cpn", db)
