from motor.motor_asyncio import AsyncIOMotorDatabase
from models.magic_token import MagicToken, MagicTokenCreate, MagicTokenResponse
from datetime import datetime, timedelta
from typing import Optional
import secrets
import hashlib
from bson import ObjectId
import os

FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:3000')

class MagicTokenService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.collection = db.magic_tokens
    
    def _hash_token(self, token: str) -> str:
        return hashlib.sha256(token.encode()).hexdigest()
    
    async def generate_token(self, mentor_id: str, days_valid: int = 30) -> MagicTokenResponse:
        # Invalidate previous tokens for this mentor
        await self.collection.update_many(
            {"mentor_id": mentor_id, "is_valid": True},
            {"$set": {"is_valid": False}}
        )
        
        # Generate new token
        token = secrets.token_urlsafe(32)
        token_hash = self._hash_token(token)
        expires_at = datetime.utcnow() + timedelta(days=days_valid)
        
        token_dict = {
            "mentor_id": mentor_id,
            "token_hash": token_hash,
            "expires_at": expires_at,
            "created_at": datetime.utcnow(),
            "is_valid": True
        }
        
        await self.collection.insert_one(token_dict)
        
        # Get mentor slug
        mentor = await self.db.mentors.find_one({"_id": ObjectId(mentor_id)})
        if not mentor:
            raise ValueError("Mentor not found")
        
        magic_link = f"{FRONTEND_URL}/edit/{mentor['slug']}?token={token}"
        
        return MagicTokenResponse(
            magic_link=magic_link,
            expires_at=expires_at
        )
    
    async def validate_token(self, mentor_id: str, token: str) -> bool:
        token_hash = self._hash_token(token)
        
        token_doc = await self.collection.find_one({
            "mentor_id": mentor_id,
            "token_hash": token_hash,
            "is_valid": True
        })
        
        if not token_doc:
            return False
        
        # Check expiration
        if token_doc["expires_at"] < datetime.utcnow():
            return False
        
        return True
    
    async def get_token_info(self, mentor_id: str) -> Optional[dict]:
        """Get current valid token info for mentor"""
        token_doc = await self.collection.find_one(
            {"mentor_id": mentor_id, "is_valid": True},
            sort=[("created_at", -1)]
        )
        
        if not token_doc:
            return None
        
        return {
            "expires_at": token_doc["expires_at"],
            "created_at": token_doc["created_at"],
            "is_expired": token_doc["expires_at"] < datetime.utcnow()
        }