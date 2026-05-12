import { supabase } from './supabase'
import { GameState } from './types'
import { getRating } from './gameLogic'

export interface RankingEntry {
  id: string
  display_name: string
  company_name: string
  industry: string
  difficulty: string
  grade: string
  ipo_price: number
  final_price: number
  total_return: number
  turns_played: number
  played_at: string
}

export interface SaveSlot {
  id: string
  company_name: string
  industry: string
  difficulty: string
  turn: number
  max_turns: number
  grade: string
  current_price: number
  ipo_price: number
  total_return: number
  game_state: GameState
  updated_at: string
}

export async function cloudSaveGame(userId: string, state: GameState): Promise<void> {
  if (!supabase || !state.company) return
  const ipoPrice = state.stockHistory[0]?.price ?? 1
  const currentPrice = state.stockHistory.at(-1)?.price ?? 1
  const totalReturn = ((currentPrice - ipoPrice) / ipoPrice) * 100
  const { grade } = getRating(state.stockHistory, state.difficulty)

  await supabase.from('game_saves').upsert(
    {
      user_id: userId,
      game_state: state,
      company_name: state.company.name,
      industry: state.company.industry,
      difficulty: state.difficulty,
      turn: state.turn,
      max_turns: state.maxTurns,
      grade,
      current_price: currentPrice,
      ipo_price: ipoPrice,
      total_return: Number(totalReturn.toFixed(1)),
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,company_name' },
  )
}

export async function loadAllSaves(userId: string): Promise<SaveSlot[]> {
  if (!supabase) return []
  const { data } = await supabase
    .from('game_saves')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
  return (data as SaveSlot[]) ?? []
}

export async function cloudLoadGame(userId: string): Promise<GameState | null> {
  if (!supabase) return null
  const { data } = await supabase
    .from('game_saves')
    .select('game_state')
    .eq('user_id', userId)
    .eq('game_state->>phase', 'playing')
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  return (data?.game_state as GameState) ?? null
}

export async function deleteSave(userId: string, companyName: string): Promise<void> {
  if (!supabase) return
  await supabase
    .from('game_saves')
    .delete()
    .eq('user_id', userId)
    .eq('company_name', companyName)
}

export async function saveGameResult(
  userId: string,
  displayName: string,
  state: GameState,
): Promise<void> {
  if (!supabase || !state.company) return
  const ipoPrice   = state.stockHistory[0]?.price ?? 1
  const finalPrice = state.stockHistory.at(-1)?.price ?? 1
  const totalReturn = ((finalPrice - ipoPrice) / ipoPrice) * 100
  const { grade } = getRating(state.stockHistory, state.difficulty)

  const newReturn = Number(totalReturn.toFixed(1))

  // 同じ会社の全既存レコードを取得
  const { data: existingRows } = await supabase
    .from('game_results')
    .select('id, total_return')
    .eq('user_id', userId)
    .eq('company_name', state.company.name)
    .order('total_return', { ascending: false })

  const best = existingRows?.[0]

  // ベストスコア以下なら保存しない
  if (best && best.total_return >= newReturn) return

  // 既存レコードをすべて削除（RLS deleteポリシーが必要）
  if (existingRows && existingRows.length > 0) {
    await supabase.from('game_results').delete()
      .eq('user_id', userId)
      .eq('company_name', state.company.name)
  }

  await supabase.from('game_results').insert({
    user_id:      userId,
    display_name: displayName,
    company_name: state.company.name,
    industry:     state.company.industry,
    difficulty:   state.difficulty,
    grade,
    ipo_price:    ipoPrice,
    final_price:  finalPrice,
    total_return: newReturn,
    turns_played: state.reports.length,
  })
}

export async function fetchRankings(opts?: {
  difficulty?: string
  industry?: string
  limit?: number
}): Promise<RankingEntry[]> {
  if (!supabase) return []
  let query = supabase
    .from('game_results')
    .select('id,display_name,company_name,industry,difficulty,grade,ipo_price,final_price,total_return,turns_played,played_at')
    .order('total_return', { ascending: false })
    .limit(opts?.limit ?? 100)

  if (opts?.difficulty) query = query.eq('difficulty', opts.difficulty)
  if (opts?.industry)   query = query.eq('industry',   opts.industry)

  const { data } = await query
  return (data as RankingEntry[]) ?? []
}

export async function fetchLocalRankings(
  userId: string,
  opts?: { difficulty?: string; industry?: string },
): Promise<{ entries: RankingEntry[]; userRank: number }> {
  if (!supabase) return { entries: [], userRank: -1 }

  // ユーザーのベストスコアを取得
  let userQ = supabase.from('game_results').select('total_return').eq('user_id', userId)
  if (opts?.difficulty) userQ = userQ.eq('difficulty', opts.difficulty)
  if (opts?.industry)   userQ = userQ.eq('industry',   opts.industry)
  const { data: userBestData } = await userQ.order('total_return', { ascending: false }).limit(1).maybeSingle()
  if (!userBestData) return { entries: [], userRank: -1 }

  const userBest = userBestData.total_return

  // 自分より上のエントリ数 = 自分の順位 - 1
  let countQ = supabase.from('game_results').select('id', { count: 'exact', head: true }).gt('total_return', userBest)
  if (opts?.difficulty) countQ = countQ.eq('difficulty', opts.difficulty)
  if (opts?.industry)   countQ = countQ.eq('industry',   opts.industry)
  const { count } = await countQ

  const userRank = (count ?? 0) + 1
  const offset = Math.max(0, userRank - 6)

  let query = supabase
    .from('game_results')
    .select('id,display_name,company_name,industry,difficulty,grade,ipo_price,final_price,total_return,turns_played,played_at')
    .order('total_return', { ascending: false })
    .range(offset, offset + 11)

  if (opts?.difficulty) query = query.eq('difficulty', opts.difficulty)
  if (opts?.industry)   query = query.eq('industry',   opts.industry)

  const { data } = await query
  return { entries: (data as RankingEntry[]) ?? [], userRank }
}
