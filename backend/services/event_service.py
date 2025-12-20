from motor.motor_asyncio import AsyncIOMotorDatabase
from models.event import Event, EventCreate, EventStats
from datetime import datetime, timedelta
from typing import List, Dict, Optional
import hashlib
from collections import defaultdict
from bson import ObjectId

class EventService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.collection = db.mentor_events
    
    def _hash_ip(self, ip: str) -> str:
        """Hash IP for privacy"""
        return hashlib.sha256(ip.encode()).hexdigest()[:16]
    
    async def track_event(self, event_data: EventCreate, ip: str = None) -> Event:
        # If mentor_id looks like a slug (contains hyphen), convert to ID
        mentor_id = event_data.mentor_id
        if '-' in mentor_id:
            # It's a slug, need to find the mentor ID
            mentor = await self.db.mentors.find_one({"slug": mentor_id})
            if mentor:
                mentor_id = str(mentor["_id"])
        
        event_dict = event_data.dict()
        event_dict["mentor_id"] = mentor_id
        event_dict["timestamp"] = datetime.utcnow()
        
        if ip:
            event_dict["ip_hash"] = self._hash_ip(ip)
        
        result = await self.collection.insert_one(event_dict)
        event_dict["id"] = str(result.inserted_id)
        event_dict["_id"] = result.inserted_id
        
        return Event(**event_dict)
    
    async def get_campaign_stats(self, campaign_key: str, days: int = 30) -> Dict:
        """
        Get aggregated stats for a specific campaign.
        Returns KPIs: total_visits, total_clicks, active_mentors, ctr
        """
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        
        # Total visits for campaign
        total_visits = await self.collection.count_documents({
            "campaign_key": campaign_key,
            "event_type": "visit",
            "timestamp": {"$gte": cutoff_date}
        })
        
        # Total clicks for campaign
        total_clicks = await self.collection.count_documents({
            "campaign_key": campaign_key,
            "event_type": "click",
            "timestamp": {"$gte": cutoff_date}
        })
        
        # Active mentors (mentors with at least one visit in period)
        pipeline = [
            {
                "$match": {
                    "campaign_key": campaign_key,
                    "event_type": "visit",
                    "timestamp": {"$gte": cutoff_date}
                }
            },
            {
                "$group": {
                    "_id": "$mentor_id"
                }
            },
            {
                "$count": "active_mentors"
            }
        ]
        
        active_mentors_result = await self.collection.aggregate(pipeline).to_list(1)
        active_mentors = active_mentors_result[0]["active_mentors"] if active_mentors_result else 0
        
        # Calculate CTR
        ctr = (total_clicks / total_visits * 100) if total_visits > 0 else 0
        
        return {
            "total_visits": total_visits,
            "total_clicks": total_clicks,
            "active_mentors": active_mentors,
            "ctr": round(ctr, 2),
            "period_days": days
        }
    
    async def get_mentor_stats_by_campaign(
        self, 
        campaign_key: str, 
        days: int = 30,
        limit: int = 50
    ) -> List[Dict]:
        """
        Get stats for all mentors in a specific campaign.
        Returns list of mentor performance data.
        """
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        
        # Aggregate by mentor
        pipeline = [
            {
                "$match": {
                    "campaign_key": campaign_key,
                    "timestamp": {"$gte": cutoff_date}
                }
            },
            {
                "$group": {
                    "_id": {
                        "mentor_id": "$mentor_id",
                        "event_type": "$event_type"
                    },
                    "count": {"$sum": 1},
                    "last_activity": {"$max": "$timestamp"}
                }
            }
        ]
        
        # Process aggregation results
        mentor_data = defaultdict(lambda: {
            "visits": 0, 
            "clicks": 0, 
            "last_activity": None,
            "clicks_by_action": defaultdict(int)
        })
        
        async for doc in self.collection.aggregate(pipeline):
            mentor_id = doc["_id"]["mentor_id"]
            event_type = doc["_id"]["event_type"]
            
            if event_type == "visit":
                mentor_data[mentor_id]["visits"] = doc["count"]
            elif event_type == "click":
                mentor_data[mentor_id]["clicks"] = doc["count"]
            
            if doc["last_activity"]:
                current_last = mentor_data[mentor_id]["last_activity"]
                if not current_last or doc["last_activity"] > current_last:
                    mentor_data[mentor_id]["last_activity"] = doc["last_activity"]
        
        # Get clicks by action for each mentor
        click_pipeline = [
            {
                "$match": {
                    "campaign_key": campaign_key,
                    "event_type": "click",
                    "timestamp": {"$gte": cutoff_date},
                    "action_key": {"$ne": None}
                }
            },
            {
                "$group": {
                    "_id": {
                        "mentor_id": "$mentor_id",
                        "action_key": "$action_key"
                    },
                    "count": {"$sum": 1}
                }
            }
        ]
        
        async for doc in self.collection.aggregate(click_pipeline):
            mentor_id = doc["_id"]["mentor_id"]
            action_key = doc["_id"]["action_key"]
            mentor_data[mentor_id]["clicks_by_action"][action_key] = doc["count"]
        
        # Build final results with mentor names
        results = []
        for mentor_id, data in mentor_data.items():
            # Get mentor info
            try:
                mentor = await self.db.mentors.find_one({"_id": ObjectId(mentor_id)})
            except:
                mentor = await self.db.mentors.find_one({"slug": mentor_id})
            
            if not mentor:
                continue
            
            # Find most clicked action
            most_clicked = None
            if data["clicks_by_action"]:
                most_clicked = max(data["clicks_by_action"].items(), key=lambda x: x[1])
                most_clicked = {"action": most_clicked[0], "clicks": most_clicked[1]}
            
            results.append({
                "mentor_id": mentor_id,
                "mentor_name": f"{mentor['first_name']} {mentor['last_name']}",
                "mentor_slug": mentor.get('slug', ''),
                "visits": data["visits"],
                "clicks": data["clicks"],
                "ctr": round((data["clicks"] / data["visits"] * 100) if data["visits"] > 0 else 0, 2),
                "most_clicked_action": most_clicked,
                "last_activity": data["last_activity"].isoformat() if data["last_activity"] else None
            })
        
        # Sort by visits descending
        results.sort(key=lambda x: x["visits"], reverse=True)
        
        return results[:limit]
    
    async def get_action_stats_by_campaign(self, campaign_key: str, days: int = 30) -> List[Dict]:
        """
        Get click stats for each action in a specific campaign.
        """
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        
        pipeline = [
            {
                "$match": {
                    "campaign_key": campaign_key,
                    "event_type": "click",
                    "timestamp": {"$gte": cutoff_date},
                    "action_key": {"$ne": None}
                }
            },
            {
                "$group": {
                    "_id": "$action_key",
                    "clicks": {"$sum": 1}
                }
            },
            {
                "$sort": {"clicks": -1}
            }
        ]
        
        results = []
        total_clicks = 0
        
        async for doc in self.collection.aggregate(pipeline):
            results.append({
                "action_key": doc["_id"],
                "clicks": doc["clicks"]
            })
            total_clicks += doc["clicks"]
        
        # Add percentage
        for item in results:
            item["percentage"] = round((item["clicks"] / total_clicks * 100) if total_clicks > 0 else 0, 2)
        
        # Get action labels from database
        for item in results:
            action = await self.db.actions.find_one({
                "campaign_key": campaign_key,
                "action_key": item["action_key"]
            })
            item["label"] = action["label"] if action else item["action_key"]
        
        return results
    
    # Legacy methods (keep for backward compatibility)
    async def get_mentor_stats(self, mentor_id: str, days: int = 30) -> EventStats:
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        cutoff_7d = datetime.utcnow() - timedelta(days=7)
        
        # Get mentor info
        try:
            mentor = await self.db.mentors.find_one({"_id": ObjectId(mentor_id)})
        except:
            mentor = await self.db.mentors.find_one({"slug": mentor_id})
        
        if not mentor:
            raise ValueError("Mentor not found")
        
        mentor_name = f"{mentor['first_name']} {mentor['last_name']}"
        
        # Total visits
        total_visits = await self.collection.count_documents({
            "mentor_id": mentor_id,
            "event_type": "visit"
        })
        
        # Total clicks
        total_clicks = await self.collection.count_documents({
            "mentor_id": mentor_id,
            "event_type": "click"
        })
        
        # Visits last 7 days
        visits_7d = await self.collection.count_documents({
            "mentor_id": mentor_id,
            "event_type": "visit",
            "timestamp": {"$gte": cutoff_7d}
        })
        
        # Visits last 30 days
        visits_30d = await self.collection.count_documents({
            "mentor_id": mentor_id,
            "event_type": "visit",
            "timestamp": {"$gte": cutoff_date}
        })
        
        # Clicks by action
        clicks_by_action = defaultdict(int)
        async for event in self.collection.find({
            "mentor_id": mentor_id,
            "event_type": "click",
            "timestamp": {"$gte": cutoff_date}
        }):
            if event.get("action_key"):
                clicks_by_action[event["action_key"]] += 1
        
        return EventStats(
            mentor_id=mentor_id,
            mentor_name=mentor_name,
            total_visits=total_visits,
            total_clicks=total_clicks,
            visits_7d=visits_7d,
            visits_30d=visits_30d,
            clicks_by_action=dict(clicks_by_action)
        )
    
    async def get_all_stats(self, days: int = 30) -> List[EventStats]:
        """Get stats for all mentors (legacy)"""
        stats = []
        async for mentor in self.db.mentors.find({}):
            try:
                mentor_stats = await self.get_mentor_stats(str(mentor["_id"]), days)
                stats.append(mentor_stats)
            except Exception as e:
                print(f"Error getting stats for mentor {mentor['_id']}: {e}")
                continue
        
        stats.sort(key=lambda x: x.visits_30d, reverse=True)
        return stats
    
    async def get_top_countries(self, mentor_id: str = None, days: int = 30) -> List[Dict]:
        """Get top countries by visits"""
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        
        match_query = {
            "event_type": "visit",
            "timestamp": {"$gte": cutoff_date},
            "country": {"$ne": None}
        }
        
        if mentor_id:
            match_query["mentor_id"] = mentor_id
        
        pipeline = [
            {"$match": match_query},
            {"$group": {
                "_id": "$country",
                "count": {"$sum": 1}
            }},
            {"$sort": {"count": -1}},
            {"$limit": 10}
        ]
        
        results = []
        async for doc in self.collection.aggregate(pipeline):
            results.append({
                "country": doc["_id"],
                "visits": doc["count"]
            })
        
        return results
