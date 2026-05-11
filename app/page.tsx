'use client'
import { useEffect, useState } from 'react'
import { useGameStore } from '@/store/gameStore'
import { useAuthStore } from '@/store/authStore'
import { supabase } from '@/lib/supabase'
import LoginScreen from '@/components/auth/LoginScreen'
import StartScreen from '@/components/game/StartScreen'
import SetupScreen from '@/components/game/SetupScreen'
import GameScreen from '@/components/game/GameScreen'
import GameOverScreen from '@/components/game/GameOverScreen'
import HistoryScreen from '@/components/game/HistoryScreen'

export default function Home() {
  const { phase, startSetup } = useGameStore()
  const { initialize, user, initialized } = useAuthStore()
  const [showHistory, setShowHistory] = useState(false)
  const [guestMode, setGuestMode] = useState(false)

  useEffect(() => {
    // マジックリンクのURLパラメータを処理（PKCE フロー対応）
    const params = new URLSearchParams(window.location.search)
    const tokenHash = params.get('token_hash')
    const type = params.get('type')
    if (tokenHash && type && supabase) {
      supabase.auth.verifyOtp({ token_hash: tokenHash, type: type as 'email' | 'magiclink' })
        .then(() => {
          window.history.replaceState({}, '', '/')
        })
    }
    initialize()
  }, [])

  // ログアウト or セッション切れでゲストモードもリセット
  useEffect(() => {
    if (initialized && !user) setGuestMode(false)
  }, [user, initialized])

  // 初期化中はローディング
  if (!initialized) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-gray-600 text-sm">読み込み中...</div>
      </div>
    )
  }

  // 未ログイン かつ ゲストモードでない場合はログイン画面
  if (!user && !guestMode) {
    return <LoginScreen onGuest={() => setGuestMode(true)} />
  }

  if (showHistory) {
    return (
      <HistoryScreen
        onBack={() => setShowHistory(false)}
        onPlay={() => { setShowHistory(false); startSetup() }}
      />
    )
  }

  const historyProps = { onShowHistory: () => setShowHistory(true) }

  if (phase === 'start')    return <StartScreen {...historyProps} />
  if (phase === 'setup')    return <SetupScreen />
  if (phase === 'playing')  return <GameScreen {...historyProps} />
  if (phase === 'gameover') return <GameOverScreen {...historyProps} />

  return <StartScreen {...historyProps} />
}
