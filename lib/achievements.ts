import { Achievement, GameState } from './types'

export const ALL_ACHIEVEMENTS: Achievement[] = [
  // Common
  { id: 'first_game',      icon: '🏢', rarity: 'common',    title: 'はじめての決算',     description: 'はじめてゲームをクリアした' },
  { id: 'first_positive',  icon: '📈', rarity: 'common',    title: 'プラス圏突破',       description: 'はじめてプラスリターンで終えた' },
  { id: 'play_5',          icon: '📊', rarity: 'common',    title: '5回プレイ',          description: '5回ゲームをプレイした' },
  { id: 'survived_event',  icon: '⚡', rarity: 'common',    title: 'イベント体験済み',   description: 'ネガティブイベントを経験した' },

  // Rare
  { id: 'rank_b',          icon: '🥈', rarity: 'rare',      title: 'Bランク達成',        description: 'Bランク以上で終えた' },
  { id: 'rank_a',          icon: '🏆', rarity: 'rare',      title: 'Aランク達成',        description: 'Aランク以上で終えた' },
  { id: 'play_10',         icon: '🎖️', rarity: 'rare',      title: 'ベテラン経営者',     description: '10回ゲームをプレイした' },
  { id: 'millionaire',     icon: '💰', rarity: 'rare',      title: '億万長者',           description: '時価総額10億円を突破した' },
  { id: 'survived_scandal',icon: '💥', rarity: 'rare',      title: '不祥事サバイバー',   description: '不祥事を乗り越えてプラスで終えた' },
  { id: 'survived_pandemic',icon:'🦠', rarity: 'rare',      title: 'パンデミック生還',   description: 'パンデミックを経験してクリアした' },
  { id: 'no_drop',         icon: '🛡️', rarity: 'rare',      title: '無傷の経営',         description: '一度もIPO価格を下回らなかった' },

  // Epic
  { id: 'rank_s',          icon: '👑', rarity: 'epic',      title: '経営の天才',         description: 'Sランクを達成した' },
  { id: 'ten_x',           icon: '🚀', rarity: 'epic',      title: 'テンバガー',         description: '株価をIPOの10倍にした' },
  { id: 'all_industries',  icon: '🌍', rarity: 'epic',      title: '全業種制覇',         description: '全5業種でゲームをプレイした' },
  { id: 'comeback',        icon: '🔥', rarity: 'epic',      title: '奇跡の復活',         description: '-30%から逆転してプラスで終えた' },
  { id: 'it_master',       icon: '💻', rarity: 'epic',      title: 'ITの覇者',           description: 'IT業でSランクを達成した' },
  { id: 'food_master',     icon: '🍜', rarity: 'epic',      title: '食の帝王',           description: '飲食業でSランクを達成した' },
  { id: 'finance_master',  icon: '🏦', rarity: 'epic',      title: '金融の達人',         description: '金融業でSランクを達成した' },
  { id: 'mfg_master',      icon: '🏭', rarity: 'epic',      title: '製造の神',           description: '製造業でSランクを達成した' },
  { id: 'ent_master',      icon: '🎭', rarity: 'epic',      title: 'エンタメ王',         description: 'エンタメ業でSランクを達成した' },

  // Legendary
  { id: 'hell_clear',      icon: '💀', rarity: 'legendary', title: '地獄クリア',         description: '地獄難易度でゲームをクリアした' },
  { id: 'hell_s',          icon: '🔱', rarity: 'legendary', title: '地獄の王者',         description: '地獄難易度でSランクを達成した' },
  { id: 'perfect',         icon: '✨', rarity: 'legendary', title: '完璧な経営',         description: '+500%以上で終えた' },
]

export function checkAchievements(
  state: GameState,
  alreadyUnlocked: string[],
  totalPlays: number,
  playedIndustries: string[],
  lowestReturn: number,
): string[] {
  const newIds: string[] = []
  const has = (id: string) => alreadyUnlocked.includes(id)
  const add = (id: string) => { if (!has(id)) newIds.push(id) }

  const { stockHistory, financials, reports, difficulty, company } = state
  if (!company) return []

  const ipoPrice = stockHistory[0]?.price ?? 1
  const finalPrice = stockHistory.at(-1)?.price ?? 1
  const totalReturn = (finalPrice - ipoPrice) / ipoPrice
  const grade = (() => {
    const g = totalReturn
    if (g >= 2.0) return 'S'
    if (g >= 1.0) return 'A'
    if (g >= 0.5) return 'B'
    if (g >= 0.0) return 'C'
    if (g >= -0.3) return 'D'
    return 'F'
  })()

  const eventIds = reports.map(r => r.event?.id).filter(Boolean)
  const marketCap = finalPrice * financials.shares

  // Common
  add('first_game')
  if (totalReturn > 0) add('first_positive')
  if (totalPlays >= 5) add('play_5')
  if (eventIds.some(id => ['recession','scandal','cyber_attack','pandemic','market_crash','sns_fire'].includes(id!))) {
    add('survived_event')
  }

  // Rare
  if (['B','A','S'].includes(grade)) add('rank_b')
  if (['A','S'].includes(grade)) add('rank_a')
  if (totalPlays >= 10) add('play_10')
  if (marketCap >= 1_000_000_000) add('millionaire')
  if (eventIds.includes('scandal') && totalReturn > 0) add('survived_scandal')
  if (eventIds.includes('pandemic')) add('survived_pandemic')
  if (lowestReturn >= 0) add('no_drop')

  // Epic
  if (grade === 'S') add('rank_s')
  if (totalReturn >= 9.0) add('ten_x')
  if (playedIndustries.length >= 5) add('all_industries')
  if (lowestReturn <= -0.3 && totalReturn > 0) add('comeback')
  if (grade === 'S' && company.industry === 'IT') add('it_master')
  if (grade === 'S' && company.industry === '飲食') add('food_master')
  if (grade === 'S' && company.industry === '金融') add('finance_master')
  if (grade === 'S' && company.industry === '製造') add('mfg_master')
  if (grade === 'S' && company.industry === 'エンタメ') add('ent_master')

  // Legendary
  if (difficulty === 'hell') add('hell_clear')
  if (difficulty === 'hell' && grade === 'S') add('hell_s')
  if (totalReturn >= 5.0) add('perfect')

  return newIds
}
