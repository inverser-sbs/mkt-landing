"""
CSV Import/Export Helper Scripts
"""
import requests
import sys
import json

BACKEND_URL = "http://localhost:8001"

def export_mentors(filter_type="all", group_name=None, output_file="mentors_export.csv"):
    """Export mentors to CSV"""
    url = f"{BACKEND_URL}/api/admin/csv/export"
    params = {"filter_type": filter_type}
    if group_name:
        params["group_name"] = group_name
    
    print(f"📥 Exporting mentors (filter: {filter_type})...")
    
    response = requests.get(url, params=params)
    
    if response.status_code == 200:
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(response.text)
        print(f"✅ Exported to: {output_file}")
        print(f"📊 Preview:")
        print(response.text[:500])
    else:
        print(f"❌ Export failed: {response.status_code}")
        print(response.text)

def preview_import(csv_file):
    """Preview CSV import without making changes"""
    print(f"👀 Previewing import from: {csv_file}...")
    
    with open(csv_file, 'rb') as f:
        files = {'file': (csv_file, f, 'text/csv')}
        response = requests.post(f"{BACKEND_URL}/api/admin/csv/preview", files=files)
    
    if response.status_code == 200:
        data = response.json()
        print("\n📊 Preview Results:")
        print(f"   Total rows: {data['total_rows']}")
        print(f"   New mentors: {len(data['new_mentors'])}")
        print(f"   Existing mentors: {len(data['existing_mentors'])}")
        print(f"   Errors: {len(data['errors'])}")
        
        if data['new_mentors']:
            print("\n   New mentors to be created:")
            for mentor in data['new_mentors'][:5]:
                print(f"     - {mentor['first_name']} {mentor['last_name']} ({mentor['slug']})")
        
        if data['existing_mentors']:
            print("\n   Existing mentors to be updated:")
            for mentor in data['existing_mentors'][:5]:
                print(f"     - {mentor['first_name']} {mentor['last_name']} ({mentor['slug']})")
        
        if data['errors']:
            print("\n   ⚠️  Errors found:")
            for error in data['errors'][:5]:
                print(f"     - Row {error['row']}: {error['error']}")
    else:
        print(f"❌ Preview failed: {response.status_code}")
        print(response.text)

def import_mentors(csv_file, create_new=True, update_existing=True, overwrite_links=True):
    """Import mentors from CSV"""
    print(f"📤 Importing mentors from: {csv_file}...")
    print(f"   Options:")
    print(f"     - Create new: {create_new}")
    print(f"     - Update existing: {update_existing}")
    print(f"     - Overwrite links: {overwrite_links}")
    
    with open(csv_file, 'rb') as f:
        files = {'file': (csv_file, f, 'text/csv')}
        params = {
            'create_new': str(create_new).lower(),
            'update_existing': str(update_existing).lower(),
            'overwrite_links': str(overwrite_links).lower()
        }
        response = requests.post(
            f"{BACKEND_URL}/api/admin/csv/import",
            files=files,
            params=params
        )
    
    if response.status_code == 200:
        data = response.json()
        print("\n✅ Import completed!")
        print(f"   Total rows: {data['total_rows']}")
        print(f"   Created: {data['created']}")
        print(f"   Updated: {data['updated']}")
        print(f"   Skipped: {data['skipped']}")
        
        if data['errors']:
            print(f"\n   ⚠️  Errors ({len(data['errors'])}):")
            for error in data['errors'][:10]:
                print(f"     - Row {error['row']}: {error['error']}")
    else:
        print(f"❌ Import failed: {response.status_code}")
        print(response.text)

def download_template(output_file="mentors_template.csv"):
    """Download CSV template"""
    print(f"📥 Downloading CSV template...")
    
    response = requests.get(f"{BACKEND_URL}/api/admin/csv/template")
    
    if response.status_code == 200:
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(response.text)
        print(f"✅ Template downloaded to: {output_file}")
        print(f"\n📋 Template preview:")
        print(response.text[:300])
    else:
        print(f"❌ Download failed: {response.status_code}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("CSV Import/Export Helper")
        print("\nUsage:")
        print("  python csv_helper.py export [all|active|group] [group_name]")
        print("  python csv_helper.py preview <csv_file>")
        print("  python csv_helper.py import <csv_file> [create_new] [update_existing] [overwrite_links]")
        print("  python csv_helper.py template")
        print("\nExamples:")
        print("  python csv_helper.py export all")
        print("  python csv_helper.py export active")
        print("  python csv_helper.py export group team")
        print("  python csv_helper.py preview mentors.csv")
        print("  python csv_helper.py import mentors.csv true true false")
        print("  python csv_helper.py template")
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == "export":
        filter_type = sys.argv[2] if len(sys.argv) > 2 else "all"
        group_name = sys.argv[3] if len(sys.argv) > 3 else None
        export_mentors(filter_type, group_name)
    
    elif command == "preview":
        if len(sys.argv) < 3:
            print("Error: CSV file required")
            sys.exit(1)
        preview_import(sys.argv[2])
    
    elif command == "import":
        if len(sys.argv) < 3:
            print("Error: CSV file required")
            sys.exit(1)
        csv_file = sys.argv[2]
        create_new = sys.argv[3].lower() == 'true' if len(sys.argv) > 3 else True
        update_existing = sys.argv[4].lower() == 'true' if len(sys.argv) > 4 else True
        overwrite_links = sys.argv[5].lower() == 'true' if len(sys.argv) > 5 else True
        import_mentors(csv_file, create_new, update_existing, overwrite_links)
    
    elif command == "template":
        download_template()
    
    else:
        print(f"Unknown command: {command}")
        sys.exit(1)
