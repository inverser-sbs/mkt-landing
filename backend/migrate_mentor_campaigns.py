"""
Migration script: Create mentor_campaigns from existing mentor_links
This ensures backward compatibility by auto-assigning mentors to campaigns
based on their existing links.
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from datetime import datetime

async def migrate():
    client = AsyncIOMotorClient(os.environ.get('MONGO_URL'))
    db = client[os.environ.get('DB_NAME', 'test_database')]
    
    print("=" * 60)
    print("MIGRATION: Create mentor_campaigns from existing data")
    print("=" * 60)
    
    # Create index
    print("\n1. Creating indexes...")
    await db.mentor_campaigns.create_index(
        [("mentor_id", 1), ("campaign_key", 1)],
        unique=True
    )
    await db.mentor_campaigns.create_index([("campaign_key", 1)])
    await db.mentor_campaigns.create_index([("mentor_id", 1)])
    print("   ✅ Indexes created")
    
    # Get all mentors
    mentors = await db.mentors.find({}).to_list(1000)
    print(f"\n2. Found {len(mentors)} mentors")
    
    # Get all campaigns
    campaigns = await db.campaigns.find({}).to_list(100)
    campaign_keys = {c["key"] for c in campaigns}
    print(f"   Found {len(campaigns)} campaigns: {list(campaign_keys)}")
    
    # For each mentor, find which campaigns they have links in
    assignments_created = 0
    for mentor in mentors:
        mentor_id = mentor.get("id")
        if not mentor_id:
            continue
        
        # Find unique campaign_keys from mentor_links
        links = await db.mentor_links.find({"mentor_id": mentor_id}).to_list(1000)
        mentor_campaigns = set()
        for link in links:
            ck = link.get("campaign_key")
            if ck and ck in campaign_keys:
                mentor_campaigns.add(ck)
        
        # Also check magic_tokens
        tokens = await db.magic_tokens.find({"mentor_id": mentor_id}).to_list(100)
        for token in tokens:
            ck = token.get("campaign_key")
            if ck and ck in campaign_keys:
                mentor_campaigns.add(ck)
        
        # Create assignments
        for campaign_key in mentor_campaigns:
            # Check if already exists
            existing = await db.mentor_campaigns.find_one({
                "mentor_id": mentor_id,
                "campaign_key": campaign_key
            })
            if not existing:
                await db.mentor_campaigns.insert_one({
                    "mentor_id": mentor_id,
                    "campaign_key": campaign_key,
                    "status": "active",
                    "created_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow()
                })
                assignments_created += 1
                print(f"   ✅ {mentor.get('first_name', 'Unknown')} -> {campaign_key}")
    
    print(f"\n3. Created {assignments_created} campaign assignments")
    
    # Summary
    total_assignments = await db.mentor_campaigns.count_documents({})
    print(f"\n" + "=" * 60)
    print(f"MIGRATION COMPLETE")
    print(f"Total mentor_campaigns: {total_assignments}")
    print("=" * 60)
    
    client.close()

if __name__ == "__main__":
    asyncio.run(migrate())
