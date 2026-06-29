import { AnimatePresence, motion } from "motion/react"
import type { Hero, HeroIndex } from "../lib/types"
import { attrStyle, heroInitials } from "../lib/attr"

interface Props {
  enemyIds: string[]
  heroes: HeroIndex
  maxSlots?: number
  onRemove: (id: string) => void
  onClear: () => void
}

export function EnemyTeam({ enemyIds, heroes, maxSlots = 5, onRemove, onClear }: Props) {
  const slots = Array.from({ length: maxSlots }, (_, i) => enemyIds[i] ?? null)

  return (
    <section className="panel relative px-6 py-5">
      <header className="mb-4 flex items-baseline justify-between">
        <div className="flex items-baseline gap-3">
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.32em] text-blood-500 text-glow-blood">
            Enemy Lineup
          </h2>
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-parchment-dim/70">
            {enemyIds.length}/{maxSlots}
          </span>
        </div>
        {enemyIds.length > 0 && (
          <button
            onClick={onClear}
            className="rounded px-2 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-parchment-dim transition-colors hover:bg-night-800 hover:text-blood-500"
          >
            Clear
          </button>
        )}
      </header>

      <div className="grid grid-cols-5 gap-3">
        {slots.map((id, idx) => {
          const hero: Hero | undefined = id ? heroes[id] : undefined
          return (
            <div key={idx} className="relative aspect-[3/4]">
              <AnimatePresence mode="popLayout">
                {hero ? (
                  <motion.button
                    key={`filled-${id}`}
                    layoutId={`hero-${id}`}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ type: "spring", stiffness: 320, damping: 26 }}
                    onClick={() => onRemove(id!)}
                    className={[
                      "group relative isolate flex h-full w-full flex-col justify-end overflow-hidden rounded-xl border border-blood-600/70 bg-night-800/70 text-left",
                      "ring-1 ring-inset ring-blood-500/30",
                    ].join(" ")}
                  >
                    <div
                      className={[
                        "absolute inset-0 -z-10 bg-gradient-to-tr opacity-90",
                        attrStyle(hero.primary_attr).bg,
                      ].join(" ")}
                    />
                    <div className="absolute inset-0 -z-10 bg-blood-700/15" />
                    <div className="absolute inset-x-0 top-0 flex justify-center pt-2">
                      <span className="font-display text-5xl font-black leading-none text-white/10">
                        {heroInitials(hero.name)}
                      </span>
                    </div>
                    <div className="relative space-y-0.5 p-2.5">
                      <p className="font-display text-[0.85rem] font-semibold leading-tight text-parchment">
                        {hero.name}
                      </p>
                      <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-blood-500">
                        ✕ Remove
                      </p>
                    </div>
                  </motion.button>
                ) : (
                  <motion.div
                    key={`empty-${idx}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex h-full w-full flex-col items-center justify-center rounded-xl border border-dashed border-night-600/60 bg-night-900/40"
                  >
                    <span className="font-display text-3xl font-black text-night-600">
                      {idx + 1}
                    </span>
                    <span className="mt-1 text-[0.6rem] font-bold uppercase tracking-[0.25em] text-night-500">
                      Empty
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </section>
  )
}
