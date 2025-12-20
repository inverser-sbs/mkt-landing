"""
Generate magic link for a mentor by slug
Usage: python generate_magic_link.py <mentor-slug> [days_valid]
"""
import asyncio
import sys
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path
from services.magic_token_service import MagicTokenService
from bson import ObjectId

# Load environment
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

async def generate_magic_link(slug: str, days_valid: int = 30):
    # Connect to MongoDB
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]
    
    print(f"🔐 Generating magic link for mentor: {slug}")
    print(f"⏰ Valid for: {days_valid} days")
    print()
    
    # Find mentor by slug
    mentor = await db.mentors.find_one({"slug": slug})
    if not mentor:
        print(f"❌ Error: Mentor with slug '{slug}' not found")
        client.close()
        return
    
    mentor_id = str(mentor["_id"])
    mentor_name = f"{mentor['first_name']} {mentor['last_name']}"
    
    # Generate magic link
    token_service = MagicTokenService(db)
    result = await token_service.generate_token(mentor_id, days_valid)
    
    print(f"✅ Magic link generated successfully!")
    print()
    print(f"👤 Mentor: {mentor_name}")
    print(f"🔗 Slug: {slug}")
    print()
    print("📋 Magic Link:")
    print(f"   {result.magic_link}")
    print()
    print(f"⏰ Expires at: {result.expires_at}")
    print()
    print("📧 You can now send this link to the mentor via:")
    print("   - Email")
    print("   - WhatsApp")
    print("   - SMS")
    print()
    print("⚠️  Important: This link is single-use and expires on the date above.")
    
    client.close()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python generate_magic_link.py <mentor-slug> [days_valid]")
        print()
        print("Examples:")
        print("  python generate_magic_link.py noel-rivera")
        print("  python generate_magic_link.py noel-rivera 7")
        sys.exit(1)
    
    slug = sys.argv[1]
    days_valid = int(sys.argv[2]) if len(sys.argv) > 2 else 30
    
    asyncio.run(generate_magic_link(slug, days_valid))
