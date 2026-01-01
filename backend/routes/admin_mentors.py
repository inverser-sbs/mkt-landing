from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from models.mentor import Mentor, MentorCreate, MentorUpdate
from models.mentor_link import MentorLinkCreate
from models.mentor_campaign import MentorCampaign, MentorWithCampaigns
from services.mentor_service import MentorService
from services.mentor_link_service import MentorLinkService
from services.magic_token_service import MagicTokenService
from services.action_service import ActionService
from services.mentor_campaign_service import MentorCampaignService
from typing import List, Optional, Dict
from pydantic import BaseModel
import os
import shutil
from pathlib import Path
import uuid

router = APIRouter(prefix="/api/admin/mentors", tags=["admin-mentors"])

UPLOAD_DIR = Path("/app/backend/uploads/mentors")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

def get_frontend_url():
    """Get FRONTEND_URL dynamically - REQUIRED for public URLs"""
    url = os.environ.get('FRONTEND_URL', '').strip()
    if not url:
        logging.error("FRONTEND_URL not set! Public URLs will not work properly.")
        return 'http://FRONTEND_URL_NOT_CONFIGURED'
    return url.rstrip('/')

def build_public_url(slug: str, campaign_key: str = None) -> str:
    """Build public URL for mentor landing page"""
    frontend_url = get_frontend_url()
    if campaign_key:
        return f"{frontend_url}/{campaign_key}/{slug}"
    return f"{frontend_url}/{slug}"

async def get_db():
    from server import db
    return db

# ============================================
# REQUEST MODELS
# ============================================

class MentorCreateWithCampaigns(BaseModel):
    """Create mentor with campaign assignments"""
    first_name: str
    last_name: str
    email: Optional[str] = None
    slug: str
    photo_url: Optional[str] = None
    active: bool = True
    mentor_group: Optional[str] = None
    campaign_keys: List[str] = []  # Campaigns to assign

class MentorUpdateWithCampaigns(BaseModel):
    """Update mentor with campaign assignments"""
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    slug: Optional[str] = None
    photo_url: Optional[str] = None
    active: Optional[bool] = None
    mentor_group: Optional[str] = None
    campaign_keys: Optional[List[str]] = None  # If provided, sync campaigns

class CampaignAssignmentRequest(BaseModel):
    """Request to assign/update campaigns for a mentor"""
    campaign_keys: List[str]
    sync_mode: bool = True  # If true, remove from campaigns not in list

class CampaignStatusUpdate(BaseModel):
    """Update mentor status in a specific campaign"""
    status: str  # active, paused, inactive


# ============================================
# MENTOR CRUD (GLOBAL)
# ============================================

