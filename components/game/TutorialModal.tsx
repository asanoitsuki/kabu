'use client'
import { useState } from 'react'

const STEPS = [
  {
    emoji: '🏢',
    title: '会社を設立する',
    desc: '社名・業種・難易度を選んでIPO上場からスタート。あなただけの会社を作ろう。',
    color: '#6366f1',
  },
  {
    emoji: '💼',
    title: '毎ターン予算を配分',
    desc: '研究開発・マーケ・設備投資・採用に予算を振り分けて経営判断。選択が株価を左右する。',
    color: '#8b5cf6',
  },
  {
    emoji: '📊',
    title: 'イベントで株価が変動',
    desc: '100種類以上のランダムイベントが発生。バブルや不況、スキャンダルにどう対応するか。',
    color: '#3b82f6',
  },
  {
    emoji: '🚀',
    title: '20ターンで勝負あり',
    desc: 'IPO価格からのリターンでS〜F評価。高難易度ほど高得点。世界ランキングを目指せ！',
    color: '#10b981',
  },
]

interface Props {
  onClose: () => void
}

export default function TutorialModal({ onClose }: Props) {
  const [step, setStep] = useState(0)
  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4 animate-fade">
      <div className="bg-gray-900 border border-gray-700 rounded-3xl w-full max-w-sm overflow-hidden animate-screen">

        {/* ステップインジケーター */}
        <div className="flex gap-1.5 p-5 pb-0">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className="flex-1 h-1 rounded-full transition-all duration-300"
              style={{ background: i <= step ? current.color : '#374151' }}
            />
          ))}
        </div>

        {/* コンテンツ */}
        <div className="p-8 text-center">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6 shadow-xl"
            style={{ background: current.color + '25', border: `2px solid ${current.color}50` }}
          >
            {current.emoji}
          </div>
          <h2 className="text-white font-black text-xl mb-3">{current.title}</h2>
          <p className="text-gray-400 text-sm leading-relaxed">{current.desc}</p>
        </div>

        {/* ボタン */}
        <div className="px-6 pb-8 space-y-3">
          <button
            onClick={() => isLast ? onClose() : setStep(s => s + 1)}
            className="w-full py-4 rounded-2xl font-black text-white text-base transition-all active:scale-95"
            style={{ background: `linear-gradient(135deg, ${current.color}, ${current.color}bb)` }}
          >
            {isLast ? '🚀 ゲームを始める' : '次へ →'}
          </button>
          {!isLast && (
            <button
              onClick={onClose}
              className="w-full text-gray-600 text-sm py-2"
            >
              スキップ
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
