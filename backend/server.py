from fastapi import FastAPI, APIRouter
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path

# Import routes
from routes.public import router as public_router
from routes.admin_mentors import router as admin_mentors_router
from routes.admin_actions import router as admin_actions_router
from routes.admin_links import router as admin_links_router
from routes.tracking import router as tracking_router
from routes.mentor_edit import router as mentor_edit_router
from routes.admin_csv import router as admin_csv_router
from routes.admin_campaigns import router as admin_campaigns_router

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI(title="InverSer Marketing System")

# Mount uploads directory (use /api prefix for Kubernetes ingress routing)
UPLOAD_DIR = Path("/app/backend/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/api/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

# Include routers
app.include_router(public_router)
app.include_router(admin_mentors_router)
app.include_router(admin_actions_router)
app.include_router(admin_links_router)
app.include_router(tracking_router)
app.include_router(mentor_edit_router)
app.include_router(admin_csv_router)
app.include_router(admin_campaigns_router)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Root endpoint
@app.get("/api/")
async def root():
    return {"message": "InverSer Marketing System API", "version": "1.0.0"}

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()