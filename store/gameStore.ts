'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { GameState, Company, Allocation, Difficulty, DEFAULT_EFFECTS } from '@/lib/types'
import {
  createInitialFinancials,
  calcStockPrice,
  processTurn,
  INDUSTRY_STATS,
} from '@/lib/gameLogic'

interface GameStore extends GameState {
  startSetup: () => void
  foundCompany: (company: Company, difficulty: Difficulty) => void
  setAllocation: (allocation: Allocation) => void
  endTurn: () => void
  resetGame: () => void
  loadFromCloud: (state: GameState) => void
  // アイテム効果適用
  applyStockRecovery: () => void
  applyMotivationReform: () => void
  applyDivineMove: () => void
  applyCrisisManual: () => void
  applyRocketBooster: () => void
}

const initialState: GameState = {
  phase: 'start',
  company: null,
  difficulty: 'normal',
  turn: 1,
  maxTurns: 20,
  financials: createInitialFinancials(),
  stockHistory: [],
  currentAllocation: { rd: 0, marketing: 0, hiring: 0, capex: 0, dividend: 0 },
  reports: [],
  pendingEvent: null,
  marketSentiment: 0,
  industryStats: INDUSTRY_STATS,
  activeEffects: DEFAULT_EFFECTS,
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      startSetup: () => set({ phase: 'setup' }),

      foundCompany: (company: Company, difficulty: Difficulty) => {
        const financials = createInitialFinancials()
        const initialPrice = calcStockPrice(financials, company.industry, 0)
        set({
          phase: 'playing',
          company,
          difficulty,
          turn: 1,
          financials,
          stockHistory: [{ turn: 0, price: initialPrice, label: 'IPO' }],
          currentAllocation: { rd: 0, marketing: 0, hiring: 0, capex: 0, dividend: 0 },
          reports: [],
          marketSentiment: 0,
          activeEffects: DEFAULT_EFFECTS,
        })
      },

      setAllocation: (allocation: Allocation) => set({ currentAllocation: allocation }),

      endTurn: () => {
        const state = get()
        const { newState } = processTurn(state, state.currentAllocation)
        set(newState)
      },

      resetGame: () => set(initialState),

      loadFromCloud: (state: GameState) => set({
        ...state,
        industryStats: INDUSTRY_STATS,
        activeEffects: state.activeEffects ?? DEFAULT_EFFECTS,
      }),

      // 💊 株価回復薬: IPO価格まで回復
      applyStockRecovery: () => {
        const { stockHistory, activeEffects } = get()
        if (activeEffects.stockRecoveryUsed) return
        const ipoPrice = stockHistory[0]?.price ?? 1
        const newHistory = stockHistory.map((h, i) =>
          i === stockHistory.length - 1 ? { ...h, price: Math.max(h.price, ipoPrice) } : h
        )
        set({
          stockHistory: newHistory,
          activeEffects: { ...activeEffects, stockRecoveryUsed: true },
        })
      },

      // 📋 方針改正書: 次ターン利益+50%
      applyMotivationReform: () => {
        const { activeEffects } = get()
        set({ activeEffects: { ...activeEffects, profitMultiplier: 1.5 } })
      },

      // ⚡ 神の一手: 次ターン株価必ず上昇
      applyDivineMove: () => {
        const { activeEffects } = get()
        set({ activeEffects: { ...activeEffects, forcePositiveSentiment: true } })
      },

      // 🛡️ 危機管理マニュアル: 次のネガティブイベント無効
      applyCrisisManual: () => {
        const { activeEffects } = get()
        set({ activeEffects: { ...activeEffects, nullifyNextNegEvent: true } })
      },

      // 🚀 ロケットブースター: 3ターン間売上1.5倍
      applyRocketBooster: () => {
        const { activeEffects } = get()
        set({ activeEffects: { ...activeEffects, revenueMultiplier: 1.5, revenueBoostTurns: 3 } })
      },
    }),
    {
      name: 'kabu-game-storage',
      partialize: (state) => ({
        phase: state.phase,
        company: state.company,
        difficulty: state.difficulty,
        turn: state.turn,
        financials: state.financials,
        stockHistory: state.stockHistory,
        currentAllocation: state.currentAllocation,
        reports: state.reports,
        marketSentiment: state.marketSentiment,
        maxTurns: state.maxTurns,
        activeEffects: state.activeEffects,
      }),
    }
  )
)
