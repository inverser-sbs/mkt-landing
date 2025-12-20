"""
Create suitex campaign and demo action for testing
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path
from datetime import datetime

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

async def create_suitex_campaign():
    print("🚀 Creating suitex campaign and demo action...")
    print()
    
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]
    
    # Create suitex campaign
    print("📋 Creating suitex campaign...")
    existing = await db.campaigns.find_one({"key": "suitex"})
    
    if existing:
        print("  ⏭️  Campaign 'suitex' already exists")
        campaign_id = str(existing["_id"])
    else:
        campaign_data = {
            "key": "suitex",
            "name": "Suitex (InverSer Experience)",
            "active": True,
            "sort_order": 1,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        result = await db.campaigns.insert_one(campaign_data)
        campaign_id = str(result.inserted_id)
        print(f"  ✅ Created campaign: suitex")
    
    # Create demo action for suitex
    print("\n📋 Creating demo action for suitex...")
    existing_action = await db.actions.find_one({"campaign_key": "suitex", "action_key": "demo"})
    
    if existing_action:
        print("  ⏭️  Action 'demo' already exists for suitex")
    else:
        action_data = {
            "campaign_key": "suitex",
            "action_key": "demo",
            "label": "Solicitar Demo",
            "description": "Botón para solicitar una demo de Suitex",
            "active": True,
            "order": 10,
            "action_type": "url",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        await db.actions.insert_one(action_data)
        print(f"  ✅ Created action: demo")
    
    # Create demo link for noel-rivera in suitex
    print("\n📋 Creating demo link for noel-rivera in suitex...")
    mentor = await db.mentors.find_one({"slug": "noel-rivera"})
    
    if not mentor:
        print("  ❌ Mentor noel-rivera not found")
    else:
        mentor_id = str(mentor["_id"])
        
        existing_link = await db.mentor_links.find_one({
            "mentor_id": mentor_id,
            "campaign_key": "suitex",
            "action_key": "demo"
        })
        
        if existing_link:
            print("  ⏭️  Link already exists")
        else:
            link_data = {
                "mentor_id": mentor_id,
                "campaign_key": "suitex",
                "action_key": "demo",
                "url": "https://calendly.com/inverser/suitex-demo",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            await db.mentor_links.insert_one(link_data)
            print(f"  ✅ Created link for suitex/demo")
    
    print("\n✨ Setup complete!")
    print("\n🌐 Test URLs:")
    print("  - CPN: http://localhost:3000/cpn/noel-rivera")
    print("  - Suitex: http://localhost:3000/suitex/noel-rivera")
    print("  - Legacy: http://localhost:3000/noel-rivera (redirects to /cpn/noel-rivera)")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(create_suitex_campaign())
