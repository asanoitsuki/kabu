export type ItemRarity = 'common' | 'rare' | 'epic'

export interface ItemDef {
  id: string
  name: string
  emoji: string
  description: string
  shortEffect: string
  rarity: ItemRarity
  color: string
  bg: string
  border: string
}

export const ITEMS: ItemDef[] = [
  {
    id: 'stock_recovery',
    name: '株価回復薬',
    emoji: '💊',
    description: '株価が下落している時に使用。現在の株価をIPO価格まで即時回復させる。どん底からの逆転に。',
    shortEffect: '株価をIPO価格まで即回復',
    rarity: 'common',
    color: '#10b981',
    bg: 'bg-emerald-950',
    border: 'border-emerald-700',
  },
  {
    id: 'motivation_reform',
    name: '方針改正書',
    emoji: '📋',
    description: '大胆な方針転換で従業員のやる気が急上昇。次のターンの利益が+50%増加する。',
    shortEffect: '次ターン利益 +50%',
    rarity: 'rare',
    color: '#6366f1',
    bg: 'bg-indigo-950',
    border: 'border-indigo-600',
  },
  {
    id: 'divine_move',
    name: '神の一手',
    emoji: '⚡',
    description: '天才的な経営判断が市場を動かす。次のターンの株価変動が必ずプラスになる。',
    shortEffect: '次ターン株価必ず上昇',
    rarity: 'epic',
    color: '#f59e0b',
    bg: 'bg-yellow-950',
    border: 'border-yellow-600',
  },
  {
    id: 'crisis_manual',
    name: '危機管理マニュアル',
    emoji: '🛡️',
    description: '万全の危機管理体制を整備。次に発生するネガティブイベントを完全に無効化する。',
    shortEffect: '次のネガティブイベント無効',
    rarity: 'rare',
    color: '#8b5cf6',
    bg: 'bg-violet-950',
    border: 'border-violet-600',
  },
  {
    id: 'rocket_booster',
    name: 'ロケットブースター',
    emoji: '🚀',
    description: '経営資源を全力投下。次の3ターン間、売上成長率が1.5倍になる爆発的な成長を実現。',
    shortEffect: '3ターン間売上 ×1.5',
    rarity: 'epic',
    color: '#ef4444',
    bg: 'bg-red-950',
    border: 'border-red-700',
  },
]

export const ITEM_MAP: Record<string, ItemDef> = Object.fromEntries(ITEMS.map(i => [i.id, i]))

// ガチャプール (25枚) common=40% rare=40% epic=20%
export const GACHA_POOL: string[] = [
  ...Array(10).fill('stock_recovery'),   // common 40%
  ...Array(6).fill('motivation_reform'), // rare 24%
  ...Array(4).fill('crisis_manual'),     // rare 16%
  ...Array(3).fill('divine_move'),       // epic 12%
  ...Array(2).fill('rocket_booster'),    // epic  8%
]

export const RARITY_CONFIG: Record<ItemRarity, { label: string; textColor: string; glow: string; particleColor: string[] }> = {
  common: {
    label: 'コモン',
    textColor: 'text-gray-300',
    glow: '#9ca3af',
    particleColor: ['#9ca3af', '#d1d5db', '#ffffff'],
  },
  rare: {
    label: 'レア',
    textColor: 'text-blue-400',
    glow: '#60a5fa',
    particleColor: ['#3b82f6', '#60a5fa', '#93c5fd', '#ffffff'],
  },
  epic: {
    label: 'エピック',
    textColor: 'text-yellow-400',
    glow: '#fbbf24',
    particleColor: ['#f59e0b', '#fbbf24', '#fde68a', '#ffffff', '#ef4444'],
  },
}
