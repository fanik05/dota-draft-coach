export type PrimaryAttr = "str" | "agi" | "int" | "all"

export interface Hero {
  name: string
  primary_attr: PrimaryAttr
  roles: string[]
}

export type HeroIndex = Record<string, Hero>

export interface HeroRef {
  id: string
  name: string
}

export interface Suggestion extends HeroRef {
  score: number
}

export interface SuggestResponse {
  enemies: HeroRef[]
  suggestions: Suggestion[]
}
