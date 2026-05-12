export type Industry = 'IT' | '製造' | '飲食' | '金融' | 'エンタメ'

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}
export type Difficulty = 'easy' | 'normal' | 'hard' | 'hell'

export interface Company {
  name: string
  industry: Industry
  foundedTurn: number
  color: string
}

export interface Financials {
  revenue: number
  expenses: number
  profit: number
  cash: number
  assets: number
  shares: number
  eps: number
}

export interface Allocation {
  rd: number
  marketing: number
  hiring: number
  capex: number
  dividend: number
}

export interface GameEvent {
  id: string
  title: string
  description: string
  effect: Partial<{
    revenueMultiplier: number
    expenseMultiplier: number
    stockSentiment: number
  }>
  icon: string
}

export interface TurnReport {
  turn: number
  financials: Financials
  stockPrice: number
  event: GameEvent | null
  allocation: Allocation
}

export interface GameState {
  phase: 'start' | 'setup' | 'playing' | 'gameover'
  company: Company | null
  difficulty: Difficulty
  turn: number
  maxTurns: number
  financials: Financials
  stockHistory: { turn: number; price: number; label: string }[]
  currentAllocation: Allocation
  reports: TurnReport[]
  pendingEvent: GameEvent | null
  marketSentiment: number
  industryStats: {
    [K in Industry]: { per: number; growth: number }
  }
}
