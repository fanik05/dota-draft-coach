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
   - Initial Version: CLI (Command Line Interface).
   - Future Version: REST API with React Frontend.

## Tech Stack
- **Languages:** Python (Data Pipeline), Go (Logic Engine)
- **Data Source:** OpenDota API
- **Storage:** Local JSON (Primary), Redis (Future Caching)