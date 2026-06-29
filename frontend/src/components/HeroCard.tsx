import { motion } from "motion/react"
import type { Hero } from "../lib/types"
import { attrStyle, heroInitials } from "../lib/attr"

interface Props {
  id: string
  hero: Hero
  picked?: boolean
  onClick?: () => void
}

export function HeroCard({ id, hero, picked, onClick }: Props) {
  const style = attrStyle(hero.primary_attr)

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={picked}
      layoutId={`hero-${id}`}
      whileHover={picked ? undefined : { y: -4, scale: 1.04 }}
      whileTap={picked ? undefined : { scale: 0.96 }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
      className={[
        "group relative isolate flex aspect-[3/4] w-full select-none flex-col justify-end overflow-hidden rounded-xl border text-left",
        picked
          ? "cursor-not-allowed border-night-700 bg-night-900/30 opacity-30"
          : "cursor-pointer border-night-700/80 bg-night-800/60 ring-1 ring-inset ring-white/5 hover:border-ember-600/60",
      ].join(" ")}
    >
      <div
        className={[
          "absolute inset-0 -z-10 bg-gradient-to-tr opacity-70 transition-opacity duration-300",
          style.bg,
          picked ? "" : "group-hover:opacity-100",
        ].join(" ")}
      />
      <div className="absolute inset-x-0 top-0 -z-10 flex justify-center pt-3">
        <span className={[
          "font-display text-[5.5rem] font-black leading-none tracking-tight",
          "text-white/[0.06] transition-transform duration-500",
          picked ? "" : "group-hover:scale-110",
        ].join(" ")}>
          {heroInitials(hero.name)}
        </span>
      </div>

      <span
        className={[
          "absolute right-2 top-2 rounded px-1.5 py-0.5 text-[0.65rem] font-bold tracking-[0.2em]",
          style.text,
          "bg-night-950/70 backdrop-blur",
        ].join(" ")}
      >
        {style.label}
      </span>

      <div className="relative space-y-1 p-3">
        <p className="font-display text-[0.95rem] font-semibold leading-tight text-parchment">
          {hero.name}
        </p>
        <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-parchment-dim/80">
          {hero.roles.slice(0, 2).join(" · ")}
        </p>
      </div>

      {!picked && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-xl opacity-0 ring-2 ring-inset ring-ember-500/60 transition-opacity duration-200 group-hover:opacity-100"
        />
      )}
    </motion.button>
  )
}
