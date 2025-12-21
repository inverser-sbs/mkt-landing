"""
TEST: Campaign Isolation Verification
Verifies that operations on one campaign do NOT affect other campaigns.
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
import sys
from datetime import datetime

sys.path.insert(0, '/app/backend')

async def test_campaign_isolation():
    print('=' * 60)
    print('TEST: Campaign Isolation Verification')
    print('=' * 60)
    
    client = AsyncIOMotorClient(os.environ.get('MONGO_URL'))
    db = client['test_database']
    
    from services.action_service import ActionService
    service = ActionService(db)
    
    # Get mentor ID
    mentor = await db.mentors.find_one({})
    mentor_id = mentor['id']
    
    print(f'\nUsing mentor: {mentor_id}')
    
    # Setup: Create test data for two campaigns
    print('\n1. SETUP: Creating test data for Campaign A (cpn) and Campaign B (suitex)...')
    
    # Clean up any existing test data
    await db.actions.delete_many({'action_key': {'$regex': 'test_isolation'}})
    await db.mentor_links.delete_many({'action_key': {'$regex': 'test_isolation'}})
    
    # Create test action in Campaign A
    result_a = await db.actions.insert_one({
        'campaign_key': 'cpn',
        'action_key': 'test_isolation_a',
        'button_key': 'test',
        'label': 'Test A',
        'active': True,
        'status': 'active',
        'order': 99,
        'display_slots': ['cta'],
        'created_at': datetime.utcnow(),
        'updated_at': datetime.utcnow()
    })
    action_a_id = str(result_a.inserted_id)
    
    # Create test action in Campaign B
    result_b = await db.actions.insert_one({
        'campaign_key': 'suitex',
        'action_key': 'test_isolation_b',
        'button_key': 'test',
        'label': 'Test B',
        'active': True,
        'status': 'active',
        'order': 99,
        'display_slots': ['cta'],
        'created_at': datetime.utcnow(),
        'updated_at': datetime.utcnow()
    })
    action_b_id = str(result_b.inserted_id)
    
    # Create mentor_links for both campaigns
    await db.mentor_links.insert_one({
        'mentor_id': mentor_id,
        'campaign_key': 'cpn',
        'action_key': 'test_isolation_a',
        'url': 'https://campaign-a.example.com',
        'created_at': datetime.utcnow(),
        'updated_at': datetime.utcnow()
    })
    
    await db.mentor_links.insert_one({
        'mentor_id': mentor_id,
        'campaign_key': 'suitex',
        'action_key': 'test_isolation_b',
        'url': 'https://campaign-b.example.com',
        'created_at': datetime.utcnow(),
        'updated_at': datetime.utcnow()
    })
    
    print(f'   Created action in cpn: {action_a_id}')
    print(f'   Created action in suitex: {action_b_id}')
    
    # Count before
    links_cpn_before = await db.mentor_links.count_documents({'campaign_key': 'cpn', 'action_key': 'test_isolation_a'})
    links_suitex_before = await db.mentor_links.count_documents({'campaign_key': 'suitex', 'action_key': 'test_isolation_b'})
    
    print(f'\n2. BEFORE TESTS:')
    print(f'   Test links in cpn: {links_cpn_before}')
    print(f'   Test links in suitex: {links_suitex_before}')
    
    # =========================================
    # TEST 1: Force delete in Campaign A
    # =========================================
    print('\n3. TEST 1: Force delete action in cpn (Campaign A)...')
    
    # Force delete the action in Campaign A
    success = await service.delete_action(action_a_id, force=True)
    print(f'   Delete result: {success}')
    
    # Verify Campaign B is untouched
    link_b_after = await db.mentor_links.find_one({
        'campaign_key': 'suitex',
        'action_key': 'test_isolation_b'
    })
    action_b_after = await db.actions.find_one({'_id': result_b.inserted_id})
    
    test1_passed = link_b_after is not None and action_b_after is not None
    if test1_passed:
        print('   ✅ TEST 1 PASSED: Campaign B (suitex) was NOT affected by force delete')
    else:
        print('   ❌ TEST 1 FAILED: Campaign B was modified!')
        if not link_b_after:
            print('      - Link in suitex was deleted!')
        if not action_b_after:
            print('      - Action in suitex was deleted!')
    
    # =========================================
    # TEST 2: Cleanup orphans
    # =========================================
    print('\n4. TEST 2: Cleanup orphans should not affect valid data...')
    
    # Add an orphan link (mentor that doesn't exist) in cpn
    await db.mentor_links.insert_one({
        'mentor_id': 'nonexistent-mentor-xyz',
        'campaign_key': 'cpn',
        'action_key': 'some_action',
        'url': 'https://orphan.example.com',
        'created_at': datetime.utcnow(),
        'updated_at': datetime.utcnow()
    })
    
    # Run cleanup
    cleanup_result = await service.cleanup_orphan_data()
    print(f'   Cleanup result: {cleanup_result}')
    
    # Verify valid data in suitex still exists
    link_b_after_cleanup = await db.mentor_links.find_one({
        'campaign_key': 'suitex',
        'action_key': 'test_isolation_b',
        'mentor_id': mentor_id
    })
    
    test2_passed = link_b_after_cleanup is not None
    if test2_passed:
        print('   ✅ TEST 2 PASSED: Valid campaign data was preserved')
    else:
        print('   ❌ TEST 2 FAILED: Valid campaign data was deleted!')
    
    # =========================================
    # TEST 3: Replace action isolation
    # =========================================
    print('\n5. TEST 3: Replace action should only affect specified campaign...')
    
    # Recreate action A for replace test
    await db.actions.insert_one({
        'campaign_key': 'cpn',
        'action_key': 'test_isolation_old',
        'button_key': 'test',
        'label': 'Old Action',
        'active': True,
        'status': 'active',
        'order': 98,
        'display_slots': ['cta'],
        'created_at': datetime.utcnow(),
        'updated_at': datetime.utcnow()
    })
    await db.actions.insert_one({
        'campaign_key': 'cpn',
        'action_key': 'test_isolation_new',
        'button_key': 'test',
        'label': 'New Action',
        'active': True,
        'status': 'active',
        'order': 97,
        'display_slots': ['cta'],
        'created_at': datetime.utcnow(),
        'updated_at': datetime.utcnow()
    })
    
    # Create link for old action
    await db.mentor_links.insert_one({
        'mentor_id': mentor_id,
        'campaign_key': 'cpn',
        'action_key': 'test_isolation_old',
        'url': 'https://old-action.example.com',
        'created_at': datetime.utcnow(),
        'updated_at': datetime.utcnow()
    })
    
    # Run replace
    replace_result = await service.replace_action('cpn', 'test_isolation_old', 'test_isolation_new')
    print(f'   Replace result: {replace_result}')
    
    # Verify Campaign B links are untouched
    link_b_after_replace = await db.mentor_links.find_one({
        'campaign_key': 'suitex',
        'action_key': 'test_isolation_b'
    })
    
    test3_passed = (link_b_after_replace is not None and 
                   link_b_after_replace.get('url') == 'https://campaign-b.example.com')
    if test3_passed:
        print('   ✅ TEST 3 PASSED: Campaign B links were NOT modified by replace')
    else:
        print('   ❌ TEST 3 FAILED: Campaign B links were modified!')
    
    # =========================================
    # Cleanup
    # =========================================
    print('\n6. CLEANUP: Removing test data...')
    await db.actions.delete_many({'action_key': {'$regex': 'test_isolation'}})
    await db.mentor_links.delete_many({'action_key': {'$regex': 'test_isolation'}})
    
    # =========================================
    # Summary
    # =========================================
    print('\n' + '=' * 60)
    all_passed = test1_passed and test2_passed and test3_passed
    if all_passed:
        print('✅ ALL CAMPAIGN ISOLATION TESTS PASSED')
    else:
        print('❌ SOME TESTS FAILED - REVIEW ABOVE')
    print('=' * 60)
    
    client.close()
    return all_passed

if __name__ == "__main__":
    result = asyncio.run(test_campaign_isolation())
    exit(0 if result else 1)
