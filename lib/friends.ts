import { supabase } from './supabase'
import type { UserProfile } from './profile'

export interface FriendEntry {
  id: string
  friendId: string
  friendProfile: UserProfile | null
  status: 'pending' | 'accepted'
  iAmRequester: boolean
}

export async function sendFriendRequest(myId: string, targetId: string): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Supabase未設定' }
  if (myId === targetId) return { error: '自分自身には申請できません' }

  // 既存チェック（双方向）
  const { data: existing } = await supabase
    .from('friendships')
    .select('id, status')
    .or(`and(requester_id.eq.${myId},receiver_id.eq.${targetId}),and(requester_id.eq.${targetId},receiver_id.eq.${myId})`)
    .maybeSingle()

  if (existing) {
    if (existing.status === 'accepted') return { error: '既にフレンドです' }
    return { error: '既に申請済みです' }
  }

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

export async function declineFriendRequest(myId: string, requesterId: string): Promise<void> {
  if (!supabase) return
  await supabase
    .from('friendships')
    .delete()
    .eq('requester_id', requesterId)
    .eq('receiver_id', myId)
}

export async function removeFriend(myId: string, friendId: string): Promise<void> {
  if (!supabase) return
  // 双方向で削除
  await supabase
    .from('friendships')
    .delete()
    .or(`and(requester_id.eq.${myId},receiver_id.eq.${friendId}),and(requester_id.eq.${friendId},receiver_id.eq.${myId})`)
}

export async function getFriends(myId: string): Promise<FriendEntry[]> {
  if (!supabase) return []

  // Step1: 自分が絡む全フレンドシップを取得
  const { data: rows } = await supabase
    .from('friendships')
    .select('id, requester_id, receiver_id, status')
    .or(`requester_id.eq.${myId},receiver_id.eq.${myId}`)

  if (!rows || rows.length === 0) return []

  // Step2: 相手のIDを集める
  const friendIds = rows.map(r => r.requester_id === myId ? r.receiver_id : r.requester_id)

  // Step3: プロフィール一括取得
  const { data: profilesData } = await supabase
    .from('profiles')
    .select('*')
    .in('id', friendIds)

  const profileMap = new Map<string, UserProfile>(
    (profilesData ?? []).map((p: UserProfile) => [p.id, p])
  )

  return rows.map(r => {
    const iAmRequester = r.requester_id === myId
    const friendId = iAmRequester ? r.receiver_id : r.requester_id
    return {
      id: r.id,
      friendId,
      friendProfile: profileMap.get(friendId) ?? null,
      status: r.status as 'pending' | 'accepted',
      iAmRequester,
    }
  })
}

export async function getPendingCount(myId: string): Promise<number> {
  if (!supabase) return 0
  const { count } = await supabase
    .from('friendships')
    .select('id', { count: 'exact', head: true })
    .eq('receiver_id', myId)
    .eq('status', 'pending')
  return count ?? 0
}
