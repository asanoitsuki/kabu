'use client'
import { useEffect, useState } from 'react'
import { useGameStore } from '@/store/gameStore'
import { useAuthStore } from '@/store/authStore'
import { cloudSaveGame, saveGameResult } from '@/lib/cloudSave'
import { getRating, formatMoney } from '@/lib/gameLogic'
import { checkAchievements } from '@/lib/achievements'
import { useAchievementStore, calcXpGain, calcLevel, xpToNextLevel } from '@/store/achievementStore'
import { upsertProfile, getProfile } from '@/lib/profile'
import StockChart from './StockChart'
import AdBanner from '@/components/AdBanner'

const GRADE_CONFIG: Record<string, { color: string; bg: string; border: string; emoji: string }> = {
  S: { color: 'text-yellow-400',  bg: 'from-yellow-950 to-amber-950',   border: 'border-yellow-700',  emoji: '👑' },
  A: { color: 'text-emerald-400', bg: 'from-emerald-950 to-green-950',  border: 'border-emerald-700', emoji: '🏆' },
  B: { color: 'text-blue-400',    bg: 'from-blue-950 to-indigo-950',    border: 'border-blue-700',    emoji: '🥈' },
  C: { color: 'text-gray-300',    bg: 'from-gray-900 to-gray-800',      border: 'border-gray-700',    emoji: '📊' },
  D: { color: 'text-orange-400',  bg: 'from-orange-950 to-amber-950',   border: 'border-orange-800',  emoji: '📉' },
  E: { color: 'text-gray-400',    bg: 'from-gray-900 to-gray-800',      border: 'border-gray-700',    emoji: '😐' },
  F: { color: 'text-red-400',     bg: 'from-red-950 to-rose-950',       border: 'border-red-800',     emoji: '💀' },
}

interface Props {
  onShowHistory: () => void
  onShowRanking: () => void
}

