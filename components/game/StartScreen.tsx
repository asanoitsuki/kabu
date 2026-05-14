'use client'
import { useEffect, useState } from 'react'
import { useGameStore } from '@/store/gameStore'
import { useAuthStore } from '@/store/authStore'
import { useAchievementStore, calcLevel } from '@/store/achievementStore'
import { cloudLoadGame } from '@/lib/cloudSave'
import { getProfile } from '@/lib/profile'
import { GameState } from '@/lib/types'
import AuthModal from '@/components/auth/AuthModal'
import AdBanner from '@/components/AdBanner'
import GlossaryModal from '@/components/game/GlossaryModal'
import Image from 'next/image'

const TICKER = [
  { name: 'テックスター', price: '¥4,280', change: '+328%', up: true },
  { name: 'フードキング', price: '¥2,110', change: '+111%', up: true },
  { name: 'グローバル金融', price: '¥980',  change: '-2%',   up: false },
  { name: 'エンタメ革命',  price: '¥6,500', change: '+550%', up: true },
  { name: 'スマート製造',  price: '¥1,340', change: '+34%',  up: true },
]

interface Props {
  onShowHistory: () => void
  onShowRanking: () => void
}

export default function StartScreen({ onShowHistory, onShowRanking }: Props) {
  const { startSetup, resetGame, phase, loadFromCloud } = useGameStore()
  const { user, initialized } = useAuthStore()
  const { xp } = useAchievementStore()
  const [showAuth, setShowAuth] = useState(false)
  const [cloudSave, setCloudSave] = useState<GameState | null>(null)
  const [showGlossary, setShowGlossary] = useState(false)
  const [profileAvatar, setProfileAvatar] = useState('😊')
  const [profileName, setProfileName] = useState('')

  useEffect(() => {
    if (!user) { setCloudSave(null); return }
    cloudLoadGame(user.id).then(state => setCloudSave(state ?? null))
    getProfile(user.id).then(p => {
      if (p) {
        setProfileAvatar(p.avatar ?? '😊')
        setProfileName(p.username ?? '')
      }
    })
  }, [user])

  function handleContinue() {
    if (cloudSave) loadFromCloud(cloudSave)
  }

  return (
    <div className="min-h-screen bg-gray-950 overflow-hidden relative flex flex-col">

      {/* 背景グリッド */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />

      {/* 浮遊する装飾 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { emoji: '💻', top: '10%', left: '5%',  delay: '0s',   size: 'text-4xl' },
          { emoji: '🏭', top: '20%', right: '8%', delay: '1.2s', size: 'text-3xl' },
          { emoji: '🍜', top: '60%', left: '3%',  delay: '2.4s', size: 'text-3xl' },
          { emoji: '💰', top: '75%', right: '5%', delay: '0.6s', size: 'text-4xl' },
          { emoji: '🎮', top: '40%', left: '2%',  delay: '1.8s', size: 'text-2xl' },
          { emoji: '📊', top: '50%', right: '3%', delay: '3s',   size: 'text-3xl' },
          { emoji: '🚀', top: '85%', left: '15%', delay: '1s',   size: 'text-2xl' },
          { emoji: '⭐', top: '15%', right: '20%',delay: '2s',   size: 'text-xl'  },
        ].map((item, i) => (
          <span
            key={i}
            className={`absolute ${item.size} opacity-20`}
            style={{
              top: item.top,
              left: (item as any).left,
              right: (item as any).right,
              animation: 'float 6s ease-in-out infinite',
              animationDelay: item.delay,
            }}
          >
            {item.emoji}
          </span>
        ))}
      </div>

      {/* ティッカー */}
      <div className="w-full border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm overflow-hidden py-2">
        <div className="flex gap-8 animate-marquee whitespace-nowrap">
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i} className="flex items-center gap-2 text-sm">
              <span className="text-gray-300 font-semibold">{t.name}</span>
              <span className="text-white font-mono">{t.price}</span>
              <span className={t.up ? 'text-emerald-400' : 'text-red-400'}>
                {t.up ? '▲' : '▼'} {t.change}
              </span>
              <span className="text-gray-700">|</span>
            </span>
          ))}
        </div>
      </div>

      {/* ログイン・ユーザー情報 */}
      <div className="absolute top-12 right-4 z-20">
        {initialized && (
          user ? (
            <div className="flex items-center gap-2 bg-gray-900/80 border border-gray-800 rounded-2xl px-3 py-2">
              <span className="text-xl">{profileAvatar}</span>
              <div className="hidden sm:block">
                <div className="text-white font-bold text-xs leading-tight">{profileName || 'プロフィール'}</div>
                <div className="text-indigo-400 text-xs">Lv.{calcLevel(xp)}</div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              className="text-gray-300 hover:text-white text-xs px-3 py-1.5 rounded-lg border border-gray-700 hover:border-indigo-500 transition-colors"
            >
              🔐 ログイン
            </button>
          )
        )}
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-2xl w-full relative z-10">

          {/* ロゴ */}
          <div className="mb-6">
            <div className="relative inline-block w-28 h-28 rounded-3xl overflow-hidden shadow-2xl shadow-indigo-900/60 mb-5 ring-2 ring-indigo-500/40">
              <Image
                src="/building.jpg"
                alt="株式会社シミュレーター"
                fill
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/60 via-transparent to-transparent" />
            </div>
            <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tight leading-tight">
              株式会社<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                シミュレーター
              </span>
            </h1>
            <p className="text-gray-400 text-lg mt-3">あなただけの仮想会社を経営して上場させよう</p>
          </div>

          {/* 特徴カード */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[
              { emoji: '🏢', label: '会社設立', sub: '社名・業種を選択' },
              { emoji: '💼', label: '経営判断', sub: '毎ターン予算配分' },
              { emoji: '📊', label: '株価変動', sub: '100種類のイベント' },
              { emoji: '🏆', label: 'S〜F評価', sub: '20ターン勝負' },
            ].map(({ emoji, label, sub }) => (
              <div key={label} className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4 hover:border-indigo-700 transition-colors">
                <div className="text-3xl mb-2">{emoji}</div>
                <div className="text-white font-bold text-sm">{label}</div>
                <div className="text-gray-500 text-xs mt-0.5">{sub}</div>
              </div>
            ))}
          </div>

          {/* クラウドセーブ続きバナー */}
          {cloudSave && (
            <div className="mb-4 bg-indigo-950 border border-indigo-700 rounded-2xl p-4 flex items-center gap-4 max-w-sm mx-auto">
              <div className="text-3xl">☁️</div>
              <div className="flex-1 text-left">
                <p className="text-white font-bold text-sm">セーブデータあり</p>
                <p className="text-indigo-300 text-xs mt-0.5">
                  {cloudSave.company?.name} · ターン{cloudSave.turn - 1}/{cloudSave.maxTurns}
                </p>
              </div>
              <button
                onClick={handleContinue}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all hover:scale-105 active:scale-95 flex-shrink-0"
              >
                続きから
              </button>
            </div>
          )}

          {/* CTA */}
          <button
            onClick={startSetup}
            className="w-full max-w-sm bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black py-5 px-8 rounded-2xl text-xl transition-all hover:scale-105 active:scale-95 shadow-xl shadow-indigo-900/40"
          >
            🚀 新しくゲームスタート
          </button>

          {/* ログイン促進 */}
          {initialized && !user && (
            <div className="mt-4 max-w-sm mx-auto">
              <div className="bg-gray-900/80 border border-gray-700 rounded-2xl p-4 flex items-center gap-4">
                <div className="text-2xl">☁️</div>
                <div className="flex-1 text-left">
                  <p className="text-white font-bold text-sm">プレイ履歴を保存したい？</p>
                  <p className="text-gray-500 text-xs mt-0.5">ログインで記録保存・どこでも続きから</p>
                </div>
                <button
                  onClick={() => setShowAuth(true)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all hover:scale-105 active:scale-95 flex-shrink-0"
                >
                  ログイン
                </button>
              </div>
            </div>
          )}

          {initialized && user && (
            <p className="text-gray-500 text-sm mt-3">
              {profileAvatar} {profileName || user.user_metadata?.full_name || user.email} でログイン中
            </p>
          )}

          {phase !== 'start' && (
            <button
              onClick={resetGame}
              className="mt-3 text-gray-600 hover:text-gray-400 text-xs py-2 transition-colors underline"
            >
              セーブデータをリセット
            </button>
          )}

          {/* 用語集 */}
          <div className="mt-6 max-w-sm mx-auto w-full">
            <button
              onClick={() => setShowGlossary(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gray-900/60 border border-gray-800 hover:border-indigo-700 transition-colors text-sm text-gray-400 hover:text-white"
            >
              📖 ゲーム用語を確認する
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10 px-4 pb-4">
        <AdBanner slot="7291202236" />
      </div>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      {showGlossary && <GlossaryModal onClose={() => setShowGlossary(false)} />}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-marquee { animation: marquee 20s linear infinite; }
      `}</style>
    </div>
  )
}
