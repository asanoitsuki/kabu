import { supabase } from './supabase'
import { GameState } from './types'
import { getRating } from './gameLogic'

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
