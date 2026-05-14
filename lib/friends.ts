import { supabase } from './supabase'
import type { UserProfile } from './profile'

export interface FriendEntry {
  id: string       // friendship record id
  friendId: string
  friendProfile: UserProfile | null
  status: 'pending' | 'accepted'
  iAmRequester: boolean
}

export async function sendFriendRequest(myId: string, targetId: string): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Supabase未設定' }
  if (myId === targetId) return { error: '自分自身にはフレンド申請できません' }

  // 既存チェック
  const { data: existing } = await supabase
    .from('friendships')
    .select('*')
    .or(`and(requester_id.eq.${myId},receiver_id.eq.${targetId}),and(requester_id.eq.${targetId},receiver_id.eq.${myId})`)
    .maybeSingle()

  if (existing) return { error: '既にフレンド申請済みまたはフレンドです' }

  const { error } = await supabase.from('friendships').insert({
    requester_id: myId,
    receiver_id: targetId,
    status: 'pending',
  })
  return { error: error?.message ?? null }
}

export async function acceptFriendRequest(myId: string, requesterId: string): Promise<void> {
  if (!supabase) return
  await supabase
    .from('friendships')
    .update({ status: 'accepted' })
    .eq('requester_id', requesterId)
    .eq('receiver_id', myId)
}

export async function removeFriend(myId: string, friendId: string): Promise<void> {
  if (!supabase) return
  await supabase
    .from('friendships')
    .delete()
    .or(`and(requester_id.eq.${myId},receiver_id.eq.${friendId}),and(requester_id.eq.${friendId},receiver_id.eq.${myId})`)
}

export async function getFriends(myId: string): Promise<FriendEntry[]> {
  if (!supabase) return []

  const { data } = await supabase
    .from('friendships')
    .select(`
      id,
      requester_id,
      receiver_id,
      status,
      requester:profiles!friendships_requester_id_fkey(*),
      receiver:profiles!friendships_receiver_id_fkey(*)
    `)
    .or(`requester_id.eq.${myId},receiver_id.eq.${myId}`)

  if (!data) return []

  return data.map((row: any) => {
    const iAmRequester = row.requester_id === myId
    const friendProfile = iAmRequester ? row.receiver : row.requester
    const friendId = iAmRequester ? row.receiver_id : row.requester_id
    return {
      id: row.id,
      friendId,
      friendProfile: friendProfile as UserProfile | null,
      status: row.status as 'pending' | 'accepted',
      iAmRequester,
    }
  })
}