@router.post("", response_model=MentorWithCampaigns)
async def create_mentor(
    mentor_data: MentorCreateWithCampaigns, 
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Create a new mentor (global entity).
    Optionally assign to campaigns via campaign_keys.
    """
    service = MentorService(db)
    campaign_service = MentorCampaignService(db)
    
    try:
        # Create mentor
        mentor_create = MentorCreate(
            first_name=mentor_data.first_name,
            last_name=mentor_data.last_name,
            email=mentor_data.email,
            slug=mentor_data.slug,
            photo_url=mentor_data.photo_url,
            active=mentor_data.active,
            mentor_group=mentor_data.mentor_group
        )
        mentor = await service.create_mentor(mentor_create)
        
        # Assign to campaigns
        campaigns = []
        for campaign_key in mentor_data.campaign_keys:
            try:
                await campaign_service.assign_mentor_to_campaign(mentor.id, campaign_key)
                campaigns.append({
                    "campaign_key": campaign_key,
                    "status": "active",
                    "has_magic_link": False,
                    "public_url": build_public_url(mentor.slug, campaign_key)
                })
            except ValueError:
                pass  # Skip invalid campaigns
        
        # Build default public_url (first campaign or just slug)
        default_url = campaigns[0]["public_url"] if campaigns else build_public_url(mentor.slug)
        
        return MentorWithCampaigns(
            id=mentor.id,
            first_name=mentor.first_name,
            last_name=mentor.last_name,
            email=mentor.email,
            slug=mentor.slug,
            photo_url=mentor.photo_url,
            active=mentor.active,
            mentor_group=mentor.mentor_group,
            created_at=mentor.created_at,
            updated_at=mentor.updated_at,
            public_url=default_url,
            campaigns=campaigns
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("", response_model=List[MentorWithCampaigns])
async def get_all_mentors(
    active_only: bool = Query(False),
    group: Optional[str] = Query(None),
    campaign_key: Optional[str] = Query(None, description="Filter by campaign assignment"),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Get all mentors (global list).
    Optionally filter by campaign assignment.
    """
    service = MentorService(db)
    campaign_service = MentorCampaignService(db)
    
    # Get base mentors
    mentors = await service.get_all_mentors(active_only=active_only, group=group)
    
    # If filtering by campaign, get mentor IDs for that campaign
    if campaign_key:
        campaign_mentor_ids = await campaign_service.get_campaign_mentors(campaign_key)
        mentors = [m for m in mentors if m.id in campaign_mentor_ids]
    
    # Enrich with campaign info and correct public URLs
    result = []
    for mentor in mentors:
        raw_campaigns = await campaign_service.get_mentor_campaigns(mentor.id)
        
        # Add public_url to each campaign
        campaigns_with_url = []
        for c in raw_campaigns:
            c["public_url"] = build_public_url(mentor.slug, c["campaign_key"])
            campaigns_with_url.append(c)
        
        # Default URL is first campaign's URL or just slug
        default_url = campaigns_with_url[0]["public_url"] if campaigns_with_url else build_public_url(mentor.slug)
        
        result.append(MentorWithCampaigns(
            id=mentor.id,
            first_name=mentor.first_name,
            last_name=mentor.last_name,
            email=mentor.email,
            phone=getattr(mentor, 'phone', None),
            slug=mentor.slug,
            photo_url=mentor.photo_url,
            active=mentor.active,
            mentor_group=mentor.mentor_group,
            created_at=mentor.created_at,
            updated_at=mentor.updated_at,
            public_url=default_url,
            campaigns=campaigns_with_url
        ))
    
    return result


@router.get("/{mentor_id}", response_model=MentorWithCampaigns)
async def get_mentor(mentor_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    """Get a mentor with all campaign assignments"""
    service = MentorService(db)
    campaign_service = MentorCampaignService(db)
    
    mentor = await service.get_mentor_by_id(mentor_id)
    if not mentor:
        raise HTTPException(status_code=404, detail="Mentor not found")
    
    campaigns = await campaign_service.get_mentor_campaigns(mentor_id)
    
    return MentorWithCampaigns(
        id=mentor.id,
        first_name=mentor.first_name,
        last_name=mentor.last_name,
        email=mentor.email,
        slug=mentor.slug,
        photo_url=mentor.photo_url,
        active=mentor.active,
        mentor_group=mentor.mentor_group,
        created_at=mentor.created_at,
        updated_at=mentor.updated_at,
        public_url=mentor.public_url,
        campaigns=campaigns
    )


@router.put("/{mentor_id}", response_model=MentorWithCampaigns)
async def update_mentor(
    mentor_id: str,
    mentor_data: MentorUpdateWithCampaigns,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Update a mentor and optionally sync campaign assignments.
    """
    service = MentorService(db)
    campaign_service = MentorCampaignService(db)
    
    try:
        # Update mentor fields
        mentor_update = MentorUpdate(
            first_name=mentor_data.first_name,
            last_name=mentor_data.last_name,
            email=mentor_data.email,
            slug=mentor_data.slug,
            photo_url=mentor_data.photo_url,
            active=mentor_data.active,
            mentor_group=mentor_data.mentor_group
        )
        updated = await service.update_mentor(mentor_id, mentor_update)
        if not updated:
            raise HTTPException(status_code=404, detail="Mentor not found")
        
        # Sync campaigns if provided
        if mentor_data.campaign_keys is not None:
            await campaign_service.bulk_assign_mentor(
                mentor_id, 
                mentor_data.campaign_keys,
                remove_others=True
            )
        
        # Get updated campaign info
        campaigns = await campaign_service.get_mentor_campaigns(mentor_id)
        
        return MentorWithCampaigns(
            id=updated.id,
            first_name=updated.first_name,
            last_name=updated.last_name,
            email=updated.email,
            slug=updated.slug,
            photo_url=updated.photo_url,
            active=updated.active,
            mentor_group=updated.mentor_group,
            created_at=updated.created_at,
            updated_at=updated.updated_at,
            public_url=updated.public_url,
            campaigns=campaigns
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{mentor_id}")
async def delete_mentor(
    mentor_id: str, 
    cleanup_all: bool = Query(True, description="Also delete all links, tokens, events"),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Delete a mentor globally.
    If cleanup_all=True, also removes all campaign assignments, links, tokens.
    """
    service = MentorService(db)
    campaign_service = MentorCampaignService(db)
    
    # Get mentor first
    mentor = await service.get_mentor_by_id(mentor_id)
    if not mentor:
        raise HTTPException(status_code=404, detail="Mentor not found")
    
    result = {
        "mentor_deleted": False,
        "campaigns_removed": 0,
        "links_deleted": 0,
        "tokens_deleted": 0
    }
    
    if cleanup_all:
        # Get all campaign assignments
        campaigns = await campaign_service.get_mentor_campaigns(mentor_id)
        
        for campaign in campaigns:
            cleanup_result = await campaign_service.remove_mentor_from_campaign(
                mentor_id, 
                campaign["campaign_key"],
                cleanup_data=True
            )
            if cleanup_result["assignment_removed"]:
                result["campaigns_removed"] += 1
            result["links_deleted"] += cleanup_result["links_deleted"]
            result["tokens_deleted"] += cleanup_result["tokens_deleted"]
    
    # Delete mentor
    success = await service.delete_mentor(mentor_id)
    result["mentor_deleted"] = success
    
    return result


# ============================================
# CAMPAIGN ASSIGNMENTS
# ============================================

@router.get("/{mentor_id}/campaigns")
async def get_mentor_campaigns(
    mentor_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get all campaigns a mentor is assigned to"""
    campaign_service = MentorCampaignService(db)
    
    # Verify mentor exists
    mentor = await db.mentors.find_one({"id": mentor_id})
    if not mentor:
        raise HTTPException(status_code=404, detail="Mentor not found")
    
    campaigns = await campaign_service.get_mentor_campaigns(mentor_id)
    return {"campaigns": campaigns}


@router.put("/{mentor_id}/campaigns")
async def update_mentor_campaigns(
    mentor_id: str,
    request: CampaignAssignmentRequest,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Update mentor's campaign assignments.
    If sync_mode=True, removes mentor from campaigns not in the list.
    """
    campaign_service = MentorCampaignService(db)
    
    # Verify mentor exists
    mentor = await db.mentors.find_one({"id": mentor_id})
    if not mentor:
        raise HTTPException(status_code=404, detail="Mentor not found")
    
    result = await campaign_service.bulk_assign_mentor(
        mentor_id,
        request.campaign_keys,
        remove_others=request.sync_mode
    )
    
    # Get updated campaigns
    campaigns = await campaign_service.get_mentor_campaigns(mentor_id)
    
    return {
        "success": True,
        "assigned": result["assigned"],
        "removed": result["removed"],
        "errors": result["errors"],
        "campaigns": campaigns
    }


@router.post("/{mentor_id}/campaigns/{campaign_key}")
async def assign_mentor_to_campaign(
    mentor_id: str,
    campaign_key: str,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Assign a mentor to a specific campaign"""
    campaign_service = MentorCampaignService(db)
    
    try:
        assignment = await campaign_service.assign_mentor_to_campaign(mentor_id, campaign_key)
        return {
            "success": True,
            "assignment": {
                "mentor_id": assignment.mentor_id,
                "campaign_key": assignment.campaign_key,
                "status": assignment.status
            }
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{mentor_id}/campaigns/{campaign_key}")
async def remove_mentor_from_campaign(
    mentor_id: str,
    campaign_key: str,
    cleanup_data: bool = Query(False, description="Also delete links and tokens for this campaign"),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Remove a mentor from a campaign"""
    campaign_service = MentorCampaignService(db)
    
    result = await campaign_service.remove_mentor_from_campaign(
        mentor_id, 
        campaign_key,
        cleanup_data=cleanup_data
    )
    
    if not result["assignment_removed"]:
        raise HTTPException(
            status_code=404, 
            detail="Mentor is not assigned to this campaign"
        )
    
    return {
        "success": True,
        "assignment_removed": True,
        "links_deleted": result["links_deleted"],
        "tokens_deleted": result["tokens_deleted"]
    }


@router.put("/{mentor_id}/campaigns/{campaign_key}/status")
async def update_mentor_campaign_status(
    mentor_id: str,
    campaign_key: str,
    status_update: CampaignStatusUpdate,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update mentor's status in a specific campaign (active/paused/inactive)"""
    campaign_service = MentorCampaignService(db)
    
    # Verify assignment exists
    is_assigned = await campaign_service.is_mentor_in_campaign(mentor_id, campaign_key)
    if not is_assigned:
        raise HTTPException(
            status_code=404, 
            detail="Mentor is not assigned to this campaign"
        )
    
    success = await campaign_service.update_mentor_campaign_status(
        mentor_id, 
        campaign_key, 
        status_update.status
    )
    
    return {
        "success": success,
        "mentor_id": mentor_id,
        "campaign_key": campaign_key,
        "status": status_update.status
    }


# ============================================
# PHOTO UPLOAD
# ============================================

@router.post("/{mentor_id}/photo")
async def upload_photo(
    mentor_id: str,
    file: UploadFile = File(...),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Upload mentor photo (global, not per campaign)"""
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
    campaign_service = MentorCampaignService(db)
    
    # Check if mentor is assigned to this campaign
    is_assigned = await campaign_service.is_mentor_in_campaign(mentor_id, campaign_key)
    
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
            "active": action.active,
            "internal_note": action.internal_note  # Include internal note for admin visibility
        })
    
    return {
        "is_assigned": is_assigned,
        "links": result
    }


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
    campaign_service = MentorCampaignService(db)
    
    # Verify mentor exists
    mentor_service = MentorService(db)
    mentor = await mentor_service.get_mentor_by_id(mentor_id)
    if not mentor:
        raise HTTPException(status_code=404, detail="Mentor not found")
    
    # Verify campaign exists
    campaign = await db.campaigns.find_one({"key": campaign_key})
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    # Auto-assign mentor to campaign if not already assigned
    is_assigned = await campaign_service.is_mentor_in_campaign(mentor_id, campaign_key)
    if not is_assigned:
        await campaign_service.assign_mentor_to_campaign(mentor_id, campaign_key)
    
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
        "updated": updated_count,
        "auto_assigned": not is_assigned
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
    """
    Generate a magic link for a specific mentor+campaign.
    Mentor must be assigned to the campaign.
    """
    campaign_service = MentorCampaignService(db)
    
    # Verify campaign exists and is active
    campaign = await db.campaigns.find_one({"key": campaign_key, "active": True})
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found or inactive")
    
    # Check if mentor is assigned to this campaign
    is_assigned = await campaign_service.is_mentor_in_campaign(mentor_id, campaign_key)
    if not is_assigned:
        raise HTTPException(
            status_code=400, 
            detail=f"Mentor must be assigned to campaign '{campaign_key}' before generating magic link"
        )
    
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


@router.delete("/{mentor_id}/magic-link/{campaign_key}")
async def delete_magic_link(
    mentor_id: str,
    campaign_key: str,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Delete/invalidate magic link for a specific mentor+campaign.
    The mentor will no longer be able to use any previous magic links for this campaign.
    """
    token_service = MagicTokenService(db)
    
    deleted = await token_service.delete_token(mentor_id, campaign_key)
    
    return {
        "success": True,
        "deleted": deleted,
        "message": "Magic link eliminado" if deleted else "No había magic link activo"
    }


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
    campaign_service = MentorCampaignService(db)
    
    # Auto-assign to cpn if not assigned
    is_assigned = await campaign_service.is_mentor_in_campaign(mentor_id, "cpn")
    if not is_assigned:
        try:
            await campaign_service.assign_mentor_to_campaign(mentor_id, "cpn")
        except ValueError:
            pass
    
    return await generate_magic_link(mentor_id, "cpn", days_valid, db)


@router.get("/{mentor_id}/magic-link/info")
async def get_magic_link_info_legacy(
    mentor_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Legacy: Get magic link info for default campaign (cpn)"""
    return await get_magic_link_info(mentor_id, "cpn", db)
