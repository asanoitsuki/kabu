'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Difficulty } from '@/lib/types'

// XP thresholds per level (level = index + 1)
const XP_THRESHOLDS = [0, 500, 1500, 3500, 7500, 15000, 30000, 60000, 100000]

export function calcLevel(xp: number): number {
  for (let i = XP_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= XP_THRESHOLDS[i]) return i + 1
  }
  return 1
}

export function xpToNextLevel(xp: number): { current: number; required: number; progress: number } {
  const lv = calcLevel(xp)
  const current = xp - (XP_THRESHOLDS[lv - 1] ?? 0)
  const required = lv < XP_THRESHOLDS.length ? XP_THRESHOLDS[lv] - (XP_THRESHOLDS[lv - 1] ?? 0) : 0
  const progress = required > 0 ? Math.min(100, (current / required) * 100) : 100
  return { current, required, progress }
}

export function calcXpGain(grade: string, difficulty: Difficulty): number {
  const base: Record<string, number> = { S: 500, A: 300, B: 150, C: 80, D: 40, F: 10 }
  const mult: Record<Difficulty, number> = { easy: 1, normal: 1.5, hard: 2, hell: 3 }
  return Math.round((base[grade] ?? 10) * (mult[difficulty] ?? 1))
}

interface AchievementStore {
  unlockedIds: string[]
  newIds: string[]
  totalPlays: number
  playedIndustries: string[]
  xp: number
  level: number
  lastXpGain: number  // 直前に獲得したXP (ゲームオーバー画面で表示)
  unlock: (ids: string[]) => void
  clearNew: () => void
  recordPlay: (industry: string) => void
  addXp: (amount: number) => void
}

export const useAchievementStore = create<AchievementStore>()(
  persist(
    (set, get) => ({
      unlockedIds: [],
      newIds: [],
      totalPlays: 0,
      playedIndustries: [],
      xp: 0,
      level: 1,
      lastXpGain: 0,

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

      addXp: (amount: number) => {
        const newXp = get().xp + amount
        set({ xp: newXp, level: calcLevel(newXp), lastXpGain: amount })
      },
    }),
    { name: 'kabu-achievements' }
  )
)
