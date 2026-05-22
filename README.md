# Dota 2 Draft Coach

A hybrid **Go** and **Python** engine that calculates optimal hero counters using real-time matchup data from the OpenDota API.

## 🛠 Tech Stack
- **Backend:** Go (High-concurrency scoring engine)
- **Data Pipeline:** Python (ETL & statistical normalization)
- **Data Source:** OpenDota API

## 📂 Structure
- `/backend`: Go logic and suggestion API.
- `/scripts`: Python data harvester and processor.
- `/frontend`: React SPA (Vite + TypeScript).
- `/docs`: Architecture and roadmap.

## ⚡ Quick Start
Prerequisites: [uv](https://docs.astral.sh/uv/) (`brew install uv`) and Go.

1. **Setup:** `make setup` (Syncs Python deps via uv and Go modules)
2. **Harvest:** `make scrape` (Pulls matchup data with rate-limiting)
3. **Run:** `make run-backend` (Starts the suggestion engine)

## 📖 Docs
- [Architecture](./docs/architecture.md)
- [Checklist](./docs/checklist.md)

## 🛡 License
MIT
