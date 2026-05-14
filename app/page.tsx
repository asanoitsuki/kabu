'use client'
import { useEffect, useState } from 'react'
import { useGameStore } from '@/store/gameStore'
import { useAuthStore } from '@/store/authStore'
import { supabase } from '@/lib/supabase'
import { getPendingCount } from '@/lib/friends'
import { App as CapApp } from '@capacitor/app'
import { Capacitor } from '@capacitor/core'
import LoginScreen from '@/components/auth/LoginScreen'
import StartScreen from '@/components/game/StartScreen'
import SetupScreen from '@/components/game/SetupScreen'
import GameScreen from '@/components/game/GameScreen'
import GameOverScreen from '@/components/game/GameOverScreen'
import HistoryScreen from '@/components/game/HistoryScreen'
import RankingScreen from '@/components/game/RankingScreen'
import BottomNav, { NavTab } from '@/components/BottomNav'
import AchievementsScreen from '@/components/game/AchievementsScreen'
import ProfileScreen from '@/components/auth/ProfileScreen'

type AppView = 'game' | 'profile' | 'history' | 'badges' | 'ranking'

export default function Home() {
  const { phase, startSetup, resetGame } = useGameStore()
  const { initialize, user, initialized } = useAuthStore()
  const [view, setView] = useState<AppView>('game')
  const [guestMode, setGuestMode] = useState(false)
  const [pendingFriends, setPendingFriends] = useState(0)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const tokenHash = params.get('token_hash')
    const type = params.get('type')
    if (tokenHash && type && supabase) {
      supabase.auth.verifyOtp({ token_hash: tokenHash, type: type as 'email' | 'magiclink' })
        .then(() => { window.history.replaceState({}, '', '/') })
    }
    initialize()

    // iOSネイティブ: OAuthコールバックのディープリンクを処理
    if (Capacitor.isNativePlatform()) {
      CapApp.addListener('appUrlOpen', async ({ url }) => {
        if (url.includes('login-callback') && supabase) {
          // URLフラグメントからトークンを取得
          // 例: com.startupstudio.app://login-callback#access_token=...
          const fragment = url.split('#')[1] ?? url.split('?')[1] ?? ''
          const params = new URLSearchParams(fragment)
          const accessToken = params.get('access_token')
          const refreshToken = params.get('refresh_token')
          if (accessToken && refreshToken) {
            await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            })
          }
        }
      })
    }
  }, [])

  useEffect(() => {
    if (initialized && !user) setGuestMode(false)
  }, [user, initialized])

  // フレンド通知バッジ（30秒ごとにポーリング）
  useEffect(() => {
    if (!user) return
    const refresh = () => getPendingCount(user.id).then(setPendingFriends)
    refresh()
    const timer = setInterval(refresh, 30000)
    return () => clearInterval(timer)
  }, [user])

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
    if (tab === 'startup') {
      // 起業タブ → ゲーム画面（現在のフェーズに戻る or スタート画面）
      setView('game')
    } else if (tab === 'profile') {
      setView('profile')
    } else {
      setView(tab as AppView)
    }
  }

  const activeTab: NavTab =
    view === 'profile' ? 'profile'
    : view === 'history' ? 'history'
    : view === 'badges'  ? 'badges'
    : view === 'ranking' ? 'ranking'
    : 'startup'

  const navProps = {
    onShowHistory: () => setView('history'),
    onShowRanking: () => setView('ranking'),
  }

  return (
    <div className="pb-20">
      {view === 'profile' ? (
        <ProfileScreen onClose={() => setView('game')} />
      ) : view === 'history' ? (
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

      <BottomNav active={activeTab} onTab={handleTab} pendingFriends={pendingFriends} />
    </div>
  )
}
