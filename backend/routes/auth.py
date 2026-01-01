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
        # DIAGNOSTIC LOG (NO SENSITIVE DATA)
        logger.info(f"AUTH CONFIG: ADMIN_PASSWORDS exists, contains '|': {'|' in admin_passwords}, parsed count: {len(passwords)}, lengths: {[len(p) for p in passwords]}")
        return passwords
    
    # Fallback to single password
    single_password = os.environ.get('ADMIN_PASSWORD', '')
    if single_password:
        logger.info(f"AUTH CONFIG: Using ADMIN_PASSWORD fallback, length: {len(single_password)}")
        return [single_password]
    
    # Default fallback for development (will be overridden in production)
    logger.warning("AUTH CONFIG: No ADMIN_PASSWORDS or ADMIN_PASSWORD found, using default")
    return ['inverser2024']

@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    """
    Validate password against configured passwords.
    Returns generic error message for security.
    """
    valid_passwords = get_valid_passwords()
    
    # DIAGNOSTIC LOG (NO SENSITIVE DATA - only lengths)
    logger.info(f"LOGIN ATTEMPT: received password length: {len(request.password)}, valid password lengths: {[len(p) for p in valid_passwords]}")
    
    # Check if password matches any valid password
    if request.password in valid_passwords:
        logger.info("LOGIN SUCCESS")
        return LoginResponse(
            success=True,
            token="inverser_admin_authenticated"
        )
    
    # Log mismatch details (NO ACTUAL VALUES)
    logger.warning(f"LOGIN FAILED: password length {len(request.password)} did not match any of {len(valid_passwords)} valid passwords")
    
    # Generic error message - no hints about password validity
    raise HTTPException(
        status_code=401,
        detail="Credenciales inválidas"
    )
