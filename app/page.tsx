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
import RankingScreen from '@/components/game/RankingScreen'
import BottomNav, { NavTab } from '@/components/BottomNav'
import AchievementsScreen from '@/components/game/AchievementsScreen'

type AppView = 'game' | 'history' | 'badges' | 'ranking'

export default function Home() {
  const { phase, startSetup, resetGame } = useGameStore()
  const { initialize, user, initialized } = useAuthStore()
  const [view, setView] = useState<AppView>('game')
  const [guestMode, setGuestMode] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const tokenHash = params.get('token_hash')
    const type = params.get('type')
    if (tokenHash && type && supabase) {
      supabase.auth.verifyOtp({ token_hash: tokenHash, type: type as 'email' | 'magiclink' })
        .then(() => { window.history.replaceState({}, '', '/') })
    }
    initialize()
  }, [])

  useEffect(() => {
    if (initialized && !user) setGuestMode(false)
  }, [user, initialized])

  if (!initialized) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-gray-600 text-sm">読み込み中...</div>
      </div>
    )
  }

  if (!user && !guestMode) {
    return <LoginScreen onGuest={() => setGuestMode(true)} />
  }

  function handleTab(tab: NavTab) {
    if (tab === 'home') {
      setView('game')
    } else if (tab === 'startup') {
      // 起業タブ → 会社設立フローへ
      setView('game')
      resetGame()
      startSetup()
    } else {
      setView(tab as AppView)
    }
  }

  const activeTab: NavTab =
    view === 'history' ? 'history'
    : view === 'badges'  ? 'badges'
    : view === 'ranking' ? 'ranking'
    : (phase === 'setup' ? 'startup' : 'home')

  const navProps = {
    onShowHistory: () => setView('history'),
    onShowRanking: () => setView('ranking'),
  }

  return (
    <div className="pb-16">
      {view === 'history' ? (
        <HistoryScreen
          onBack={() => setView('game')}
          onPlay={() => { setView('game'); startSetup() }}
        />
      ) : view === 'ranking' ? (
        <RankingScreen onBack={() => setView('game')} />
      ) : view === 'badges' ? (
        <AchievementsScreen />
      ) : (
        <>
          {phase === 'start'    && <StartScreen    {...navProps} />}
          {phase === 'setup'    && <SetupScreen />}
          {phase === 'playing'  && <GameScreen     {...navProps} />}
          {phase === 'gameover' && <GameOverScreen {...navProps} />}
          {!['start','setup','playing','gameover'].includes(phase) && <StartScreen {...navProps} />}
        </>
      )}

      <BottomNav active={activeTab} onTab={handleTab} />
    </div>
  )
}
