'use client'
import { create } from 'zustand'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthStore {
  user: User | null
  initialized: boolean
  initialize: () => void
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  initialized: false,

  initialize: () => {
    if (!supabase) {
      set({ initialized: true })
      return
    }

    supabase.auth.getSession().then(({ data }) => {
      set({ user: data.session?.user ?? null, initialized: true })
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ user: session?.user ?? null })
    })
  },

  signInWithGoogle: async () => {
    if (!supabase) return
    const isNative = typeof window !== 'undefined' && (window as any).Capacitor?.isNativePlatform?.()
    const redirectTo = isNative
      ? 'com.startupstudio.app://login-callback'
      : (typeof window !== 'undefined' ? window.location.origin : '')
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    })
  },

  signInWithEmail: async (email: string) => {
    if (!supabase) return { error: 'Supabaseが設定されていません' }
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : '' },
    })
    return { error: error?.message ?? null }
  },

  signOut: async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    set({ user: null })
  },
}))
