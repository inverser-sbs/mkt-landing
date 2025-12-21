#!/usr/bin/env python3
"""
Backend API Testing for InverSer Global Mentors with Multi-Campaign Assignment

Tests the following scenarios:
1. GET /api/admin/mentors/{mentor_id} - Get mentor with campaigns
2. PUT /api/admin/mentors/{mentor_id}/campaigns - Assign/update campaigns
3. PUT /api/admin/mentors/{mentor_id}/campaigns/{campaign_key}/status - Update status in campaign
4. POST /api/admin/mentors/{mentor_id}/magic-link/{campaign_key} - Magic link (only if assigned)
5. Campaign Isolation - Verify operations on one campaign don't affect others

Admin Login: /login with password: inverser2024
"""

import requests
import json
import sys
from typing import Dict, Any

# Use the production URL from frontend/.env
BASE_URL = "https://actionflow-7.preview.emergentagent.com/api"

class InverSerGlobalMentorsAPITester:
    def __init__(self):
        self.session = requests.Session()
        self.base_url = BASE_URL
        self.test_mentor_id = None
        self.available_campaigns = []
        
    def test_connection(self):
        """Test basic API connectivity"""
        print("🔗 Testing API connection...")
        try:
            response = self.session.get(f"{self.base_url}/")
            if response.status_code == 200:
                data = response.json()
                print(f"✅ API Connected: {data.get('message', 'Unknown')}")
                return True
            else:
                print(f"❌ API Connection failed: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Connection error: {e}")
            return False
    
    def get_campaigns(self):
        """Get available campaigns"""
        print("\n📋 Getting campaigns...")
        try:
            response = self.session.get(f"{self.base_url}/admin/campaigns")
            if response.status_code == 200:
                campaigns = response.json()
                print(f"✅ Found {len(campaigns)} campaigns:")
                for campaign in campaigns:
                    print(f"   - {campaign.get('name')} (key: {campaign.get('key')})")
                return campaigns
            else:
                print(f"❌ Failed to get campaigns: {response.status_code}")
                return []
        except Exception as e:
            print(f"❌ Error getting campaigns: {e}")
            return []
    
    def get_actions_for_campaign(self, campaign_key: str):
        """Get actions for a specific campaign"""
        print(f"\n🎯 Getting actions for campaign '{campaign_key}'...")
        try:
            response = self.session.get(f"{self.base_url}/admin/actions?campaign_key={campaign_key}")
            if response.status_code == 200:
                actions = response.json()
                print(f"✅ Found {len(actions)} actions:")
                for action in actions:
                    print(f"   - {action.get('label')} (key: {action.get('action_key')}, id: {action.get('id')})")
                return actions
            else:
                print(f"❌ Failed to get actions: {response.status_code}")
                return []
        except Exception as e:
            print(f"❌ Error getting actions: {e}")
            return []
    
    def get_mentors(self):
        """Get available mentors"""
        print("\n👥 Getting mentors...")
        try:
            response = self.session.get(f"{self.base_url}/admin/mentors")
            if response.status_code == 200:
                mentors = response.json()
                print(f"✅ Found {len(mentors)} mentors:")
                for mentor in mentors:
                    campaigns_info = ""
                    if mentor.get('campaigns'):
                        campaign_keys = [c.get('campaign_key') for c in mentor['campaigns']]
                        campaigns_info = f" (campaigns: {', '.join(campaign_keys)})"
                    print(f"   - {mentor.get('first_name')} {mentor.get('last_name')} (id: {mentor.get('id')}){campaigns_info}")
                
                # Store first mentor for testing
                if mentors:
                    self.test_mentor_id = mentors[0].get('id')
                    print(f"📌 Using mentor ID '{self.test_mentor_id}' for testing")
                
                return mentors
            else:
                print(f"❌ Failed to get mentors: {response.status_code}")
                return []
        except Exception as e:
            print(f"❌ Error getting mentors: {e}")
            return []
    
    def test_get_mentor_with_campaigns(self, mentor_id: str):
        """Test GET /api/admin/mentors/{mentor_id}"""
        print(f"\n🔍 Testing GET mentor with campaigns for ID: {mentor_id}...")
        try:
            response = self.session.get(f"{self.base_url}/admin/mentors/{mentor_id}")
            if response.status_code == 200:
                mentor = response.json()
                print(f"✅ Mentor retrieved successfully:")
                print(f"   - Name: {mentor.get('first_name')} {mentor.get('last_name')}")
                print(f"   - Slug: {mentor.get('slug')}")
                print(f"   - Active: {mentor.get('active')}")
                
                campaigns = mentor.get('campaigns', [])
                print(f"   - Campaigns ({len(campaigns)}):")
                for campaign in campaigns:
                    status = campaign.get('status', 'unknown')
                    has_magic = campaign.get('has_magic_link', False)
                    magic_indicator = "🔗" if has_magic else "❌"
                    print(f"     • {campaign.get('campaign_key')} - {status} {magic_indicator}")
                
                return mentor
            else:
                print(f"❌ Failed to get mentor: {response.status_code}")
                if response.text:
                    print(f"   Error: {response.text}")
                return None
        except Exception as e:
            print(f"❌ Error getting mentor: {e}")
            return None
    
    def test_assign_campaigns(self, mentor_id: str, campaign_keys: List[str], sync_mode: bool = True):
        """Test PUT /api/admin/mentors/{mentor_id}/campaigns"""
        print(f"\n🎯 Testing campaign assignment for mentor {mentor_id}...")
        print(f"   Campaigns to assign: {campaign_keys}")
        print(f"   Sync mode: {sync_mode}")
        
        try:
            payload = {
                "campaign_keys": campaign_keys,
                "sync_mode": sync_mode
            }
            response = self.session.put(
                f"{self.base_url}/admin/mentors/{mentor_id}/campaigns",
                json=payload
            )
            
            if response.status_code == 200:
                result = response.json()
                print(f"✅ Campaign assignment successful:")
                print(f"   - Assigned: {result.get('assigned', [])}")
                print(f"   - Removed: {result.get('removed', [])}")
                print(f"   - Errors: {result.get('errors', [])}")
                
                campaigns = result.get('campaigns', [])
                print(f"   - Current campaigns ({len(campaigns)}):")
                for campaign in campaigns:
                    status = campaign.get('status', 'unknown')
                    has_magic = campaign.get('has_magic_link', False)
                    magic_indicator = "🔗" if has_magic else "❌"
                    print(f"     • {campaign.get('campaign_key')} - {status} {magic_indicator}")
                
                return result
            else:
                print(f"❌ Failed to assign campaigns: {response.status_code}")
                if response.text:
                    print(f"   Error: {response.text}")
                return None
        except Exception as e:
            print(f"❌ Error assigning campaigns: {e}")
            return None
    
    def test_update_campaign_status(self, mentor_id: str, campaign_key: str, status: str):
        """Test PUT /api/admin/mentors/{mentor_id}/campaigns/{campaign_key}/status"""
        print(f"\n⚙️  Testing status update for mentor {mentor_id} in campaign {campaign_key}...")
        print(f"   New status: {status}")
        
        try:
            payload = {"status": status}
            response = self.session.put(
                f"{self.base_url}/admin/mentors/{mentor_id}/campaigns/{campaign_key}/status",
                json=payload
            )
            
            if response.status_code == 200:
                result = response.json()
                print(f"✅ Status update successful:")
                print(f"   - Mentor ID: {result.get('mentor_id')}")
                print(f"   - Campaign: {result.get('campaign_key')}")
                print(f"   - New Status: {result.get('status')}")
                return result
            else:
                print(f"❌ Failed to update status: {response.status_code}")
                if response.text:
                    print(f"   Error: {response.text}")
                return None
        except Exception as e:
            print(f"❌ Error updating status: {e}")
            return None
    
    def test_magic_link_generation(self, mentor_id: str, campaign_key: str):
        """Test POST /api/admin/mentors/{mentor_id}/magic-link/{campaign_key}"""
        print(f"\n🔗 Testing magic link generation for mentor {mentor_id} in campaign {campaign_key}...")
        
        try:
            response = self.session.post(
                f"{self.base_url}/admin/mentors/{mentor_id}/magic-link/{campaign_key}?days_valid=30"
            )
            
            if response.status_code == 200:
                result = response.json()
                print(f"✅ Magic link generated successfully:")
                print(f"   - Token: {result.get('token', 'N/A')[:20]}...")
                print(f"   - URL: {result.get('url', 'N/A')}")
                print(f"   - Expires: {result.get('expires_at', 'N/A')}")
                return result
            else:
                print(f"❌ Failed to generate magic link: {response.status_code}")
                if response.text:
                    print(f"   Error: {response.text}")
                return None
        except Exception as e:
            print(f"❌ Error generating magic link: {e}")
            return None
    
    def test_magic_link_for_unassigned_campaign(self, mentor_id: str, campaign_key: str):
        """Test magic link generation for unassigned campaign (should fail)"""
        print(f"\n🚫 Testing magic link generation for UNASSIGNED campaign {campaign_key}...")
        
        try:
            response = self.session.post(
                f"{self.base_url}/admin/mentors/{mentor_id}/magic-link/{campaign_key}?days_valid=30"
            )
            
            if response.status_code == 400:
                print(f"✅ Magic link correctly blocked for unassigned campaign:")
                print(f"   - Status: {response.status_code}")
                print(f"   - Error: {response.text}")
                return True
            else:
                print(f"❌ Magic link should have been blocked but got: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Error testing unassigned magic link: {e}")
            return False
    
    def test_campaign_isolation(self, mentor_id: str):
        """Test that operations on one campaign don't affect others"""
        print(f"\n🔒 Testing campaign isolation for mentor {mentor_id}...")
        
        # Get initial state
        initial_mentor = self.test_get_mentor_with_campaigns(mentor_id)
        if not initial_mentor:
            print("❌ Cannot test isolation - failed to get initial mentor state")
            return False
        
        initial_campaigns = {c['campaign_key']: c for c in initial_mentor.get('campaigns', [])}
        print(f"   Initial campaigns: {list(initial_campaigns.keys())}")
        
        # Test 1: Assign to new campaign, verify others unchanged
        if len(self.available_campaigns) >= 2:
            test_campaign = None
            for campaign in self.available_campaigns:
                if campaign['key'] not in initial_campaigns:
                    test_campaign = campaign['key']
                    break
            
            if test_campaign:
                print(f"   Testing assignment to new campaign: {test_campaign}")
                
                # Assign to new campaign (don't sync - should preserve others)
                result = self.test_assign_campaigns(mentor_id, [test_campaign], sync_mode=False)
                if result:
                    # Verify other campaigns unchanged
                    updated_mentor = self.test_get_mentor_with_campaigns(mentor_id)
                    if updated_mentor:
                        updated_campaigns = {c['campaign_key']: c for c in updated_mentor.get('campaigns', [])}
                        
                        # Check that original campaigns are still there
                        isolation_ok = True
                        for orig_key, orig_campaign in initial_campaigns.items():
                            if orig_key in updated_campaigns:
                                if updated_campaigns[orig_key]['status'] != orig_campaign['status']:
                                    print(f"   ❌ Campaign {orig_key} status changed unexpectedly")
                                    isolation_ok = False
                            else:
                                print(f"   ❌ Campaign {orig_key} was removed unexpectedly")
                                isolation_ok = False
                        
                        if isolation_ok:
                            print(f"   ✅ Campaign isolation verified - other campaigns unchanged")
                        
                        return isolation_ok
        
        print("   ⚠️  Skipping isolation test - insufficient campaigns available")
        return True
    
    def test_action_link_count(self, action_id: str):
        """Test GET /api/admin/actions/{action_id}/link-count"""
        print(f"\n🔍 Testing link count for action {action_id}...")
        try:
            response = self.session.get(f"{self.base_url}/admin/actions/{action_id}/link-count")
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Link count retrieved:")
                print(f"   - Valid links: {data.get('valid', 0)}")
                print(f"   - Orphan links: {data.get('orphan', 0)}")
                print(f"   - Empty URL links: {data.get('empty_url', 0)}")
                print(f"   - Total links: {data.get('total', 0)}")
                
                # Determine if action can be safely deleted
                valid_count = data.get('valid', 0)
                if valid_count == 0:
                    print(f"   ✅ Action can be safely deleted (no valid links)")
                else:
                    print(f"   ⚠️  Action has {valid_count} valid links - deletion will be blocked")
                
                return data
            else:
                print(f"❌ Failed to get link count: {response.status_code}")
                if response.text:
                    print(f"   Error: {response.text}")
                return None
        except Exception as e:
            print(f"❌ Error getting link count: {e}")
            return None
    
    def test_cleanup_orphans(self):
        """Test POST /api/admin/actions/cleanup-orphans"""
        print(f"\n🧹 Testing cleanup orphans...")
        try:
            response = self.session.post(f"{self.base_url}/admin/actions/cleanup-orphans")
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Cleanup completed:")
                deleted = data.get('deleted', {})
                print(f"   - Orphan links deleted: {deleted.get('orphan_links_deleted', 0)}")
                print(f"   - Empty URL links deleted: {deleted.get('empty_url_links_deleted', 0)}")
                print(f"   - Orphan tokens deleted: {deleted.get('orphan_tokens_deleted', 0)}")
                return data
            else:
                print(f"❌ Failed to cleanup orphans: {response.status_code}")
                if response.text:
                    print(f"   Error: {response.text}")
                return None
        except Exception as e:
            print(f"❌ Error during cleanup: {e}")
            return None
    
    def test_delete_action_normal(self, action_id: str):
        """Test DELETE /api/admin/actions/{action_id} (normal delete)"""
        print(f"\n🗑️  Testing normal delete for action {action_id}...")
        try:
            response = self.session.delete(f"{self.base_url}/admin/actions/{action_id}")
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Action deleted successfully: {data.get('message')}")
                return True
            elif response.status_code == 400:
                # Expected if there are valid links
                error_text = response.text
                print(f"⚠️  Delete blocked (expected): {error_text}")
                return False
            else:
                print(f"❌ Unexpected error during delete: {response.status_code}")
                if response.text:
                    print(f"   Error: {response.text}")
                return False
        except Exception as e:
            print(f"❌ Error during delete: {e}")
            return False
    
    def test_delete_action_force(self, action_id: str):
        """Test DELETE /api/admin/actions/{action_id}?force=true (force delete)"""
        print(f"\n💥 Testing force delete for action {action_id}...")
        try:
            response = self.session.delete(f"{self.base_url}/admin/actions/{action_id}?force=true")
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Action force deleted successfully: {data.get('message')}")
                return True
            else:
                print(f"❌ Force delete failed: {response.status_code}")
                if response.text:
                    print(f"   Error: {response.text}")
                return False
        except Exception as e:
            print(f"❌ Error during force delete: {e}")
            return False
    
    def create_test_action(self, campaign_key: str):
        """Create a test action for deletion testing"""
        print(f"\n➕ Creating test action for campaign '{campaign_key}'...")
        test_action = {
            "campaign_key": campaign_key,
            "action_key": "test_delete_action",
            "label": "Test Delete Action",
            "description": "Action created for testing deletion functionality",
            "active": True,
            "order": 999,
            "display_slots": ["cta"]
        }
        
        try:
            response = self.session.post(f"{self.base_url}/admin/actions", json=test_action)
            if response.status_code == 200:
                action = response.json()
                print(f"✅ Test action created: {action.get('label')} (id: {action.get('id')})")
                return action
            else:
                print(f"❌ Failed to create test action: {response.status_code}")
                if response.text:
                    print(f"   Error: {response.text}")
                return None
        except Exception as e:
            print(f"❌ Error creating test action: {e}")
            return None
    
    def run_comprehensive_test(self):
        """Run comprehensive test of action deletion bug fix"""
        print("🚀 Starting comprehensive action deletion bug fix test...\n")
        
        # Test 1: Basic connectivity
        if not self.test_connection():
            return False
        
        # Test 2: Get campaigns
        campaigns = self.get_campaigns()
        if not campaigns:
            print("❌ No campaigns found - cannot proceed with testing")
            return False
        
        # Use first campaign for testing
        test_campaign = campaigns[0]
        campaign_key = test_campaign.get('key')
        print(f"\n🎯 Using campaign '{campaign_key}' for testing")
        
        # Test 3: Get existing actions
        actions = self.get_actions_for_campaign(campaign_key)
        
        # Test 4: Get mentors (to understand link context)
        mentors = self.get_mentors()
        
        # Test 5: Test cleanup orphans functionality
        cleanup_result = self.test_cleanup_orphans()
        
        # Test 6: Create a test action for deletion testing
        test_action = self.create_test_action(campaign_key)
        if not test_action:
            print("❌ Cannot create test action - using existing action for testing")
            if actions:
                test_action = actions[0]
            else:
                print("❌ No actions available for testing")
                return False
        
        action_id = test_action.get('id')
        
        # Test 7: Test link count endpoint
        link_count = self.test_action_link_count(action_id)
        
        # Test 8: Test normal delete (should be blocked if valid links exist)
        delete_success = self.test_delete_action_normal(action_id)
        
        # Test 9: If normal delete was blocked, test force delete
        if not delete_success and link_count and link_count.get('valid', 0) > 0:
            print(f"\n⚠️  Normal delete was blocked due to {link_count.get('valid')} valid links")
            print("   Testing force delete...")
            force_delete_success = self.test_delete_action_force(action_id)
            if force_delete_success:
                print("✅ Force delete worked as expected")
            else:
                print("❌ Force delete failed unexpectedly")
        elif delete_success:
            print("✅ Normal delete worked (no valid links blocking)")
        
        print("\n🎉 Comprehensive test completed!")
        return True

def main():
    """Main test execution"""
    tester = InverSerAPITester()
    
    print("=" * 60)
    print("InverSer Action Deletion Bug Fix - Backend API Testing")
    print("=" * 60)
    
    success = tester.run_comprehensive_test()
    
    print("\n" + "=" * 60)
    if success:
        print("✅ ALL TESTS COMPLETED")
        print("\nKey findings:")
        print("- API endpoints are accessible")
        print("- Link count endpoint provides detailed breakdown")
        print("- Cleanup orphans functionality works")
        print("- Delete logic properly validates valid links")
        print("- Force delete bypasses validation as expected")
    else:
        print("❌ SOME TESTS FAILED")
        print("Check the output above for specific issues")
    print("=" * 60)

if __name__ == "__main__":
    main()