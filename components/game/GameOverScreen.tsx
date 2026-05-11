'use client'
import { useEffect, useRef } from 'react'
import { useGameStore } from '@/store/gameStore'
import { useAuthStore } from '@/store/authStore'
import { cloudSaveGame } from '@/lib/cloudSave'
import { getRating, formatMoney } from '@/lib/gameLogic'
import StockChart from './StockChart'

const GAME_URL = 'https://kabu-three.vercel.app'

function shareText(name: string, industry: string, turns: number, grade: string, totalReturn: string): string {
  const ret = Number(totalReturn)
  if (grade === 'F') {
    if (turns <= 5) return `「${name}」を${industry}業で経営したけど${turns}ターンで終わった😂\n株価${ret}%の大惨事…\n#株式会社シミュレーター\n${GAME_URL}`
    return `「${name}」${industry}業・Fランク判定くらった😭\n株価${ret}%、経営センスなさすぎ\n#株式会社シミュレーター\n${GAME_URL}`
  }
  if (grade === 'S') return `「${name}」${industry}業でSランク達成！🏆\n株価+${totalReturn}%、${turns}ターン完璧経営\n#株式会社シミュレーター\n${GAME_URL}`
  if (grade === 'A') return `「${name}」${industry}業でAランク！📈\n株価+${totalReturn}%\n#株式会社シミュレーター\n${GAME_URL}`
  return `「${name}」を${industry}業で${turns}ターン経営して${grade}ランク\n株価${ret >= 0 ? '+' : ''}${totalReturn}%\n#株式会社シミュレーター\n${GAME_URL}`
}

const GRADE_CONFIG: Record<string, { color: string; bg: string; border: string; emoji: string }> = {
  S: { color: 'text-yellow-400',  bg: 'from-yellow-950 to-amber-950',   border: 'border-yellow-700',  emoji: '👑' },
  A: { color: 'text-emerald-400', bg: 'from-emerald-950 to-green-950',  border: 'border-emerald-700', emoji: '🏆' },
  B: { color: 'text-blue-400',    bg: 'from-blue-950 to-indigo-950',    border: 'border-blue-700',    emoji: '🥈' },
  C: { color: 'text-gray-300',    bg: 'from-gray-900 to-gray-800',      border: 'border-gray-700',    emoji: '📊' },
  D: { color: 'text-orange-400',  bg: 'from-orange-950 to-red-950',     border: 'border-orange-800',  emoji: '📉' },
  F: { color: 'text-red-400',     bg: 'from-red-950 to-rose-950',       border: 'border-red-800',     emoji: '💀' },
}

interface Props {
  onShowHistory: () => void
}

export default function GameOverScreen({ onShowHistory }: Props) {
  const { company, stockHistory, financials, reports, resetGame, startSetup, difficulty } = useGameStore()
  const { user } = useAuthStore()
  const savedRef = useRef(false)

  if (!company) return null

  const { grade, message } = getRating(stockHistory, difficulty)
  const ipoPrice = stockHistory[0]?.price ?? 1
  const finalPrice = stockHistory.at(-1)?.price ?? 1
  const totalReturn = ((finalPrice - ipoPrice) / ipoPrice * 100).toFixed(1)
  const marketCap = finalPrice * financials.shares
  const bestReport = reports.reduce((best, r) => r.stockPrice > (best?.stockPrice ?? 0) ? r : best, reports[0])
  const cfg = GRADE_CONFIG[grade]
  const isGood = ['S', 'A', 'B'].includes(grade)

  // 紙吹雪 + クラウド保存
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

    // ゲーム終了状態をクラウドに保存（1回だけ）
    if (user && !savedRef.current) {
      savedRef.current = true
      const state = useGameStore.getState()
      cloudSaveGame(user.id, state)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      <div className="max-w-lg mx-auto py-8 space-y-5">

        <div className="text-center">
          <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">最終決算</div>
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
          <div className={`mt-3 text-3xl font-black ${Number(totalReturn) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {Number(totalReturn) >= 0 ? '+' : ''}{totalReturn}%
          </div>
          <div className="text-gray-400 text-sm">IPO比株価上昇率</div>
        </div>

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

        <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800 space-y-3">
          <div className="text-gray-400 text-xs font-bold">シェアする</div>
          <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{shareText(company.name, company.industry, reports.length, grade, totalReturn)}</p>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText(company.name, company.industry, reports.length, grade, totalReturn))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-black hover:bg-gray-900 border border-gray-700 text-white font-bold py-3 rounded-xl transition-all hover:scale-105 active:scale-95 text-sm"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/></svg>
            X（Twitter）に投稿する
          </a>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => { resetGame(); startSetup() }}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black py-4 rounded-2xl text-lg transition-all hover:scale-105 active:scale-95"
          >
            🚀 新しい会社を設立する
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
