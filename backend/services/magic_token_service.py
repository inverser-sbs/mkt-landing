from motor.motor_asyncio import AsyncIOMotorDatabase
from models.magic_token import MagicToken, MagicTokenCreate, MagicTokenResponse
from datetime import datetime, timedelta
from typing import Optional, List
import secrets
import hashlib
from bson import ObjectId
import os
import logging

logger = logging.getLogger(__name__)

def get_frontend_url():
    """Get frontend URL from environment - REQUIRED for magic links"""
    url = os.environ.get('FRONTEND_URL', '').strip()
    if not url:
        logger.error("FRONTEND_URL not set! Magic links will not work properly.")
        # Return empty to make the error obvious
        return 'http://FRONTEND_URL_NOT_CONFIGURED'
    return url.rstrip('/')

class MagicTokenService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.collection = db.magic_tokens
    
    def _hash_token(self, token: str) -> str:
        return hashlib.sha256(token.encode()).hexdigest()
    
    async def generate_token(
        self, 
        mentor_id: str, 
        campaign_key: str,
        days_valid: int = 30
    ) -> MagicTokenResponse:
        """Generate a magic token for a specific mentor+campaign combination"""
        # Invalidate previous tokens for this mentor+campaign
        await self.collection.update_many(
            {"mentor_id": mentor_id, "campaign_key": campaign_key, "is_valid": True},
            {"$set": {"is_valid": False}}
        )
        
        # Generate new token
        token = secrets.token_urlsafe(32)
        token_hash = self._hash_token(token)
        expires_at = datetime.utcnow() + timedelta(days=days_valid)
        
        token_dict = {
            "mentor_id": mentor_id,
            "campaign_key": campaign_key,
            "token_hash": token_hash,
            "expires_at": expires_at,
            "created_at": datetime.utcnow(),
            "is_valid": True
        }
        
        await self.collection.insert_one(token_dict)
        
        # Get mentor slug - try by 'id' field first, then by ObjectId
        mentor = await self.db.mentors.find_one({"id": mentor_id})
        if not mentor:
            # Fallback to ObjectId for backward compatibility
            try:
                mentor = await self.db.mentors.find_one({"_id": ObjectId(mentor_id)})
            except:
                pass
        
        if not mentor:
            raise ValueError("Mentor not found")
        
        # Build magic link URL - get FRONTEND_URL at runtime
        frontend_url = get_frontend_url()
        magic_link = f"{frontend_url}/edit/{campaign_key}/{mentor['slug']}?token={token}"
        
        return MagicTokenResponse(
            magic_link=magic_link,
            expires_at=expires_at,
            campaign_key=campaign_key
        )
    
    async def validate_token(self, mentor_id: str, campaign_key: str, token: str) -> bool:
        """Validate a token for a specific mentor+campaign"""
        token_hash = self._hash_token(token)
        
        token_doc = await self.collection.find_one({
            "mentor_id": mentor_id,
            "campaign_key": campaign_key,
            "token_hash": token_hash,
            "is_valid": True
        })
        
        if not token_doc:
            return False
        
        # Check expiration
        if token_doc["expires_at"] < datetime.utcnow():
            return False
        
        return True
    
    async def get_token_info(self, mentor_id: str, campaign_key: str = None) -> Optional[dict]:
        """Get current valid token info for mentor, optionally filtered by campaign"""
        query = {"mentor_id": mentor_id, "is_valid": True}
        if campaign_key:
            query["campaign_key"] = campaign_key
        
        token_doc = await self.collection.find_one(
            query,
            sort=[("created_at", -1)]
        )
        
        if not token_doc:
            return None
        
        return {
            "campaign_key": token_doc.get("campaign_key", "cpn"),
            "expires_at": token_doc["expires_at"],
            "created_at": token_doc["created_at"],
            "is_expired": token_doc["expires_at"] < datetime.utcnow()
        }
    
    async def get_all_tokens_for_mentor(self, mentor_id: str) -> List[dict]:
        """Get all valid tokens for a mentor across all campaigns"""
        tokens = []
        async for token_doc in self.collection.find(
            {"mentor_id": mentor_id, "is_valid": True},
            sort=[("created_at", -1)]
        ):
            tokens.append({
                "campaign_key": token_doc.get("campaign_key", "cpn"),
                "expires_at": token_doc["expires_at"],
                "created_at": token_doc["created_at"],
                "is_expired": token_doc["expires_at"] < datetime.utcnow()
            })
        return tokens
    
    async def delete_token(self, mentor_id: str, campaign_key: str) -> bool:
        """
        Delete/invalidate all magic tokens for a mentor+campaign.
        Returns True if any tokens were invalidated.
        """
        result = await self.collection.update_many(
            {"mentor_id": mentor_id, "campaign_key": campaign_key, "is_valid": True},
            {"$set": {"is_valid": False}}
        )
        return result.modified_count > 0
    
    async def get_detailed_validation(self, mentor_id: str, campaign_key: str, token: str) -> dict:
        """
        Get detailed validation result with specific error reason.
        Returns dict with 'valid' boolean and 'reason' string.
        """
        token_hash = self._hash_token(token)
        
        # Check if token exists at all (any state)
        any_token = await self.collection.find_one({
            "mentor_id": mentor_id,
            "campaign_key": campaign_key,
            "token_hash": token_hash
        })
        
        if not any_token:
            return {"valid": False, "reason": "token_not_found"}
        
        # Check if token is invalidated
        if not any_token.get("is_valid", False):
            return {"valid": False, "reason": "token_invalidated"}
        
        # Check expiration
        if any_token["expires_at"] < datetime.utcnow():
            return {"valid": False, "reason": "token_expired", "expired_at": any_token["expires_at"]}
        
        return {"valid": True, "reason": "ok"}
