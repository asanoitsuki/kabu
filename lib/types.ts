export type Industry = 'IT' | '製造' | '飲食' | '金融' | 'エンタメ' | '医療' | '不動産' | '教育' | '物流' | '小売'

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

export interface ActiveEffects {
  profitMultiplier: number       // 方針改正書: 1.5 (next turn only)
  forcePositiveSentiment: boolean // 神の一手: next turn stock always up
  nullifyNextNegEvent: boolean   // 危機管理マニュアル
  revenueMultiplier: number      // ロケットブースター: 1.5
  revenueBoostTurns: number      // turns remaining for boost
  stockRecoveryUsed: boolean     // 株価回復薬 used this game
}

export const DEFAULT_EFFECTS: ActiveEffects = {
  profitMultiplier: 1,
  forcePositiveSentiment: false,
  nullifyNextNegEvent: false,
  revenueMultiplier: 1,
  revenueBoostTurns: 0,
  stockRecoveryUsed: false,
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
  bankrupted?: boolean  // 資金ゼロで倒産した場合 true
  activeEffects: ActiveEffects
}
