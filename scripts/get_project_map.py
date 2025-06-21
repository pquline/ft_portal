import os
import requests
import time
from dotenv import load_dotenv

load_dotenv()

CLIENT_ID = os.environ.get("FT_CLIENT_ID")
CLIENT_SECRET = os.environ.get("FT_CLIENT_SECRET")

if not CLIENT_ID or not CLIENT_SECRET:
    raise Exception("Please set FT_CLIENT_ID and FT_CLIENT_SECRET environment variables.")

def get_token():
    url = "https://api.intra.42.fr/oauth/token"
    data = {
        "grant_type": "client_credentials",
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET
    }
    resp = requests.post(url, data=data)
    resp.raise_for_status()
    return resp.json()["access_token"]

def fetch_projects(token):
    projects = []
    page = 1
    per_page = 100
    while True:
        url = f"https://api.intra.42.fr/v2/projects?page={page}&per_page={per_page}"
        headers = {"Authorization": f"Bearer {token}"}
        resp = requests.get(url, headers=headers)
        if resp.status_code != 200:
            print(f"Error fetching page {page}: {resp.status_code}")
            break
        data = resp.json()
        if not data:
            break
        projects.extend(data)
        print(f"Fetched page {page} ({len(data)} projects)")
        page += 1
        time.sleep(3)
    return projects

def main():
    token = get_token()
    projects = fetch_projects(token)

    tsx_lines = [
        "export const projectMap: { id: number; project_path: string }[] = ["
    ]

    for project in projects:
        slug = project['slug'].replace('"', '\\"')
        cursus = project.get('cursus', [])
        project_path = f"deprecated/{slug}"
        tsx_lines.append(f"  {{ id: {project['id']}, project_path: \"{project_path}\" }},")
    tsx_lines.append("];")

    with open('projectMap.tsx', 'w', encoding='utf-8') as f:
        f.write('\n'.join(tsx_lines))

    print("Generated projectMap.tsx")

if __name__ == "__main__":
    main()
