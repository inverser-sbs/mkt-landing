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

# Hardcoded fallback passwords for production
# These are used ONLY if ENV variables are not set
PRODUCTION_PASSWORDS = [
    "Inverser2025",
    "O+ZzT*oR0cLo=ihm",
    "qH{5L[Y,41QpK!ZB"
]

def get_valid_passwords() -> list:
    """
    Get list of valid passwords from environment variables.
    Priority: ADMIN_PASSWORDS (pipe-separated) > ADMIN_PASSWORD (single) > PRODUCTION_PASSWORDS
    Uses pipe '|' as delimiter to support passwords with commas
    """
    # Log all ENV status at startup
    admin_passwords_raw = os.environ.get('ADMIN_PASSWORDS', '')
    admin_password_raw = os.environ.get('ADMIN_PASSWORD', '')
    
    logger.info(f"AUTH ENV CHECK: ADMIN_PASSWORDS length={len(admin_passwords_raw)}, ADMIN_PASSWORD length={len(admin_password_raw)}")
    
    # Try multi-password ENV first
    admin_passwords = admin_passwords_raw.strip()
    if admin_passwords:
        # Split by pipe and strip whitespace
        passwords = [p.strip() for p in admin_passwords.split('|') if p.strip()]
        if passwords:
            logger.info(f"AUTH: Using ADMIN_PASSWORDS env, count={len(passwords)}, lengths={[len(p) for p in passwords]}")
            return passwords
    
    # Fallback to single password ENV
    single_password = admin_password_raw.strip()
    if single_password:
        logger.info(f"AUTH: Using ADMIN_PASSWORD env, length={len(single_password)}")
        return [single_password]
    
    # Final fallback: hardcoded production passwords
    logger.warning("AUTH: No ENV passwords found, using HARDCODED production passwords")
    return PRODUCTION_PASSWORDS

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
