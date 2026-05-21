# Project Milestones

## Phase 0: Infrastructure & Initialization
- [x] Create GitHub Repository and directory structure.
- [x] Configure `.gitignore` for Python envs, Go binaries, and raw data.
- [x] Initialize Go module (`go mod init`).
- [x] Initialize Python virtual environment and `requirements.txt`.
- [x] Setup `Makefile` with `.PHONY` targets for workflow automation.
- [x] Create `docs/architecture.md` and initial `docs/checklist.md`.

## Phase 1: Data Acquisition (Python)
- [x] Create `scripts/harvester.py` with rate-limiting logic.
- [x] Implement idempotency check (skip existing files).
- [x] Successfully fetch and store `0_hero_list.json`.
- [x] Successfully scrape matchup data for all 120+ heroes into `scripts/data/raw/`.

## Phase 2: Data Processing (Python)
- [x] Create `scripts/processor.py` to aggregate raw JSON files.
- [x] Implement **Advantage Score** calculation:
    - *Formula: (Matchup Win Rate) - (Hero Global Win Rate)*
- [x] Normalize hero names and IDs for Go ingestion.
- [x] Export final `backend/data/processed_meta.json`.

## Phase 3: The Go Logic Engine (Backend)
- [x] Define Go `structs` (Hero, Matchup, Meta) in `internal/engine`.
- [x] Implement JSON loader to hydrate the in-memory Map.
- [x] Build the scoring algorithm (summing advantages against the enemy lineup).
- [x] Create a basic CLI entry point in `main.go` to test logic.

## Phase 4: Interface & Quality Assurance
- [x] Implement a clean CLI with hero name autocomplete/search.
- [x] Write unit tests for the scoring math in Go.
- [x] (Optional) Wrap the engine in a REST API for future frontend use.
