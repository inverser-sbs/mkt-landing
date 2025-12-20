from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from models.mentor import Mentor, MentorCreate, MentorUpdate
from services.mentor_service import MentorService
from services.magic_token_service import MagicTokenService
from typing import List, Optional
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
    
    # Update mentor
    photo_url = f"/uploads/mentors/{filename}"
    service = MentorService(db)
    mentor = await service.update_mentor(mentor_id, MentorUpdate(photo_url=photo_url))
    
    if not mentor:
        # Clean up uploaded file
        file_path.unlink()
        raise HTTPException(status_code=404, detail="Mentor not found")
    
    return {"photo_url": photo_url}

@router.post("/{mentor_id}/magic-link")
async def generate_magic_link(
    mentor_id: str,
    days_valid: int = Query(30, ge=1, le=365),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    token_service = MagicTokenService(db)
    try:
        return await token_service.generate_token(mentor_id, days_valid)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/{mentor_id}/magic-link/info")
async def get_magic_link_info(mentor_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    token_service = MagicTokenService(db)
    info = await token_service.get_token_info(mentor_id)
    if not info:
        return {"has_token": False}
    return {"has_token": True, **info}