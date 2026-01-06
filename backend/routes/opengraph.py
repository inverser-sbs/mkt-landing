"""
Open Graph Meta Tags Generator
==============================
Generates dynamic meta tags for social media sharing (WhatsApp, Facebook, Twitter, etc.)
"""

from fastapi import APIRouter, Depends, Request
from fastapi.responses import HTMLResponse
from motor.motor_asyncio import AsyncIOMotorDatabase
from services.mentor_service import MentorService
import os

router = APIRouter(prefix="/api/og", tags=["opengraph"])

async def get_db():
    from server import db
    return db

# Campaign descriptions (segunda línea en WhatsApp)
CAMPAIGN_DESCRIPTIONS = {
    "cpn": "Certificación Profesional NeuroCoaching",
    "mpp": "Mentor & Partner Program",
    "partner": "Mentor & Partner Program",
    "suitex": "SuiteX"
}

def get_base_url():
    """Get base URL from environment or default"""
    return os.environ.get("FRONTEND_URL", "").rstrip("/")

@router.get("/{campaign}/{slug}", response_class=HTMLResponse)
async def get_opengraph_html(
    campaign: str, 
    slug: str, 
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Returns minimal HTML with Open Graph meta tags for social media crawlers.
    Human visitors get redirected to the actual page via JavaScript.
    """
    base_url = get_base_url()
    
    # Default values
    title = "INVERSER"
    description = CAMPAIGN_DESCRIPTIONS.get(campaign, "Plataforma de Coaching y Mentoring")
    image_url = f"{base_url}/api/uploads/inverser-logo.png"  # Fallback image
    page_url = f"{base_url}/{campaign}/{slug}"
    
    # Try to get mentor data
    try:
        mentor_service = MentorService(db)
        mentor = await mentor_service.get_mentor_by_slug(slug)
        
        if mentor:
            mentor_name = f"{mentor.first_name} {mentor.last_name}".strip()
            title = f"INVERSER - {mentor_name}"
            
            if mentor.photo_url:
                # Handle relative and absolute URLs
                if mentor.photo_url.startswith("http"):
                    image_url = mentor.photo_url
                else:
                    image_url = f"{base_url}{mentor.photo_url}"
    except Exception:
        pass  # Use defaults if anything fails
    
    # Generate HTML with OG tags
    html = f"""<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Primary Meta Tags -->
    <title>{title}</title>
    <meta name="title" content="{title}">
    <meta name="description" content="{description}">
    
    <!-- Open Graph / Facebook / WhatsApp -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="{page_url}">
    <meta property="og:title" content="{title}">
    <meta property="og:description" content="{description}">
    <meta property="og:image" content="{image_url}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:site_name" content="INVERSER">
    <meta property="og:locale" content="es_ES">
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="{page_url}">
    <meta property="twitter:title" content="{title}">
    <meta property="twitter:description" content="{description}">
    <meta property="twitter:image" content="{image_url}">
    
    <!-- Redirect human visitors to the actual page -->
    <script>
        window.location.replace("{page_url}");
    </script>
    <noscript>
        <meta http-equiv="refresh" content="0;url={page_url}">
    </noscript>
</head>
<body>
    <p>Redirigiendo a <a href="{page_url}">{title}</a>...</p>
</body>
</html>"""
    
    return HTMLResponse(content=html, status_code=200)
