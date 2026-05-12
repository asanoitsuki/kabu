'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AchievementStore {
  unlockedIds: string[]
  newIds: string[]        // shown as notification, then cleared
  totalPlays: number
  playedIndustries: string[]
  unlock: (ids: string[]) => void
  clearNew: () => void
  recordPlay: (industry: string) => void
}

export const useAchievementStore = create<AchievementStore>()(
  persist(
    (set, get) => ({
      unlockedIds: [],
      newIds: [],
      totalPlays: 0,
      playedIndustries: [],

      unlock: (ids: string[]) => {
        if (ids.length === 0) return
        set(s => ({
          unlockedIds: [...new Set([...s.unlockedIds, ...ids])],
          newIds: [...new Set([...s.newIds, ...ids])],
        }))
      },

      clearNew: () => set({ newIds: [] }),

      recordPlay: (industry: string) => set(s => ({
        totalPlays: s.totalPlays + 1,
        playedIndustries: [...new Set([...s.playedIndustries, industry])],
      })),
    }),
    { name: 'kabu-achievements' }
  )
)
