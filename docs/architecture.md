# Architecture: Dota 2 Draft Coach

## System Overview
A high-concurrency suggestion engine that provides optimal hero picks based on historical matchup data.

## Data Flow
1. **Extraction (Python):** 
   - Hits OpenDota API.
   - Fetches hero constants and global matchup matrices.
   - **Constraint:** Rate-limited to 1 request per 1.5 seconds.
2. **Transformation (Python):** 
   - Normalizes raw JSON data.
   - Calculates "Advantage Score" (Difference between expected win rate and actual matchup win rate).
   - Exports a minimized `processed_meta.json`.
3. **Engine (Go):** 
   - Ingests `processed_meta.json` into an in-memory `Map`.
   - **Logic:** Sums the advantage scores of the enemy team against all potential picks to find the "Counter Weight."
4. **Interface:** 
   - **CLI:** `cmd/draft` for terminal use.
   - **REST API:** `cmd/server` exposing `/suggest`, `/heroes`, `/health`.
   - **Frontend:** React SPA in `/frontend` (in progress).

## Tech Stack
- **Languages:** Python (Data Pipeline), Go (Logic Engine)
- **Data Source:** OpenDota API
- **Storage:** Local JSON (Primary), Redis (Future Caching)

## Known Limitations (v1)

The v1 scoring algorithm reflects average public-match outcomes, not optimal-play matchup design. Concretely:

- **Pub-match signal, not design intent.** OpenDota matchup data measures what *actually happens* in public games at all skill levels. Hard counters that depend on skilled execution (e.g., Anti-Mage vs Medusa, Bloodseeker vs Slark) are underweighted because their advantage only emerges at higher MMR.
- **Small matchup samples.** The `/heroes/{id}/matchups` endpoint returns a narrow subset of games (often <150 per opponent for top matchups). Low-sample noise swings win rates by several percentage points; the 50-game filter mitigates but doesn't eliminate this.
- **Coarse baseline.** Hero global win rate uses `pub_pick` / `pub_win` across every public game. This averages over bracket, role, and party composition — comparing matchup-specific WR against this noisy baseline often produces a weak signal.

**Planned improvements** (Phase 5+): use high-bracket fields from `/heroStats` (e.g., `7_pick` / `7_win`), incorporate pro-match data, or hybridize statistical scoring with hand-curated counter knowledge.
