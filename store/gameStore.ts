'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { GameState, Company, Allocation, Difficulty } from '@/lib/types'
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
      }),
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
      }),
    }
  )
)
