import { useCallback, useEffect, useMemo, useState } from "react"
import { motion } from "motion/react"
import { fetchHeroes, fetchSuggestions } from "./lib/api"
import type { HeroIndex, Suggestion } from "./lib/types"
import { Header } from "./components/Header"
import { EnemyTeam } from "./components/EnemyTeam"
import { HeroGrid } from "./components/HeroGrid"
import { Suggestions } from "./components/Suggestions"
import { Embers } from "./components/Embers"

const MAX_ENEMIES = 5

export default function App() {
  const [heroes, setHeroes] = useState<HeroIndex>({})
  const [heroesLoading, setHeroesLoading] = useState(true)
  const [heroesError, setHeroesError] = useState<string | null>(null)

  const [enemies, setEnemies] = useState<string[]>([])
  const pickedSet = useMemo(() => new Set(enemies), [enemies])

  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [suggestLoading, setSuggestLoading] = useState(false)
  const [suggestError, setSuggestError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchHeroes()
      .then((data) => {
        if (cancelled) return
        setHeroes(data)
        setHeroesError(null)
      })
      .catch((err: Error) => {
        if (cancelled) return
        setHeroesError(err.message)
      })
      .finally(() => {
        if (cancelled) return
        setHeroesLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (enemies.length === 0) {
      setSuggestions([])
      setSuggestError(null)
      return
    }
    let cancelled = false
    setSuggestLoading(true)
    fetchSuggestions(enemies, 10)
      .then((res) => {
        if (cancelled) return
        setSuggestions(res.suggestions)
        setSuggestError(null)
      })
      .catch((err: Error) => {
        if (cancelled) return
        setSuggestError(err.message)
        setSuggestions([])
      })
      .finally(() => {
        if (cancelled) return
        setSuggestLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [enemies])

  const pickEnemy = useCallback((id: string) => {
    setEnemies((prev) => (prev.includes(id) || prev.length >= MAX_ENEMIES ? prev : [...prev, id]))
  }, [])

  const removeEnemy = useCallback((id: string) => {
    setEnemies((prev) => prev.filter((e) => e !== id))
  }, [])

  const clearEnemies = useCallback(() => setEnemies([]), [])

  return (
    <>
      <Embers />
      <div className="mx-auto max-w-7xl px-6 pb-24">
        <Header />

        {heroesError && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-xl border border-blood-600/70 bg-blood-700/10 p-4 text-center text-sm text-blood-500"
          >
            Could not reach the Draft Coach API — is the server running on{" "}
            <code className="font-mono">:8080</code>?
            <div className="mt-1 text-xs text-blood-500/80">{heroesError}</div>
          </motion.div>
        )}

        {heroesLoading && !heroesError && (
          <div className="flex justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
              className="h-12 w-12 rounded-full border-2 border-ember-600/30 border-t-ember-500"
            />
          </div>
        )}

        {!heroesLoading && !heroesError && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="space-y-6">
              <EnemyTeam
                enemyIds={enemies}
                heroes={heroes}
                maxSlots={MAX_ENEMIES}
                onRemove={removeEnemy}
                onClear={clearEnemies}
              />
              <HeroGrid heroes={heroes} pickedIds={pickedSet} onPick={pickEnemy} />
            </div>

            <div className="lg:sticky lg:top-6 lg:self-start">
              <Suggestions
                enemyCount={enemies.length}
                suggestions={suggestions}
                heroes={heroes}
                loading={suggestLoading}
                error={suggestError}
              />
            </div>
          </div>
        )}
      </div>
    </>
  )
}
