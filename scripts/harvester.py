import requests
import json
import time
from pathlib import Path
import re

OPENDOTA_BASE = "https://api.opendota.com/api"
RATE_LIMIT_SECONDS = 1.5
RAW_DIR = Path(__file__).parent / "data" / "raw"

_last_request_at = 0.0

def fetch(endpoint: str, max_attempts: int = 3) -> object:
    global _last_request_at
    url = f"{OPENDOTA_BASE}{endpoint}"

    for attempt in range(1, max_attempts + 1):
        elapsed = time.monotonic() - _last_request_at
        
        if elapsed < RATE_LIMIT_SECONDS:
            time.sleep(RATE_LIMIT_SECONDS - elapsed)
        
        print(f"GET {url} (attempt {attempt}/{max_attempts})")

        try:
            response = requests.get(url, timeout=30)
            _last_request_at = time.monotonic()
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            if attempt == max_attempts:
                raise

            backoff = 2 ** (attempt - 1)
            print(f"failed ({e}); retrying in {backoff}s")
            time.sleep(backoff)

    raise RuntimeError("unreachable")

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

def harvest_matchups_for(hero_id: int, hero_name: str) -> None:
    safe_name = re.sub(r"[^a-z0-9]+", "_", hero_name.lower()).strip("_")
    filename = f"{hero_id}_matchups_{safe_name}.json"
    path = RAW_DIR / filename

    if path.exists():
        print(f"skip: {path} already exists")
        return
    
    matchups = fetch(f"/heroes/{hero_id}/matchups")
    written = save_json(matchups, filename)
    count = len(matchups) if isinstance(matchups, list) else "?"

    print(f"wrote {written} (found {count} matchups for {hero_name})")

def harvest_all_matchups() -> None:
    hero_list_path = RAW_DIR / "0_hero_list.json"

    if not hero_list_path.exists():
        print("hero list missing; run harvest_hero_list() first")
        return
    
    heroes = json.loads(hero_list_path.read_text())
    failed: list[dict] = []

    for hero in heroes:
        try:
            harvest_matchups_for(hero["id"], hero["localized_name"])
        except requests.RequestException as e:
            print(f"FAILED hero {hero['id']} ({hero['localized_name']}): {e}")
            failed.append(hero)

    print(f"\ndone. {len(heroes) - len(failed)}/{len(heroes)} succeeded")
    
    if failed:
        print(f"failed heroes: {[h['localized_name'] for h in failed]}")
        print("re-run the script to retry them (idempotency will skip succeeded ones)")

def harvest_hero_stats() -> None:
    filename = "1_hero_stats.json"
    path = RAW_DIR / filename

    if path.exists():
        print(f"skip: {path} already exists")
        return
    
    hero_stats = fetch("/heroStats")
    written = save_json(hero_stats, filename)
    count = len(hero_stats) if isinstance(hero_stats, list) else "?"

    print(f"wrote {written} (found {count} hero stats)")

def main() -> None:
    harvest_hero_list()
    harvest_hero_stats()
    harvest_all_matchups()

if __name__ == "__main__":
    main()
