from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List, Dict, Optional
import csv
import io
from datetime import datetime
from bson import ObjectId

class CSVService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
    
    async def export_mentors(
        self, 
        filter_type: str = "all",
        group_name: Optional[str] = None
    ) -> str:
        """
        Export mentors to CSV format
        
        Args:
            filter_type: "all", "active", or "group"
            group_name: Group name if filter_type is "group"
        
        Returns:
            CSV string
        """
        # Build query
        query = {}
        if filter_type == "active":
            query["active"] = True
        elif filter_type == "group":
            if not group_name:
                raise ValueError("group_name required when filter_type='group'")
            query["mentor_group"] = group_name
        
        # Get all actions to include as columns
        actions = []
        async for action in self.db.actions.find({}).sort("order", 1):
            actions.append(action["action_key"])
        
        # Prepare CSV
        output = io.StringIO()
        
        # Define columns
        base_columns = ["first_name", "last_name", "email", "slug", "active", "mentor_group", "photo_url"]
        action_columns = [f"action:{action_key}" for action_key in actions]
        all_columns = base_columns + action_columns
        
        writer = csv.DictWriter(output, fieldnames=all_columns, extrasaction='ignore')
        writer.writeheader()
        
        # Get mentors
        async for mentor in self.db.mentors.find(query):
            mentor_id = str(mentor["_id"])
            
            # Get mentor links
            links = {}
            async for link in self.db.mentor_links.find({"mentor_id": mentor_id}):
                links[link["action_key"]] = link["url"]
            
            # Build row
            row = {
                "first_name": mentor.get("first_name", ""),
                "last_name": mentor.get("last_name", ""),
                "email": mentor.get("email", ""),
                "slug": mentor.get("slug", ""),
                "active": str(mentor.get("active", True)).lower(),
                "mentor_group": mentor.get("mentor_group", ""),
                "photo_url": mentor.get("photo_url", ""),
            }
            
            # Add action links
            for action_key in actions:
                row[f"action:{action_key}"] = links.get(action_key, "")
            
            writer.writerow(row)
        
        return output.getvalue()
    
    async def import_mentors(
        self,
        csv_content: str,
        create_new: bool = True,
        update_existing: bool = True,
        overwrite_links: bool = True
    ) -> Dict:
        """
        Import mentors from CSV
        
        Args:
            csv_content: CSV string content
            create_new: Create mentors if slug doesn't exist
            update_existing: Update mentors if slug exists
            overwrite_links: Overwrite existing links (if False, only add new links)
        
        Returns:
            Dictionary with import results
        """
        # Parse CSV
        csv_file = io.StringIO(csv_content)
        reader = csv.DictReader(csv_file)
        
        results = {
            "total_rows": 0,
            "created": 0,
            "updated": 0,
            "skipped": 0,
            "errors": []
        }
        
        # Get all action keys
        all_actions = set()
        async for action in self.db.actions.find({}):
            all_actions.add(action["action_key"])
        
        for row_num, row in enumerate(reader, start=2):  # start=2 because of header
            results["total_rows"] += 1
            
            try:
                # Validate required fields
                if not row.get("slug"):
                    results["errors"].append({
                        "row": row_num,
                        "error": "Missing required field: slug"
                    })
                    results["skipped"] += 1
                    continue
                
                if not row.get("first_name") or not row.get("last_name"):
                    results["errors"].append({
                        "row": row_num,
                        "error": "Missing required fields: first_name and/or last_name"
                    })
                    results["skipped"] += 1
                    continue
                
                slug = row["slug"].strip().lower()
                
                # Check if mentor exists
                existing = await self.db.mentors.find_one({"slug": slug})
                
                if existing:
                    # Mentor exists
                    if not update_existing:
                        results["skipped"] += 1
                        continue
                    
                    # Update mentor
                    mentor_id = str(existing["_id"])
                    
                    update_data = {
                        "first_name": row["first_name"].strip(),
                        "last_name": row["last_name"].strip(),
                        "updated_at": datetime.utcnow()
                    }
                    
                    if row.get("email"):
                        update_data["email"] = row["email"].strip()
                    
                    if row.get("active"):
                        update_data["active"] = row["active"].strip().lower() in ["true", "1", "yes"]
                    
                    if row.get("mentor_group"):
                        update_data["mentor_group"] = row["mentor_group"].strip()
                    
                    if row.get("photo_url"):
                        update_data["photo_url"] = row["photo_url"].strip()
                    
                    await self.db.mentors.update_one(
                        {"_id": existing["_id"]},
                        {"$set": update_data}
                    )
                    
                    results["updated"] += 1
                
                else:
                    # Mentor doesn't exist
                    if not create_new:
                        results["skipped"] += 1
                        continue
                    
                    # Create mentor
                    mentor_data = {
                        "first_name": row["first_name"].strip(),
                        "last_name": row["last_name"].strip(),
                        "slug": slug,
                        "active": row.get("active", "true").strip().lower() in ["true", "1", "yes"],
                        "created_at": datetime.utcnow(),
                        "updated_at": datetime.utcnow()
                    }
                    
                    if row.get("email"):
                        mentor_data["email"] = row["email"].strip()
                    
                    if row.get("mentor_group"):
                        mentor_data["mentor_group"] = row["mentor_group"].strip()
                    
                    if row.get("photo_url"):
                        mentor_data["photo_url"] = row["photo_url"].strip()
                    
                    result = await self.db.mentors.insert_one(mentor_data)
                    mentor_id = str(result.inserted_id)
                    
                    results["created"] += 1
                
                # Process action links
                for key, value in row.items():
                    if key.startswith("action:"):
                        action_key = key.replace("action:", "")
                        
                        # Validate action exists
                        if action_key not in all_actions:
                            results["errors"].append({
                                "row": row_num,
                                "warning": f"Unknown action '{action_key}' - skipping"
                            })
                            continue
                        
                        url = value.strip() if value else ""
                        
                        if not url:
                            # Empty URL - delete link if exists
                            await self.db.mentor_links.delete_one({
                                "mentor_id": mentor_id,
                                "action_key": action_key
                            })
                            continue
                        
                        # Check if link exists
                        existing_link = await self.db.mentor_links.find_one({
                            "mentor_id": mentor_id,
                            "action_key": action_key
                        })
                        
                        if existing_link and not overwrite_links:
                            # Skip if link exists and overwrite is False
                            continue
                        
                        # Create or update link
                        link_data = {
                            "mentor_id": mentor_id,
                            "action_key": action_key,
                            "url": url,
                            "updated_at": datetime.utcnow()
                        }
                        
                        if existing_link:
                            await self.db.mentor_links.update_one(
                                {"_id": existing_link["_id"]},
                                {"$set": link_data}
                            )
                        else:
                            link_data["created_at"] = datetime.utcnow()
                            await self.db.mentor_links.insert_one(link_data)
            
            except Exception as e:
                results["errors"].append({
                    "row": row_num,
                    "error": str(e)
                })
                results["skipped"] += 1
        
        return results
    
    async def preview_import(self, csv_content: str) -> Dict:
        """
        Preview CSV import without making changes
        
        Returns:
            Dictionary with preview information
        """
        csv_file = io.StringIO(csv_content)
        reader = csv.DictReader(csv_file)
        
        preview = {
            "total_rows": 0,
            "new_mentors": [],
            "existing_mentors": [],
            "errors": [],
            "columns_found": []
        }
        
        # Get columns
        first_row = True
        
        for row_num, row in enumerate(reader, start=2):
            if first_row:
                preview["columns_found"] = list(row.keys())
                first_row = False
            
            preview["total_rows"] += 1
            
            if not row.get("slug"):
                preview["errors"].append({
                    "row": row_num,
                    "error": "Missing slug"
                })
                continue
            
            slug = row["slug"].strip().lower()
            
            # Check if exists
            existing = await self.db.mentors.find_one({"slug": slug})
            
            mentor_preview = {
                "row": row_num,
                "slug": slug,
                "first_name": row.get("first_name", ""),
                "last_name": row.get("last_name", "")
            }
            
            if existing:
                mentor_preview["current_name"] = f"{existing['first_name']} {existing['last_name']}"
                preview["existing_mentors"].append(mentor_preview)
            else:
                preview["new_mentors"].append(mentor_preview)
        
        return preview
