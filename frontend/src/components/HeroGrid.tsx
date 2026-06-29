import { useMemo, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import type { HeroIndex, PrimaryAttr } from "../lib/types"
import { HeroCard } from "./HeroCard"

interface Props {
  heroes: HeroIndex
  pickedIds: Set<string>
  onPick: (id: string) => void
}

const ATTR_FILTERS: { value: PrimaryAttr | "all-attrs"; label: string }[] = [
  { value: "all-attrs", label: "All" },
  { value: "str", label: "Str" },
  { value: "agi", label: "Agi" },
  { value: "int", label: "Int" },
  { value: "all", label: "Uni" },
]

export function HeroGrid({ heroes, pickedIds, onPick }: Props) {
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<(typeof ATTR_FILTERS)[number]["value"]>("all-attrs")

  const entries = useMemo(() => Object.entries(heroes), [heroes])

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return entries
      .filter(([_, h]) => filter === "all-attrs" || h.primary_attr === filter)
      .filter(([_, h]) => !needle || h.name.toLowerCase().includes(needle) || h.roles.some(r => r.toLowerCase().includes(needle)))
      .sort(([_, a], [__, b]) => a.name.localeCompare(b.name))
  }, [entries, query, filter])

  return (
    <section className="panel flex flex-col px-6 py-5">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-sm font-bold uppercase tracking-[0.32em] text-ember-500 text-glow-ember">
          Hero Pool
        </h2>

        <div className="flex flex-1 flex-wrap items-center justify-end gap-3">
          <div className="relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search heroes or roles…"
              className="w-64 rounded-lg border border-night-700/80 bg-night-950/60 px-3 py-1.5 text-sm font-medium text-parchment outline-none transition-colors placeholder:text-parchment-dim/60 focus:border-ember-600/70 focus:ring-2 focus:ring-ember-600/30"
            />
          </div>

          <div className="flex items-center gap-1 rounded-lg border border-night-700/80 bg-night-950/60 p-1">
            {ATTR_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={[
                  "relative rounded-md px-3 py-1 text-[0.72rem] font-bold uppercase tracking-[0.18em] transition-colors",
                  filter === f.value ? "text-night-950" : "text-parchment-dim hover:text-parchment",
                ].join(" ")}
              >
                {filter === f.value && (
                  <motion.span
                    layoutId="attr-filter-pill"
                    className="absolute inset-0 -z-10 rounded-md bg-ember-500"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="text-[0.7rem] font-medium uppercase tracking-[0.2em] text-parchment-dim/70">
        Showing {filtered.length} of {entries.length}
      </div>

      <motion.div
        layout
        className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map(([id, hero]) => (
            <motion.div
              key={id}
              layout
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ type: "spring", stiffness: 360, damping: 28 }}
            >
              <HeroCard
                id={id}
                hero={hero}
                picked={pickedIds.has(id)}
                onClick={() => !pickedIds.has(id) && onPick(id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 text-center"
        >
          <p className="font-display text-lg font-semibold text-parchment-dim">
            No heroes match that filter.
          </p>
          <p className="mt-1 text-sm text-parchment-dim/70">
            Try a different name or attribute.
          </p>
        </motion.div>
      )}
    </section>
  )
}
