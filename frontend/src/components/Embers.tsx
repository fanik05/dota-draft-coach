import { useMemo } from "react"

const COUNT = 18

export function Embers() {
  const particles = useMemo(
    () =>
      Array.from({ length: COUNT }, (_, i) => ({
        left: `${(i * 97) % 100}%`,
        delay: `${(i * 0.7) % 14}s`,
        duration: `${10 + (i % 7) * 2}s`,
        scale: 0.6 + ((i * 13) % 100) / 140,
      })),
    [],
  )

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {particles.map((p, i) => (
        <span
          key={i}
          className="ember-particle"
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            transform: `scale(${p.scale})`,
          }}
        />
      ))}
    </div>
  )
}
