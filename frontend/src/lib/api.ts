import type { HeroIndex, SuggestResponse } from "./types"

const API_BASE = "/api"

async function jsonOrThrow<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`${res.status} ${res.statusText}${text ? `: ${text.trim()}` : ""}`)
  }
  return res.json() as Promise<T>
}

export function fetchHeroes(): Promise<HeroIndex> {
  return fetch(`${API_BASE}/heroes`).then(jsonOrThrow<HeroIndex>)
}

export function fetchSuggestions(enemies: string[], limit = 10): Promise<SuggestResponse> {
  return fetch(`${API_BASE}/suggest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ enemies, limit }),
  }).then(jsonOrThrow<SuggestResponse>)
}
