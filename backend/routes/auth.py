"""
Authentication routes - Simple multi-password login
NO RBAC, NO users, NO permissions
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/auth", tags=["auth"])

class LoginRequest(BaseModel):
    password: str

class LoginResponse(BaseModel):
    success: bool
    token: str = None

def get_valid_passwords() -> list:
    """
    Get list of valid passwords from environment variables.
    Priority: ADMIN_PASSWORDS (pipe-separated) > ADMIN_PASSWORD (single)
    Uses pipe '|' as delimiter to support passwords with commas
    """
    # Try multi-password first
    admin_passwords = os.environ.get('ADMIN_PASSWORDS', '')
    if admin_passwords:
        # Split by pipe and strip whitespace
        passwords = [p.strip() for p in admin_passwords.split('|') if p.strip()]
        logger.info(f"AUTH CONFIG: ADMIN_PASSWORDS loaded, count: {len(passwords)}")
        return passwords
    
    # Fallback to single password
    single_password = os.environ.get('ADMIN_PASSWORD', '')
    if single_password:
        logger.info("AUTH CONFIG: Using ADMIN_PASSWORD fallback")
        return [single_password]
    
    # Default fallback for development
    logger.warning("AUTH CONFIG: No passwords configured, using default")
    return ['inverser2024']

@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    """
    Validate password against configured passwords.
    Returns generic error message for security.
    """
    valid_passwords = get_valid_passwords()
    
    # Check if password matches any valid password
    if request.password in valid_passwords:
        logger.info("LOGIN SUCCESS")
        return LoginResponse(
            success=True,
            token="inverser_admin_authenticated"
        )
    
    logger.warning("LOGIN FAILED: invalid credentials")
    raise HTTPException(
        status_code=401,
        detail="Credenciales inválidas"
    )
