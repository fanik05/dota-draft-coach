import json
from pathlib import Path

SCRIPTS_DIR = Path(__file__).parent
RAW_DIR = SCRIPTS_DIR / "data" / "raw"
OUTPUT_PATH = SCRIPTS_DIR.parent / "backend" / "data" / "processed_meta.json"

MIN_GAMES_PLAYED = 50

def load_hero_list() -> list[dict]:
    return json.loads((RAW_DIR / "0_hero_list.json").read_text())

def load_hero_stats() -> list[dict]:
    return json.loads((RAW_DIR / "1_hero_stats.json").read_text())

def load_matchups_for(hero_id: int) -> list[dict]:
    matches = list(RAW_DIR.glob(f"{hero_id}_matchups_*.json"))
    
    if not matches:
        return []
    
    return json.loads(matches[0].read_text())

def build_global_winrates(hero_stats: list[dict]) -> dict[int, float]:
    return {
        h["id"]: h["pub_win"] / h["pub_pick"] for h in hero_stats if h["pub_pick"] > 0
    }

def build_advantages(hero_list: list[dict], global_winrates: dict[int, float]) -> dict[str, dict[str, float]]:
    advantages: dict[str, dict[str, float]] = {}

    for hero in hero_list:
        hero_id = hero["id"]
        my_global_wr = global_winrates.get(hero_id)

        if my_global_wr is None:
            continue

        my_advantages: dict[str, float] = {}

        for row in load_matchups_for(hero_id):
            if row["games_played"] < MIN_GAMES_PLAYED:
                continue

            matchup_wr = row["wins"] / row["games_played"]
            my_advantages[str(row["hero_id"])] = round(matchup_wr - my_global_wr, 4)

        advantages[str(hero_id)] = my_advantages

    return advantages

def build_hero_index(hero_list: list[dict]) -> dict[str, dict]:
    return {
        str(h["id"]): {
            "name": h["localized_name"],
            "primary_attr": h["primary_attr"],
            "roles": h["roles"]
        }
        for h in hero_list
    }

def main() -> None:
    hero_list = load_hero_list()
    hero_stats = load_hero_stats()
    global_winrates = build_global_winrates(hero_stats)

    output = {
        "heroes": build_hero_index(hero_list),
        "advantages": build_advantages(hero_list, global_winrates)
    }

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(output, indent=2))

    total_matchups = sum(len(opps) for opps in output["advantages"].values())
    print(f"wrote {OUTPUT_PATH}")
    print(f"heroes: {len(output['heroes'])}")
    print(f"matchup rows (after >= {MIN_GAMES_PLAYED}-game filter): {total_matchups}")

if __name__ == "__main__":
    main()
