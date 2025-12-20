from motor.motor_asyncio import AsyncIOMotorDatabase
from models.event import Event, EventCreate, EventStats
from datetime import datetime, timedelta
from typing import List, Dict
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
        event_dict = event_data.dict()
        event_dict["timestamp"] = datetime.utcnow()
        
        if ip:
            event_dict["ip_hash"] = self._hash_ip(ip)
        
        result = await self.collection.insert_one(event_dict)
        event_dict["id"] = str(result.inserted_id)
        event_dict["_id"] = result.inserted_id
        
        return Event(**event_dict)
    
    async def get_mentor_stats(self, mentor_id: str, days: int = 30) -> EventStats:
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        cutoff_7d = datetime.utcnow() - timedelta(days=7)
        
        # Get mentor info
        mentor = await self.db.mentors.find_one({"_id": ObjectId(mentor_id)})
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
        """Get stats for all mentors"""
        stats = []
        async for mentor in self.db.mentors.find({}):
            try:
                mentor_stats = await self.get_mentor_stats(str(mentor["_id"]), days)
                stats.append(mentor_stats)
            except Exception as e:
                print(f"Error getting stats for mentor {mentor['_id']}: {e}")
                continue
        
        # Sort by visits_30d descending
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