"""
Script to initialize the InverSer Marketing System with default data.
Run this once after deploying the application.
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path

# Load environment
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

async def init_database():
    # Connect to MongoDB
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]
    
    print("🚀 Initializing InverSer Marketing System...")
    
    # 1. Create default actions
    print("\n📋 Creating default actions...")
    
    default_actions = [
        {
            "action_key": "agenda",
            "label": "Agendar Llamada",
            "description": "Botón para agendar una llamada con el mentor",
            "active": True,
            "order": 1,
            "action_type": "url"
        },
        {
            "action_key": "whatsapp",
            "label": "Hablar por WhatsApp",
            "description": "Botón para iniciar conversación por WhatsApp",
            "active": True,
            "order": 2,
            "action_type": "url"
        },
        {
            "action_key": "formulario",
            "label": "Aplicar / Registrarme",
            "description": "Botón para aplicar o registrarse en el programa",
            "active": True,
            "order": 3,
            "action_type": "url"
        }
    ]
    
    for action in default_actions:
        existing = await db.actions.find_one({"action_key": action["action_key"]})
        if not existing:
            from datetime import datetime
            action["created_at"] = datetime.utcnow()
            action["updated_at"] = datetime.utcnow()
            await db.actions.insert_one(action)
            print(f"  ✅ Created action: {action['label']} ({action['action_key']})")
        else:
            print(f"  ⏭️  Action already exists: {action['label']}")
    
    # 2. Create indexes
    print("\n🔍 Creating database indexes...")
    
    # Mentors indexes
    await db.mentors.create_index("slug", unique=True)
    await db.mentors.create_index("active")
    await db.mentors.create_index("mentor_group")
    print("  ✅ Mentors indexes created")
    
    # Actions indexes
    await db.actions.create_index("action_key", unique=True)
    await db.actions.create_index("order")
    print("  ✅ Actions indexes created")
    
    # Links indexes
    await db.mentor_links.create_index([("mentor_id", 1), ("action_key", 1)], unique=True)
    print("  ✅ Links indexes created")
    
    # Tokens indexes
    await db.magic_tokens.create_index("mentor_id")
    await db.magic_tokens.create_index("token_hash")
    await db.magic_tokens.create_index("expires_at")
    print("  ✅ Tokens indexes created")
    
    # Events indexes
    await db.mentor_events.create_index("mentor_id")
    await db.mentor_events.create_index("event_type")
    await db.mentor_events.create_index("timestamp")
    await db.mentor_events.create_index([("mentor_id", 1), ("timestamp", -1)])
    print("  ✅ Events indexes created")
    
    print("\n✨ Initialization complete!")
    print("\n📝 Next steps:")
    print("  1. Access the admin panel at: http://localhost:3000/admin")
    print("  2. Create your first mentor")
    print("  3. Configure mentor links")
    print("  4. Generate a magic link for the mentor to edit their links")
    print("  5. Share the public URL with your audience")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(init_database())
