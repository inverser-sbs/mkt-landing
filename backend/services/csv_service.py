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
        campaign_key: str,
        filter_type: str = "all",
        group_name: Optional[str] = None
    ) -> str:
        """
        Export mentors to CSV format for a specific campaign.
        Only includes actions from the selected campaign.
        
        Args:
            campaign_key: Campaign to export
            filter_type: "all", "active", or "group"
            group_name: Group name if filter_type is "group"
        
        Returns:
            CSV string
        """
        # Build query for mentors
        query = {}
        if filter_type == "active":
            query["active"] = True
        elif filter_type == "group":
            if not group_name:
                raise ValueError("group_name required when filter_type='group'")
            query["mentor_group"] = group_name
        
        # Get actions for THIS CAMPAIGN ONLY
        actions = []
        async for action in self.db.actions.find({"campaign_key": campaign_key}).sort("order", 1):
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
            
            # Get mentor links FOR THIS CAMPAIGN ONLY
            links = {}
            async for link in self.db.mentor_links.find({
                "mentor_id": mentor_id,
                "campaign_key": campaign_key
            }):
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
            
            # Add action links for this campaign
            for action_key in actions:
                row[f"action:{action_key}"] = links.get(action_key, "")
            
            writer.writerow(row)
        
        return output.getvalue()
    
    async def import_mentors(
        self,
        campaign_key: str,
        csv_content: str,
        create_new: bool = True,
        update_existing: bool = True,
        overwrite_links: bool = False
    ) -> Dict:
        """
        Import mentors from CSV for a specific campaign.
        Only processes actions from the selected campaign.
        
        Args:
            campaign_key: Campaign to import to
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
            "errors": [],
            "warnings": []
        }
        
        # Get all action keys FOR THIS CAMPAIGN
        campaign_actions = set()
        async for action in self.db.actions.find({"campaign_key": campaign_key}):
            campaign_actions.add(action["action_key"])
        
        for row_num, row in enumerate(reader, start=2):  # start=2 because of header
            results["total_rows"] += 1
            
            try:
                # Validate required fields
                if not row.get("slug"):
                    results["errors"].append({
                        "row": row_num,
                        "slug": "",
                        "error": "Campo requerido faltante: slug"
                    })
                    results["skipped"] += 1
                    continue
                
                if not row.get("first_name") or not row.get("last_name"):
                    results["errors"].append({
                        "row": row_num,
                        "slug": row.get("slug", ""),
                        "error": "Campos requeridos faltantes: first_name y/o last_name"
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
                        update_data["active"] = row["active"].strip().lower() in ["true", "1", "yes", "sí", "si"]
                    
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
                        "active": row.get("active", "true").strip().lower() in ["true", "1", "yes", "sí", "si"],
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
                
                # Process action links - ONLY FOR THIS CAMPAIGN
                for key, value in row.items():
                    if key.startswith("action:"):
                        action_key = key.replace("action:", "")
                        
                        # Validate action exists IN THIS CAMPAIGN
                        if action_key not in campaign_actions:
                            results["warnings"].append({
                                "row": row_num,
                                "warning": f"Acción '{action_key}' no existe en la campaña - ignorada"
                            })
                            continue
                        
                        url = value.strip() if value else ""
                        
                        if not url:
                            # Empty URL - optionally delete link if overwrite is True
                            if overwrite_links:
                                await self.db.mentor_links.delete_one({
                                    "mentor_id": mentor_id,
                                    "campaign_key": campaign_key,
                                    "action_key": action_key
                                })
                            continue
                        
                        # Check if link exists
                        existing_link = await self.db.mentor_links.find_one({
                            "mentor_id": mentor_id,
                            "campaign_key": campaign_key,
                            "action_key": action_key
                        })
                        
                        if existing_link and not overwrite_links:
                            # Skip if link exists and overwrite is False
                            continue
                        
                        # Create or update link
                        link_data = {
                            "mentor_id": mentor_id,
                            "campaign_key": campaign_key,
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
                    "slug": row.get("slug", ""),
                    "error": str(e)
                })
                results["skipped"] += 1
        
        return results
    
    async def preview_import(self, campaign_key: str, csv_content: str) -> Dict:
        """
        Preview CSV import without making changes for a specific campaign.
        
        Args:
            campaign_key: Campaign to preview for
            csv_content: CSV string
        
        Returns:
            Dictionary with preview information
        """
        csv_file = io.StringIO(csv_content)
        reader = csv.DictReader(csv_file)
        
        # Get actions for this campaign
        campaign_actions = set()
        async for action in self.db.actions.find({"campaign_key": campaign_key}):
            campaign_actions.add(action["action_key"])
        
        preview = {
            "total_rows": 0,
            "new_count": 0,
            "existing_count": 0,
            "error_count": 0,
            "new_mentors": [],
            "existing_mentors": [],
            "errors": [],
            "warnings": [],
            "columns_found": [],
            "action_columns": [],
            "unknown_action_columns": []
        }
        
        first_row = True
        
        for row_num, row in enumerate(reader, start=2):
            if first_row:
                preview["columns_found"] = list(row.keys())
                
                # Identify action columns
                for col in row.keys():
                    if col.startswith("action:"):
                        action_key = col.replace("action:", "")
                        if action_key in campaign_actions:
                            preview["action_columns"].append(action_key)
                        else:
                            preview["unknown_action_columns"].append(action_key)
                
                first_row = False
            
            preview["total_rows"] += 1
            
            # Validate slug
            if not row.get("slug"):
                preview["errors"].append({
                    "row": row_num,
                    "slug": "",
                    "first_name": row.get("first_name", ""),
                    "last_name": row.get("last_name", ""),
                    "error": "Campo 'slug' faltante"
                })
                preview["error_count"] += 1
                continue
            
            # Validate name
            if not row.get("first_name") or not row.get("last_name"):
                preview["errors"].append({
                    "row": row_num,
                    "slug": row.get("slug", ""),
                    "first_name": row.get("first_name", ""),
                    "last_name": row.get("last_name", ""),
                    "error": "Campo 'first_name' o 'last_name' faltante"
                })
                preview["error_count"] += 1
                continue
            
            slug = row["slug"].strip().lower()
            
            # Check if exists
            existing = await self.db.mentors.find_one({"slug": slug})
            
            # Count links in CSV
            links_in_csv = 0
            for key, value in row.items():
                if key.startswith("action:") and value and value.strip():
                    action_key = key.replace("action:", "")
                    if action_key in campaign_actions:
                        links_in_csv += 1
            
            mentor_preview = {
                "row": row_num,
                "slug": slug,
                "first_name": row.get("first_name", "").strip(),
                "last_name": row.get("last_name", "").strip(),
                "active": row.get("active", "true").strip().lower() in ["true", "1", "yes", "sí", "si"],
                "links_count": links_in_csv
            }
            
            if existing:
                mentor_preview["status"] = "existing"
                mentor_preview["current_name"] = f"{existing['first_name']} {existing['last_name']}"
                preview["existing_mentors"].append(mentor_preview)
                preview["existing_count"] += 1
            else:
                mentor_preview["status"] = "new"
                preview["new_mentors"].append(mentor_preview)
                preview["new_count"] += 1
        
        # Add warnings for unknown action columns
        if preview["unknown_action_columns"]:
            preview["warnings"].append({
                "type": "unknown_columns",
                "message": f"Columnas de acciones no reconocidas (serán ignoradas): {', '.join(preview['unknown_action_columns'])}"
            })
        
        return preview
