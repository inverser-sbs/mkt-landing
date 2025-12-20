"""
Migrate existing single-campaign data to multi-campaign model
Creates default "cpn" campaign and migrates all existing data
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path
from datetime import datetime

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

DEFAULT_CAMPAIGN_KEY = "cpn"
DEFAULT_CAMPAIGN_NAME = "Certificación Profesional NeuroCoaching"

async def migrate_to_multi_campaign():
    print("🚀 Starting migration to multi-campaign model...")
    print()
    
    # Connect to MongoDB
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]
    
    # STEP 1: Create campaigns collection and default campaign
    print("📋 Step 1: Creating campaigns collection...")
    
    existing_campaign = await db.campaigns.find_one({"key": DEFAULT_CAMPAIGN_KEY})
    
    if existing_campaign:
        print(f"  ⏭️  Default campaign '{DEFAULT_CAMPAIGN_KEY}' already exists")
    else:
        campaign_data = {
            "key": DEFAULT_CAMPAIGN_KEY,
            "name": DEFAULT_CAMPAIGN_NAME,
            "active": True,
            "sort_order": 0,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        await db.campaigns.insert_one(campaign_data)
        print(f"  ✅ Created default campaign: {DEFAULT_CAMPAIGN_KEY}")
    
    # Create index
    await db.campaigns.create_index("key", unique=True)
    print("  ✅ Campaign indexes created")
    print()
    
    # STEP 2: Migrate actions
    print("📋 Step 2: Migrating actions...")
    
    actions_to_migrate = await db.actions.count_documents({"campaign_key": {"$exists": False}})
    
    if actions_to_migrate > 0:
        result = await db.actions.update_many(
            {"campaign_key": {"$exists": False}},
            {"$set": {"campaign_key": DEFAULT_CAMPAIGN_KEY}}
        )
        print(f"  ✅ Migrated {result.modified_count} actions to campaign '{DEFAULT_CAMPAIGN_KEY}'")
    else:
        print(f"  ⏭️  All actions already have campaign_key")
    
    # Update index
    await db.actions.create_index([("campaign_key", 1), ("action_key", 1)], unique=True)
    print("  ✅ Actions indexes updated")
    print()
    
    # STEP 3: Migrate mentor_links
    print("📋 Step 3: Migrating mentor_links...")
    
    links_to_migrate = await db.mentor_links.count_documents({"campaign_key": {"$exists": False}})
    
    if links_to_migrate > 0:
        result = await db.mentor_links.update_many(
            {"campaign_key": {"$exists": False}},
            {"$set": {"campaign_key": DEFAULT_CAMPAIGN_KEY}}
        )
        print(f"  ✅ Migrated {result.modified_count} mentor links to campaign '{DEFAULT_CAMPAIGN_KEY}'")
    else:
        print(f"  ⏭️  All mentor links already have campaign_key")
    
    # Update index
    await db.mentor_links.create_index(
        [("mentor_id", 1), ("campaign_key", 1), ("action_key", 1)], 
        unique=True
    )
    print("  ✅ Mentor links indexes updated")
    print()
    
    # STEP 4: Migrate mentor_events
    print("📋 Step 4: Migrating mentor_events...")
    
    events_to_migrate = await db.mentor_events.count_documents({"campaign_key": {"$exists": False}})
    
    if events_to_migrate > 0:
        result = await db.mentor_events.update_many(
            {"campaign_key": {"$exists": False}},
            {"$set": {"campaign_key": DEFAULT_CAMPAIGN_KEY}}
        )
        print(f"  ✅ Migrated {result.modified_count} events to campaign '{DEFAULT_CAMPAIGN_KEY}'")
    else:
        print(f"  ⏭️  All events already have campaign_key")
    
    # Update indexes
    await db.mentor_events.create_index([("mentor_id", 1), ("campaign_key", 1), ("timestamp", -1)])
    await db.mentor_events.create_index("campaign_key")
    print("  ✅ Events indexes updated")
    print()
    
    # STEP 5: Add campaign_key to mentors (for future use)
    print("📋 Step 5: Preparing mentors for multi-campaign...")
    
    # Note: We don't add campaign_key to mentors yet because mentors can be in multiple campaigns
    # Instead, we'll use mentor_links to determine which campaigns a mentor belongs to
    
    print("  ℹ️  Mentors can belong to multiple campaigns via mentor_links")
    print("  ✅ No changes needed to mentors collection")
    print()
    
    # STEP 6: Create summary
    print("📊 Migration Summary:")
    print()
    
    campaigns_count = await db.campaigns.count_documents({})
    actions_count = await db.actions.count_documents({"campaign_key": DEFAULT_CAMPAIGN_KEY})
    links_count = await db.mentor_links.count_documents({"campaign_key": DEFAULT_CAMPAIGN_KEY})
    events_count = await db.mentor_events.count_documents({"campaign_key": DEFAULT_CAMPAIGN_KEY})
    mentors_count = await db.mentors.count_documents({})
    
    print(f"  📁 Campaigns: {campaigns_count}")
    print(f"  ⚡ Actions in '{DEFAULT_CAMPAIGN_KEY}': {actions_count}")
    print(f"  🔗 Links in '{DEFAULT_CAMPAIGN_KEY}': {links_count}")
    print(f"  📊 Events in '{DEFAULT_CAMPAIGN_KEY}': {events_count}")
    print(f"  👤 Mentors (shared across campaigns): {mentors_count}")
    print()
    
    print("✨ Migration completed successfully!")
    print()
    print("📝 Next steps:")
    print("  1. Restart backend to load new routes")
    print("  2. Update frontend to use /:campaign/:slug routing")
    print("  3. Test with /cpn/noel-rivera")
    print("  4. Create new campaigns via admin panel")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(migrate_to_multi_campaign())
