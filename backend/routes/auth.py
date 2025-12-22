"""
Authentication routes - Simple multi-password login
NO RBAC, NO users, NO permissions
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os

router = APIRouter(prefix="/api/auth", tags=["auth"])

class LoginRequest(BaseModel):
    password: str

class LoginResponse(BaseModel):
    success: bool
    token: str = None

def get_valid_passwords() -> list:
    """
    Get list of valid passwords from environment variables.
    Priority: ADMIN_PASSWORDS (comma-separated) > ADMIN_PASSWORD (single)
    """
    # Try multi-password first
    admin_passwords = os.environ.get('ADMIN_PASSWORDS', '')
    if admin_passwords:
        # Split by comma and strip whitespace
        return [p.strip() for p in admin_passwords.split(',') if p.strip()]
    
    # Fallback to single password
    single_password = os.environ.get('ADMIN_PASSWORD', '')
    if single_password:
        return [single_password]
    
    # Default fallback for development (will be overridden in production)
    return ['inverser2024']

@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    """
    Validate password against configured passwords.
    Returns generic error message for security.
    """
    valid_passwords = get_valid_passwords()
    
    # Check if password matches any valid password
    # DO NOT log passwords or provide hints about which password was tried
    if request.password in valid_passwords:
        return LoginResponse(
            success=True,
            token="inverser_admin_authenticated"
        )
    
    # Generic error message - no hints about password validity
    raise HTTPException(
        status_code=401,
        detail="Credenciales inválidas"
    )