export default function GameOverScreen({ onShowHistory, onShowRanking }: Props) {
  const { company, stockHistory, financials, reports, resetGame, startSetup, difficulty, bankrupted } = useGameStore()
  const { user } = useAuthStore()
  const { unlockedIds, unlock, recordPlay, totalPlays, playedIndustries, addXp, xp } = useAchievementStore()
  const [sharing, setSharing] = useState(false)
  const [copied, setCopied] = useState(false)
  const [xpGained, setXpGained] = useState(0)

  if (!company) return null

  const { grade, message } = getRating(stockHistory, difficulty, bankrupted)
  const ipoPrice = stockHistory[0]?.price ?? 1
  const finalPrice = stockHistory.at(-1)?.price ?? 1
  const totalReturn = ((finalPrice - ipoPrice) / ipoPrice * 100).toFixed(1)
  const marketCap = finalPrice * financials.shares
  const bestReport = reports.reduce((best, r) => r.stockPrice > (best?.stockPrice ?? 0) ? r : best, reports[0])
  const cfg = GRADE_CONFIG[grade]
  const isGood = ['S', 'A', 'B'].includes(grade)

  useEffect(() => {
    if (isGood) {
      import('canvas-confetti').then(({ default: confetti }) => {
        const count = grade === 'S' ? 300 : grade === 'A' ? 200 : 100
        const colors = grade === 'S'
          ? ['#fbbf24', '#f59e0b', '#ffffff', '#fde68a']
          : grade === 'A'
          ? ['#34d399', '#10b981', '#ffffff', '#6ee7b7']
          : ['#60a5fa', '#3b82f6', '#ffffff']
        confetti({ particleCount: count, spread: 120, origin: { y: 0.3 }, colors })
        if (grade === 'S') {
          setTimeout(() => confetti({ particleCount: 150, angle: 60,  spread: 80, origin: { x: 0, y: 0.5 }, colors }), 400)
          setTimeout(() => confetti({ particleCount: 150, angle: 120, spread: 80, origin: { x: 1, y: 0.5 }, colors }), 600)
        }
      })
    }

    const state = useGameStore.getState()
    const lowestReturn = Math.min(...state.stockHistory.map(h => (h.price - state.stockHistory[0].price) / state.stockHistory[0].price))
    recordPlay(company.industry)
    const newAchievements = checkAchievements(
      state, unlockedIds,
      totalPlays + 1,
      [...new Set([...playedIndustries, company.industry])],
      lowestReturn,
    )
    unlock(newAchievements)

    // XP付与
    const gained = calcXpGain(grade, difficulty)
    addXp(gained)
    setXpGained(gained)

    if (user) {
      const saveKey = `result_saved_${user.id}_${state.company?.name}_${state.turn}`
      if (!localStorage.getItem(saveKey)) {
        localStorage.setItem(saveKey, '1')
        const displayName = user.user_metadata?.full_name ?? user.email ?? '匿名'
        cloudSaveGame(user.id, state)
        saveGameResult(user.id, displayName, state)

        // XP/レベルをSupabaseプロフィールへ同期
        const newTotalXp = useAchievementStore.getState().xp
        getProfile(user.id).then(profile => {
          upsertProfile({
            id: user.id,
            username: profile?.username ?? (user.user_metadata?.full_name ?? user.email ?? ''),
            avatar: profile?.avatar ?? '😊',
            xp: newTotalXp,
            level: calcLevel(newTotalXp),
          })
        })
      }
    }
  }, [])

  async function handleShare() {
    if (!company) return
    setSharing(true)
    try {
      const qs = new URLSearchParams({
        grade,
        company: company.name,
        ret: totalReturn,
        industry: company.industry,
        difficulty,
      })
      const base = 'https://kabu-three.vercel.app'
      const url = `${base}/result?${qs}`
      const imageApiUrl = `${base}/api/og/result?${qs}`
      const text = `「${company.name}」を経営して${grade}ランク達成！株価${Number(totalReturn) >= 0 ? '+' : ''}${totalReturn}%\n#株式会社シミュレーター`

      try {
        const imgRes = await fetch(imageApiUrl)
        const blob = await imgRes.blob()
        const file = new File([blob], 'result.png', { type: 'image/png' })
        if ((navigator as any).canShare?.({ files: [file] })) {
          await navigator.share({ files: [file], text, url, title: `${company.name} − ${grade}ランク！` })
          return
        }
      } catch {}

      if (navigator.share) {
        await navigator.share({ title: `${company.name} − ${grade}ランク！`, text, url })
      } else {
        await navigator.clipboard.writeText(`${text}\n${url}`)
        setCopied(true)
        setTimeout(() => setCopied(false), 2500)
      }
    } catch {
      // キャンセルまたはエラー
    } finally {
      setSharing(false)
    }
  }

  const { progress: xpProgress, current: xpCurrent, required: xpRequired } = xpToNextLevel(xp)

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      <div className="max-w-lg mx-auto py-8 space-y-5">

        <div className="text-center">
          <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">
            {bankrupted ? '💸 倒産' : '最終決算'}
          </div>
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center text-3xl font-black mx-auto mb-4 shadow-2xl"
            style={{ backgroundColor: company.color, boxShadow: `0 16px 48px ${company.color}60` }}
          >
            {company.name[0]}
          </div>
          <h1 className="text-3xl font-black">{company.name}</h1>
          <p className="text-gray-400 text-sm mt-1">{company.industry}業 · {reports.length}ターン経営</p>
        </div>

        <div className={`bg-gradient-to-br ${cfg.bg} rounded-3xl p-8 text-center border-2 ${cfg.border}`}>
          <div className="text-5xl mb-3">{cfg.emoji}</div>
          <div className="text-gray-300 text-sm font-bold uppercase tracking-widest mb-2">最終評価</div>
          <div className={`text-9xl font-black leading-none mb-4 ${cfg.color}`}
               style={{ textShadow: '0 0 60px currentColor' }}>
            {grade}
          </div>
          <p className="text-white font-bold text-lg">{message}</p>
          {!bankrupted && (
            <div className={`mt-3 text-3xl font-black ${Number(totalReturn) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {Number(totalReturn) >= 0 ? '+' : ''}{totalReturn}%
            </div>
          )}
          <div className="text-gray-400 text-sm mt-1">{bankrupted ? '資金が尽きました' : 'IPO比株価上昇率'}</div>
        </div>

        {/* XP獲得表示 */}
        {xpGained > 0 && (
          <div className="bg-indigo-950 border border-indigo-800 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">⭐</span>
              <div className="flex-1">
                <div className="text-white font-black text-sm">+{xpGained} XP 獲得！</div>
                <div className="text-indigo-300 text-xs">Lv.{calcLevel(xp)} · 累計 {xp.toLocaleString()} XP</div>
              </div>
            </div>
            {xpRequired > 0 && (
              <div>
                <div className="h-2 bg-indigo-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full transition-all duration-700"
                    style={{ width: `${xpProgress}%` }}
                  />
                </div>
                <div className="text-indigo-400 text-xs mt-1 text-right">
                  {xpCurrent.toLocaleString()} / {xpRequired.toLocaleString()} XP（次のレベルまで）
                </div>
              </div>
            )}
          </div>
        )}

        {user && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-3 flex items-center gap-2 text-sm">
            <span className="text-emerald-400">☁️</span>
            <span className="text-gray-400">この結果はプレイ履歴に保存されました</span>
            <button
              onClick={onShowHistory}
              className="ml-auto text-indigo-400 hover:text-indigo-300 font-bold text-xs flex-shrink-0 transition-colors"
            >
              履歴を見る →
            </button>
          </div>
        )}

        <StockChart />

        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'IPO価格',  value: `¥${ipoPrice.toLocaleString()}`,                        sub: '' },
            { label: '最終株価', value: `¥${finalPrice.toLocaleString()}`,                       sub: '' },
            { label: '最高株価', value: `¥${(bestReport?.stockPrice ?? 0).toLocaleString()}`,    sub: '' },
            { label: '時価総額', value: formatMoney(marketCap),                                  sub: '' },
            { label: '最終利益', value: formatMoney(financials.profit),                          sub: '' },
            { label: '経営期間', value: `${reports.length}Q`, sub: `${Math.ceil(reports.length / 4)}年` },
          ].map(({ label, value, sub }) => (
            <div key={label} className="bg-gray-900 rounded-2xl p-4 text-center border border-gray-800">
              <div className="text-gray-500 text-xs mb-1">{label}</div>
              <div className="text-white font-black text-sm leading-tight">{value}</div>
              {sub && <div className="text-gray-600 text-xs mt-0.5">{sub}</div>}
            </div>
          ))}
        </div>

        <button
          onClick={handleShare}
          disabled={sharing}
          className="w-full flex items-center justify-center gap-3 bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-indigo-600 text-white font-bold py-4 rounded-2xl text-sm transition-all active:scale-95 disabled:opacity-60"
        >
          {sharing ? (
            <span className="text-gray-400">画像を生成中...</span>
          ) : copied ? (
            <><span className="text-emerald-400">✓</span><span className="text-emerald-400">リンクをコピーしました</span></>
          ) : (
            <><span className="text-xl">🖼️</span><span>結果カードをシェアする</span></>
          )}
        </button>

        <AdBanner slot="7291202236" />

        <div className="space-y-3">
          <button
            onClick={() => { resetGame(); startSetup() }}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black py-4 rounded-2xl text-lg transition-all hover:scale-105 active:scale-95"
          >
            🚀 新しい会社を設立する
          </button>
          <button
            onClick={onShowRanking}
            className="w-full bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-yellow-700 text-white font-bold py-3 rounded-2xl text-sm transition-all"
          >
            🏆 世界ランキングを見る
          </button>
          <button
            onClick={resetGame}
            className="w-full text-gray-600 hover:text-gray-400 text-sm py-2 transition-colors"
          >
            タイトルに戻る
          </button>
        </div>
      </div>
    </div>
  )
}
