from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Query
from fastapi.responses import StreamingResponse
from motor.motor_asyncio import AsyncIOMotorDatabase
from services.csv_service import CSVService
from typing import Optional
from pydantic import BaseModel
import io

router = APIRouter(prefix="/api/admin/csv", tags=["admin-csv"])

async def get_db():
    from server import db
    return db

class ImportOptions(BaseModel):
    create_new: bool = True
    update_existing: bool = True
    overwrite_links: bool = True

@router.get("/export")
async def export_mentors_csv(
    filter_type: str = Query("all", regex="^(all|active|group)$"),
    group_name: Optional[str] = Query(None),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Export mentors to CSV
    
    Query params:
    - filter_type: "all", "active", or "group"
    - group_name: Required if filter_type is "group"
    """
    service = CSVService(db)
    
    try:
        csv_content = await service.export_mentors(filter_type, group_name)
        
        # Generate filename
        filename = f"mentors_{filter_type}"
        if group_name:
            filename += f"_{group_name}"
        filename += ".csv"
        
        # Return as downloadable file
        return StreamingResponse(
            io.StringIO(csv_content),
            media_type="text/csv",
            headers={
                "Content-Disposition": f'attachment; filename="{filename}"'
            }
        )
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Export failed: {str(e)}")

@router.post("/preview")
async def preview_import(
    file: UploadFile = File(...),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Preview CSV import without making changes
    Shows what will be created/updated
    """
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="File must be a CSV")
    
    try:
        content = await file.read()
        csv_content = content.decode('utf-8')
        
        service = CSVService(db)
        preview = await service.preview_import(csv_content)
        
        return preview
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Preview failed: {str(e)}")

@router.post("/import")
async def import_mentors_csv(
    file: UploadFile = File(...),
    create_new: bool = Query(True),
    update_existing: bool = Query(True),
    overwrite_links: bool = Query(True),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Import mentors from CSV
    
    Query params:
    - create_new: Create mentors if slug doesn't exist (default: true)
    - update_existing: Update mentors if slug exists (default: true)
    - overwrite_links: Overwrite existing links (default: true)
    """
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="File must be a CSV")
    
    try:
        content = await file.read()
        csv_content = content.decode('utf-8')
        
        service = CSVService(db)
        results = await service.import_mentors(
            csv_content,
            create_new=create_new,
            update_existing=update_existing,
            overwrite_links=overwrite_links
        )
        
        return results
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Import failed: {str(e)}")

@router.get("/template")
async def download_template(db: AsyncIOMotorDatabase = Depends(get_db)):
    """
    Download CSV template with correct columns
    """
    # Get all actions
    actions = []
    async for action in db.actions.find({}).sort("order", 1):
        actions.append(action["action_key"])
    
    # Build template
    output = io.StringIO()
    
    base_columns = ["first_name", "last_name", "email", "slug", "active", "mentor_group", "photo_url"]
    action_columns = [f"action:{action_key}" for action_key in actions]
    all_columns = base_columns + action_columns
    
    import csv
    writer = csv.DictWriter(output, fieldnames=all_columns)
    writer.writeheader()
    
    # Add example row
    example_row = {
        "first_name": "Juan",
        "last_name": "Pérez",
        "email": "juan@ejemplo.com",
        "slug": "juan-perez",
        "active": "true",
        "mentor_group": "team",
        "photo_url": "https://ejemplo.com/foto.jpg"
    }
    
    for action_key in actions:
        example_row[f"action:{action_key}"] = "https://ejemplo.com/enlace"
    
    writer.writerow(example_row)
    
    return StreamingResponse(
        io.StringIO(output.getvalue()),
        media_type="text/csv",
        headers={
            "Content-Disposition": 'attachment; filename="mentors_template.csv"'
        }
    )
