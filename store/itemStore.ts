'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { GACHA_POOL } from '@/lib/items'

const XP_PER_COIN = 500 // 500XP溜まるごとに1コイン

interface ItemStore {
  inventory: Record<string, number>  // itemId -> count
  gachaCoins: number
  xpCheckpoint: number               // 最後にコインチェックした時点のXP

  rollGacha: () => string | null     // nullはコイン不足
  useItem: (itemId: string) => boolean
  addCoins: (n: number) => void
  syncXpCoins: (currentXp: number) => number // 新しく貰えるコイン数を返す
  getTotalItems: () => number
}

export const useItemStore = create<ItemStore>()(
  persist(
    (set, get) => ({
      inventory: {},
      gachaCoins: 3,       // 初回3コインサービス
      xpCheckpoint: 0,

      rollGacha: () => {
        const { gachaCoins, inventory } = get()
        if (gachaCoins < 1) return null
        const itemId = GACHA_POOL[Math.floor(Math.random() * GACHA_POOL.length)]
        set({
          gachaCoins: gachaCoins - 1,
          inventory: { ...inventory, [itemId]: (inventory[itemId] ?? 0) + 1 },
        })
        return itemId
      },

      useItem: (itemId: string) => {
        const { inventory } = get()
        if ((inventory[itemId] ?? 0) <= 0) return false
        set({ inventory: { ...inventory, [itemId]: inventory[itemId] - 1 } })
        return true
      },

      addCoins: (n: number) => set(s => ({ gachaCoins: s.gachaCoins + n })),

      syncXpCoins: (currentXp: number) => {
        const { xpCheckpoint } = get()
        const prev = Math.floor(xpCheckpoint / XP_PER_COIN)
        const next = Math.floor(currentXp / XP_PER_COIN)
        const earned = Math.max(0, next - prev)
        if (earned > 0) {
          set(s => ({ gachaCoins: s.gachaCoins + earned, xpCheckpoint: currentXp }))
        } else {
          set({ xpCheckpoint: currentXp })
        }
        return earned
      },

      getTotalItems: () => {
        const { inventory } = get()
        return Object.values(inventory).reduce((s, n) => s + n, 0)
      },
    }),
    { name: 'maybiz-items-v1' }
  )
)
