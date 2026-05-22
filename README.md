# Dota 2 Draft Coach

A hybrid **Go** and **Python** engine that calculates optimal hero counters using real-time matchup data from the OpenDota API.

## 🛠 Tech Stack
- **Backend:** Go (scoring engine + REST API)
- **Data Pipeline:** Python (ETL & statistical normalization)
- **Frontend:** React + TypeScript (Vite)
- **Data Source:** OpenDota API

## 📂 Structure
- `/backend`: Go logic engine, CLI, and HTTP server.
- `/scripts`: Python data harvester and processor.
- `/frontend`: React SPA (Vite + TypeScript).
- `/docs`: Architecture and roadmap.

## ⚡ Quick Start
Prerequisites: [uv](https://docs.astral.sh/uv/) (`brew install uv`), Go, and Node.js.

1. **Setup:** `make setup` — syncs Python deps via uv, Go modules, and frontend `npm` deps.
2. **Harvest:** `make scrape` — pulls raw matchup data from OpenDota (rate-limited, ~3 min).
3. **Process:** `make process` — aggregates raw data into `backend/data/processed_meta.json`.
4. **Try the CLI:** `make draft ARGS='pudge "crystal maiden" sven'` — top-10 counter picks for that enemy team.
5. **Run the API:** `make run-backend` — starts the HTTP server on `:8080`.
6. **Run the frontend:** `make run-frontend` — starts the Vite dev server on `:5173`.

## 🔌 REST API

The `cmd/server` binary exposes three endpoints:

| Method | Path        | Description                                |
|--------|-------------|--------------------------------------------|
| GET    | `/health`   | Liveness probe.                            |
| GET    | `/heroes`   | Full hero index keyed by ID.               |
| POST   | `/suggest`  | Ranked counter picks for an enemy lineup.  |

### `POST /suggest`

Request body — hero ids or names (case- and punctuation-insensitive):

```json
{ "enemies": ["pudge", "crystal maiden", "sven"], "limit": 5 }
```

Response:

```json
{
  "enemies": [
    { "id": "14", "name": "Pudge" },
    { "id": "5",  "name": "Crystal Maiden" },
    { "id": "18", "name": "Sven" }
  ],
  "suggestions": [
    { "id": "145", "name": "Kez",      "score": 0.4183 },
    { "id": "77",  "name": "Lycan",    "score": 0.3171 },
    { "id": "65",  "name": "Batrider", "score": 0.3107 }
  ]
}
```

Environment variables: `META_PATH` (default `data/processed_meta.json`) and `ADDR` (default `:8080`).

## 📖 Docs
- [Architecture](./docs/architecture.md) — pipeline overview and known limitations.
- [Checklist](./docs/checklist.md) — phase-by-phase progress.

## 🛡 License
MIT
