import { motion } from "motion/react"

export function Header() {
  return (
    <header className="relative pt-14 pb-10 text-center">
      <motion.p
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-xs font-semibold uppercase tracking-[0.55em] text-parchment-dim/80"
      >
        Dota 2 Counter Picker
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="mt-3 font-display text-6xl font-black tracking-[0.18em] text-parchment text-glow-ember sm:text-7xl"
      >
        DRAFT COACH
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
        className="ornate-divider mx-auto mt-6 w-72"
      />

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="mt-5 text-sm tracking-wide text-parchment-dim"
      >
        Pick the enemy lineup. We rank counters by{" "}
        <span className="font-semibold text-ember-500">advantage score</span>{" "}
        across all 127 heroes.
      </motion.p>
    </header>
  )
}
