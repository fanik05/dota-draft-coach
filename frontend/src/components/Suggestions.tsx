import { AnimatePresence, motion } from "motion/react"
import type { HeroIndex, Suggestion } from "../lib/types"
import { attrStyle, heroInitials } from "../lib/attr"

interface Props {
  enemyCount: number
  suggestions: Suggestion[]
  heroes: HeroIndex
  loading: boolean
  error: string | null
}

export function Suggestions({ enemyCount, suggestions, heroes, loading, error }: Props) {
  const maxAbs = Math.max(0.001, ...suggestions.map((s) => Math.abs(s.score)))

  return (
    <section className="panel flex flex-col px-6 py-5">
      <header className="mb-4 flex items-baseline justify-between">
        <h2 className="font-display text-sm font-bold uppercase tracking-[0.32em] text-ember-500 text-glow-ember">
          Counter Picks
        </h2>
        <span className="text-[0.7rem] font-medium uppercase tracking-[0.2em] text-parchment-dim/70">
          {loading ? "Computing…" : `${suggestions.length} ranked`}
        </span>
      </header>

      {enemyCount === 0 && !loading && (
        <div className="py-10 text-center">
          <p className="font-display text-lg font-semibold text-parchment-dim">
            Pick at least one enemy hero.
          </p>
          <p className="mt-1 text-sm text-parchment-dim/70">
            The strongest counters will appear here.
          </p>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-blood-600/60 bg-blood-700/10 p-3 text-sm text-blood-500">
          {error}
        </div>
      )}

      {loading && suggestions.length === 0 && (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="relative h-12 overflow-hidden rounded-lg border border-night-700/60 bg-night-800/40">
              <div className="absolute inset-0 shimmer" />
            </div>
          ))}
        </div>
      )}

      <ol className="space-y-2">
        <AnimatePresence mode="popLayout">
          {suggestions.map((sug, idx) => {
            const hero = heroes[sug.id]
            const style = hero ? attrStyle(hero.primary_attr) : attrStyle("all")
            const widthPct = Math.min(100, (Math.abs(sug.score) / maxAbs) * 100)
            const positive = sug.score >= 0
            return (
              <motion.li
                key={sug.id}
                layout
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{
                  type: "spring",
                  stiffness: 340,
                  damping: 28,
                  delay: idx * 0.04,
                }}
                className="group relative flex items-center gap-3 overflow-hidden rounded-lg border border-night-700/60 bg-night-800/50 p-3"
              >
                <motion.div
                  layout
                  initial={{ width: 0 }}
                  animate={{ width: `${widthPct}%` }}
                  transition={{ type: "spring", stiffness: 120, damping: 20, delay: 0.05 + idx * 0.03 }}
                  className={[
                    "absolute inset-y-0 left-0 -z-10 bg-gradient-to-r opacity-30",
                    positive
                      ? "from-ember-600/70 via-ember-500/40 to-transparent"
                      : "from-blood-700/60 via-blood-600/30 to-transparent",
                  ].join(" ")}
                />

                <span className="w-7 shrink-0 text-center font-display text-base font-bold text-parchment-dim">
                  {idx + 1}
                </span>

                <span
                  className={[
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-md border text-xs font-bold uppercase tracking-wider",
                    "border-night-600/80",
                    style.text,
                    `bg-gradient-to-br ${style.bg}`,
                  ].join(" ")}
                >
                  {hero ? heroInitials(hero.name) : "?"}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-base font-semibold text-parchment">
                    {hero?.name ?? sug.name}
                  </p>
                  {hero && (
                    <p className="truncate text-[0.7rem] font-medium uppercase tracking-[0.18em] text-parchment-dim/80">
                      {hero.roles.slice(0, 3).join(" · ")}
                    </p>
                  )}
                </div>

                <span
                  className={[
                    "font-display text-base font-bold tabular-nums",
                    positive ? "text-ember-500" : "text-blood-500",
                  ].join(" ")}
                >
                  {positive ? "+" : ""}
                  {sug.score.toFixed(3)}
                </span>
              </motion.li>
            )
          })}
        </AnimatePresence>
      </ol>
    </section>
  )
}
