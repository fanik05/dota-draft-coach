import requests
import json
import time
from pathlib import Path

OPENDOTA_BASE = "https://api.opendota.com/api"
RATE_LIMIT_SECONDS = 1.5
RAW_DIR = Path(__file__).parent / "data" / "raw"

_last_request_at = 0.0

def fetch(endpoint: str) -> object:
    global _last_request_at
    elapsed = time.monotonic() - _last_request_at
    
    if elapsed < RATE_LIMIT_SECONDS:
        time.sleep(RATE_LIMIT_SECONDS - elapsed)

    url = f"{OPENDOTA_BASE}{endpoint}"
    print(f"GET {url}")
    response = requests.get(url, timeout=30)
    response.raise_for_status()
    _last_request_at = time.monotonic()

    return response.json()

def save_json(payload: object, filename: str) -> Path:
    RAW_DIR.mkdir(parents=True, exist_ok=True)

    path = RAW_DIR / filename
    path.write_text(json.dumps(payload, indent=2))

    return path

def harvest_hero_list() -> None:
    filename = "0_hero_list.json"
    path = RAW_DIR / filename

    if path.exists():
        print(f"skip: {path} already exists")
        return

    heroes = fetch("/heroes")
    
    written = save_json(heroes, filename)
    count = len(heroes) if isinstance(heroes, list) else "?"
    print(f"wrote {written} ({count} heroes)")

def main() -> None:
    harvest_hero_list()

if __name__ == "__main__":
    main()