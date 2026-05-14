import { supabase } from './supabase'

export interface UserProfile {
  id: string
  username: string
  avatar: string
  xp: number
  level: number
}

export async function getProfile(userId: string): Promise<UserProfile | null> {
  if (!supabase) return null
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()
  return data as UserProfile | null
}

export async function upsertProfile(profile: Partial<UserProfile> & { id: string }): Promise<void> {
  if (!supabase) return
  await supabase.from('profiles').upsert({
    ...profile,
    updated_at: new Date().toISOString(),
  })
}

export async function searchProfiles(query: string): Promise<UserProfile[]> {
  if (!supabase || query.length < 2) return []
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .ilike('username', `%${query}%`)
    .limit(10)
  return (data as UserProfile[]) ?? []
}
