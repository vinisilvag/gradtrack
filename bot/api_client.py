import os, httpx
BASE = os.getenv("API_BASE_URL", "http://localhost:3000")
async def get_report(student_id: str):
    async with httpx.AsyncClient(timeout=10) as c:
        r = await c.get(f"{BASE}/reports/{student_id}")
        r.raise_for_status()
        return r.json()
