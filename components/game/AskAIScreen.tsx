'use client'
import { useState } from 'react'
import { useGameStore } from '@/store/gameStore'

export default function AskAIScreen() {
  const { company, stockHistory, reports, difficulty, phase } = useGameStore()
  const [analysis, setAnalysis] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const hasGame = phase === 'gameover' || (reports.length > 0 && company)

  const grade = (() => {
    if (!stockHistory || stockHistory.length < 2) return 'C'
    const first = stockHistory[0].price
    const last = stockHistory[stockHistory.length - 1].price
    const g = (last - first) / first
    if (g >= 2.0) return 'S'
    if (g >= 1.0) return 'A'
    if (g >= 0.5) return 'B'
    if (g >= 0.0) return 'C'
    if (g >= -0.3) return 'D'
    return 'F'
  })()

  const totalReturn = stockHistory.length >= 2
    ? (((stockHistory.at(-1)?.price ?? 1) - stockHistory[0].price) / stockHistory[0].price * 100).toFixed(1)
    : '0'

  const events = reports.flatMap(r => r.event ? [r.event.title] : [])

  async function handleAnalyze() {
    if (!company) return
    setLoading(true)
    setError('')
    setAnalysis('')
    try {
      const res = await fetch('/api/ask-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: company.name,
          industry: company.industry,
          difficulty,
          grade,
          totalReturn,
          events,
          turns: reports.length,
        }),
      })
      const data = await res.json()
      if (data.error) setError(data.error)
      else setAnalysis(data.analysis)
    } catch {
      setError('通信エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="mb-5">
          <h1 className="text-xl font-black">🤖 AI経営分析</h1>
          <p className="text-gray-500 text-xs mt-0.5">AIがあなたの経営を分析します</p>
        </div>

        {!hasGame ? (
          <div className="text-center py-16 space-y-3">
            <div className="text-5xl">🏢</div>
            <p className="text-gray-400 text-sm">ゲームをプレイすると<br />AIが経営を分析してくれます</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* 会社情報カード */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-lg flex-shrink-0"
                style={{ backgroundColor: company?.color ?? '#6366f1' }}
              >
                {company?.name[0]}
              </div>
              <div className="flex-1">
                <div className="font-black text-base">{company?.name}</div>
                <div className="text-gray-400 text-xs">{company?.industry}業 · {reports.length}ターン経営</div>
              </div>
              <div className={`text-3xl font-black ${
                grade === 'S' ? 'text-yellow-400' :
                grade === 'A' ? 'text-emerald-400' :
                grade === 'B' ? 'text-blue-400' :
                grade === 'C' ? 'text-gray-300' :
                grade === 'D' ? 'text-orange-400' : 'text-red-400'
              }`}>{grade}</div>
            </div>

            {/* 分析ボタン */}
            {!analysis && !loading && (
              <button
                onClick={handleAnalyze}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black py-4 rounded-2xl text-base transition-all active:scale-95"
              >
                🤖 AIに経営を分析してもらう
              </button>
            )}

            {/* ローディング */}
            {loading && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
                <div className="text-3xl mb-3 animate-pulse">🤖</div>
                <p className="text-gray-400 text-sm">AIが分析中...</p>
              </div>
            )}

            {/* エラー */}
            {error && (
              <div className="bg-red-950 border border-red-800 rounded-2xl p-4 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* 分析結果 */}
            {analysis && (
              <div className="bg-gray-900 border border-indigo-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">🤖</span>
                  <span className="text-indigo-400 font-bold text-sm">AI分析レポート</span>
                </div>
                <div className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">
                  {analysis}
                </div>
                <button
                  onClick={handleAnalyze}
                  className="w-full mt-2 text-gray-500 hover:text-gray-300 text-xs py-2 transition-colors border border-gray-800 rounded-xl"
                >
                  再分析する
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
