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
    Get list of valid passwords.
    ALWAYS includes hardcoded production passwords as fallback.
    Additionally accepts passwords from ADMIN_PASSWORDS or ADMIN_PASSWORD env vars.
    """
    valid_passwords = set(PRODUCTION_PASSWORDS)  # Always include hardcoded
    
    # Add passwords from ADMIN_PASSWORDS env (pipe-separated)
    admin_passwords_raw = os.environ.get('ADMIN_PASSWORDS', '')
    if admin_passwords_raw.strip():
        env_passwords = [p.strip() for p in admin_passwords_raw.split('|') if p.strip()]
        valid_passwords.update(env_passwords)
        logger.info(f"AUTH: Added {len(env_passwords)} passwords from ADMIN_PASSWORDS env")
    
    # Add password from ADMIN_PASSWORD env (single)
    admin_password_raw = os.environ.get('ADMIN_PASSWORD', '')
    if admin_password_raw.strip():
        valid_passwords.add(admin_password_raw.strip())
        logger.info("AUTH: Added password from ADMIN_PASSWORD env")
    
    logger.info(f"AUTH: Total valid passwords: {len(valid_passwords)}")
    return list(valid_passwords)

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

@router.get("/version")
async def auth_version():
    """
    Debug endpoint to verify which code version is running.
    DELETE THIS AFTER CONFIRMING DEPLOY WORKS.
    """
    valid_passwords = get_valid_passwords()
    return {
        "version": "2025-01-01-v3-hardcoded-always",
        "hardcoded_count": len(PRODUCTION_PASSWORDS),
        "total_valid_count": len(valid_passwords),
        "hardcoded_lengths": [len(p) for p in PRODUCTION_PASSWORDS],
        "env_ADMIN_PASSWORDS_set": bool(os.environ.get('ADMIN_PASSWORDS', '').strip()),
        "env_ADMIN_PASSWORD_set": bool(os.environ.get('ADMIN_PASSWORD', '').strip()),
    }
