import type { PrimaryAttr } from "./types"

interface AttrStyle {
  label: string
  text: string
  ring: string
  glow: string
  bg: string
}

const STYLES: Record<PrimaryAttr, AttrStyle> = {
  str: {
    label: "STR",
    text: "text-attr-str",
    ring: "ring-attr-str/60",
    glow: "shadow-[0_0_24px_-4px_rgba(239,68,68,0.55)]",
    bg: "from-attr-str/30 via-attr-str/10 to-transparent",
  },
  agi: {
    label: "AGI",
    text: "text-attr-agi",
    ring: "ring-attr-agi/60",
    glow: "shadow-[0_0_24px_-4px_rgba(52,211,153,0.55)]",
    bg: "from-attr-agi/30 via-attr-agi/10 to-transparent",
  },
  int: {
    label: "INT",
    text: "text-attr-int",
    ring: "ring-attr-int/60",
    glow: "shadow-[0_0_24px_-4px_rgba(56,189,248,0.55)]",
    bg: "from-attr-int/30 via-attr-int/10 to-transparent",
  },
  all: {
    label: "UNI",
    text: "text-attr-all",
    ring: "ring-attr-all/60",
    glow: "shadow-[0_0_24px_-4px_rgba(192,132,252,0.55)]",
    bg: "from-attr-all/30 via-attr-all/10 to-transparent",
  },
}

export function attrStyle(attr: PrimaryAttr | string): AttrStyle {
  return STYLES[attr as PrimaryAttr] ?? STYLES.all
}

export function heroInitials(name: string): string {
  const parts = name.split(/[\s-]+/).filter(Boolean)
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase()
  return (parts[0]![0]! + parts[1]![0]!).toUpperCase()
}
