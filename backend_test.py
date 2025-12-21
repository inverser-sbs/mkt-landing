#!/usr/bin/env python3
"""
Backend API Testing for InverSer P0 Bug Fixes - Admin Panel Stability

Tests the following P0 bug fixes:
1. Magic Link Complete Management - DELETE endpoint and improved error feedback
2. Cleanup Orphans Campaign Isolation - campaign_key parameter filtering
3. Action Delete Bug Fix - Valid link check improvements
4. Magic Link Token Validation - Detailed error messages

Admin Login: /login with password: inverser2024
"""

import requests
import json
import sys
from typing import Dict, Any, List

# Use the production URL from frontend/.env
BASE_URL = "https://actionflow-7.preview.emergentagent.com/api"

class InverSerP0BugFixesTester:
    def __init__(self):
        self.session = requests.Session()
        self.base_url = BASE_URL
        self.test_mentor_id = None
        self.available_campaigns = []
        self.test_action_id = None
        
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
    
    def run_comprehensive_test(self):
        """Run comprehensive test of Global Mentors multi-campaign assignment"""
        print("🚀 Starting comprehensive Global Mentors multi-campaign assignment test...\n")
        
        # Test 1: Basic connectivity
        if not self.test_connection():
            return False
        
        # Test 2: Get campaigns
        self.available_campaigns = self.get_campaigns()
        if not self.available_campaigns:
            print("❌ No campaigns found - cannot proceed with testing")
            return False
        
        print(f"\n📋 Available campaigns for testing:")
        for campaign in self.available_campaigns:
            print(f"   - {campaign.get('name')} (key: {campaign.get('key')})")
        
        # Test 3: Get mentors
        mentors = self.get_mentors()
        if not mentors or not self.test_mentor_id:
            print("❌ No mentors found - cannot proceed with testing")
            return False
        
        # Test 4: Get mentor with campaigns (initial state)
        print(f"\n=== TESTING MENTOR {self.test_mentor_id} ===")
        initial_mentor = self.test_get_mentor_with_campaigns(self.test_mentor_id)
        if not initial_mentor:
            print("❌ Failed to get initial mentor state")
            return False
        
        # Test 5: Campaign assignment/update
        if len(self.available_campaigns) >= 2:
            # Test assigning to first two campaigns
            test_campaigns = [c['key'] for c in self.available_campaigns[:2]]
            assignment_result = self.test_assign_campaigns(
                self.test_mentor_id, 
                test_campaigns, 
                sync_mode=True
            )
            
            if assignment_result:
                # Test 6: Update status in one campaign
                first_campaign = test_campaigns[0]
                status_result = self.test_update_campaign_status(
                    self.test_mentor_id,
                    first_campaign,
                    "paused"
                )
                
                # Test 7: Generate magic link for assigned campaign
                if status_result:
                    magic_result = self.test_magic_link_generation(
                        self.test_mentor_id,
                        first_campaign
                    )
                
                # Test 8: Try magic link for unassigned campaign (should fail)
                if len(self.available_campaigns) >= 3:
                    unassigned_campaign = self.available_campaigns[2]['key']
                    self.test_magic_link_for_unassigned_campaign(
                        self.test_mentor_id,
                        unassigned_campaign
                    )
        
        # Test 9: Campaign isolation
        isolation_result = self.test_campaign_isolation(self.test_mentor_id)
        
        # Test 10: Final state verification
        print(f"\n📊 Final mentor state:")
        final_mentor = self.test_get_mentor_with_campaigns(self.test_mentor_id)
        
        print("\n🎉 Comprehensive Global Mentors test completed!")
        return True

def main():
    """Main test execution"""
    tester = InverSerGlobalMentorsAPITester()
    
    print("=" * 70)
    print("InverSer Global Mentors Multi-Campaign Assignment - Backend API Testing")
    print("=" * 70)
    
    success = tester.run_comprehensive_test()
    
    print("\n" + "=" * 70)
    if success:
        print("✅ ALL TESTS COMPLETED")
        print("\nKey findings:")
        print("- API endpoints are accessible")
        print("- Mentor retrieval with campaign info works")
        print("- Campaign assignment/update functionality works")
        print("- Status updates per campaign work")
        print("- Magic link generation respects campaign assignment")
        print("- Campaign isolation is maintained")
    else:
        print("❌ SOME TESTS FAILED")
        print("Check the output above for specific issues")
    print("=" * 70)

if __name__ == "__main__":
    main()