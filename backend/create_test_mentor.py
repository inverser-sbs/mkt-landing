"""
Create test mentor: Noel Rivera
"""
import asyncio
import sys
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path
from datetime import datetime

# Load environment
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

async def create_test_mentor():
    # Connect to MongoDB
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]
    
    print("👤 Creating test mentor: Noel Rivera...")
    
    # Check if mentor already exists
    existing = await db.mentors.find_one({"slug": "noel-rivera"})
    if existing:
        print("⚠️  Mentor 'noel-rivera' already exists!")
        mentor_id = str(existing["_id"])
    else:
        # Create mentor
        mentor_data = {
            "first_name": "Noel",
            "last_name": "Rivera",
            "email": "noel@inverser.us",
            "slug": "noel-rivera",
            "photo_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
            "active": True,
            "mentor_group": "team",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        result = await db.mentors.insert_one(mentor_data)
        mentor_id = str(result.inserted_id)
        print(f"✅ Mentor created with ID: {mentor_id}")
    
    # Create links for actions
    print("\n🔗 Creating mentor links...")
    
    links = [
        {
            "action_key": "agenda",
            "url": "https://calendly.com/inverser/certificacion-neurocoaching"
        },
        {
            "action_key": "whatsapp",
            "url": "https://wa.me/13059005673?text=Hola%20Noel,%20me%20interesa%20la%20Certificaci%C3%B3n%20de%20NeuroCoaching"
        },
        {
            "action_key": "formulario",
            "url": "https://forms.gle/inverser-aplicacion"
        }
    ]
    
    for link in links:
        # Check if link already exists
        existing_link = await db.mentor_links.find_one({
            "mentor_id": mentor_id,
            "action_key": link["action_key"]
        })
        
        if existing_link:
            print(f"  ⏭️  Link already exists: {link['action_key']}")
        else:
            link_data = {
                "mentor_id": mentor_id,
                "action_key": link["action_key"],
                "url": link["url"],
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            await db.mentor_links.insert_one(link_data)
            print(f"  ✅ Created link: {link['action_key']} -> {link['url']}")
    
    print("\n✨ Test mentor setup complete!")
    print(f"\n🌐 Public URL: http://localhost:3000/noel-rivera")
    print(f"📊 Check stats: http://localhost:8001/api/track/stats/all")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(create_test_mentor())
