'use client'
import { useState } from 'react'
import { useGameStore } from '@/store/gameStore'
import { Difficulty, Industry } from '@/lib/types'
import { DIFFICULTY_CONFIG, INDUSTRY_COLORS, INDUSTRY_STATS } from '@/lib/gameLogic'

const INDUSTRIES: { id: Industry; emoji: string; desc: string; bg: string; flavor: string }[] = [
  { id: 'IT',     emoji: '💻', desc: '高成長・高PER。リスクと爆発力の業種',     bg: 'from-indigo-950 to-blue-950',    flavor: 'AIで世界を変える' },
  { id: '製造',   emoji: '🏭', desc: '安定した収益基盤。堅実な成長',             bg: 'from-amber-950 to-orange-950',   flavor: 'ものづくりで勝負' },
  { id: '飲食',   emoji: '🍜', desc: 'ブランド力で勝負。マーケが重要',           bg: 'from-red-950 to-pink-950',       flavor: '心と胃袋を掴め' },
  { id: '金融',   emoji: '💰', desc: '低成長だが安定。守りのプレイ向け',         bg: 'from-emerald-950 to-teal-950',   flavor: '資本で世界を動かす' },
  { id: 'エンタメ', emoji: '🎮', desc: '波が大きい。ヒット次第で大化け',         bg: 'from-pink-950 to-purple-950',    flavor: '熱狂を生み出せ' },
]

const INDUSTRY_DIFF: Record<Industry, { label: string; stars: number; color: string }> = {
  'IT':     { label: 'Hard',   stars: 4, color: '#ef4444' },
  '製造':   { label: 'Easy',   stars: 2, color: '#10b981' },
  '飲食':   { label: 'Normal', stars: 3, color: '#f59e0b' },
  '金融':   { label: 'Easy',   stars: 1, color: '#10b981' },
  'エンタメ': { label: 'Expert', stars: 5, color: '#ec4899' },
}

const COLORS = ['#6366f1', '#f59e0b', '#ef4444', '#10b981', '#ec4899', '#3b82f6', '#8b5cf6']

const DIFFICULTY_ORDER: Difficulty[] = ['easy', 'normal', 'hard', 'hell']

export default function SetupScreen() {
  const { foundCompany } = useGameStore()
  const [name, setName] = useState('')
  const [industry, setIndustry] = useState<Industry | null>(null)
  const [color, setColor] = useState(COLORS[0])
  const [difficulty, setDifficulty] = useState<Difficulty>('normal')
  const [step, setStep] = useState<1 | 2 | 3>(1)

  const canNext = name.trim().length >= 1
  const canSubmit = canNext && industry !== null

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">

        {/* ステップインジケーター */}
        <div className="flex items-center gap-2 mb-8">
          {([1, 2, 3] as const).map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black transition-all ${
                step >= s ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-600'
              }`}>{s}</div>
              <span className={`text-xs font-semibold ${step >= s ? 'text-white' : 'text-gray-600'}`}>
                {s === 1 ? '会社情報' : s === 2 ? '業種' : '難易度'}
              </span>
              {s < 3 && <div className={`flex-1 h-0.5 ${step > s ? 'bg-indigo-600' : 'bg-gray-800'}`} />}
            </div>
          ))}
        </div>

        {/* ── STEP 1: 会社情報 ── */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🏢</div>
              <h1 className="text-3xl font-black text-white">会社を設立する</h1>
              <p className="text-gray-500 mt-1">まず会社の基本情報を決めよう</p>
            </div>

            <div>
              <label className="text-gray-400 text-sm font-semibold mb-2 block">社名 <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="例: 株式会社テックスター"
                maxLength={20}
                autoFocus
                className="w-full bg-gray-900 text-white rounded-xl px-4 py-4 text-lg outline-none border-2 border-gray-800 focus:border-indigo-500 transition-colors placeholder-gray-700"
              />
              <div className="text-gray-600 text-xs mt-1 text-right">{name.length}/20</div>
            </div>

            <div>
              <label className="text-gray-400 text-sm font-semibold mb-3 block">コーポレートカラー</label>
              <div className="flex gap-3 items-center">
                {COLORS.map(c => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className="w-10 h-10 rounded-full transition-all hover:scale-110 active:scale-95"
                    style={{
                      backgroundColor: c,
                      outline: color === c ? `3px solid white` : 'none',
                      outlineOffset: '3px',
                      boxShadow: color === c ? `0 0 20px ${c}80` : 'none',
                    }}
                  />
                ))}
              </div>
            </div>

            <div
              className="rounded-2xl p-6 flex items-center gap-5 border-2 transition-all"
              style={{ borderColor: color + '60', background: `linear-gradient(135deg, ${color}15, ${color}05)` }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-lg flex-shrink-0"
                style={{ backgroundColor: color, boxShadow: `0 8px 24px ${color}60` }}
              >
                {name ? name[0] : '?'}
              </div>
              <div>
                <div className="text-xl font-black text-white">{name || '会社名を入力してください'}</div>
                <div className="text-gray-500 text-sm mt-0.5">株式会社 · 設立準備中</div>
              </div>
            </div>

            <button
              disabled={!canNext}
              onClick={() => setStep(2)}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 disabled:text-gray-600 text-white font-bold py-4 rounded-xl text-lg transition-all hover:scale-105 active:scale-95 disabled:scale-100 disabled:cursor-not-allowed"
            >
              次へ → 業種を選ぶ
            </button>
          </div>
        )}

        {/* ── STEP 2: 業種 ── */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🏗️</div>
              <h1 className="text-3xl font-black text-white">業種を選ぶ</h1>
              <p className="text-gray-500 mt-1">経営スタイルが変わる大事な選択</p>
            </div>

            <div className="space-y-3">
              {INDUSTRIES.map(({ id, emoji, desc, bg, flavor }) => {
                const stats = INDUSTRY_STATS[id]
                const diff = INDUSTRY_DIFF[id]
                const isSelected = industry === id
                return (
                  <button
                    key={id}
                    onClick={() => setIndustry(id)}
                    className={`w-full text-left rounded-2xl border-2 transition-all overflow-hidden ${
                      isSelected ? 'border-white scale-[1.02]' : 'border-gray-800 hover:border-gray-600'
                    }`}
                  >
                    <div className={`bg-gradient-to-r ${bg} p-4`}>
                      <div className="flex items-center gap-4">
                        <div
                          className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
                          style={{ backgroundColor: INDUSTRY_COLORS[id] + '30', border: `2px solid ${INDUSTRY_COLORS[id]}40` }}
                        >
                          {emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-white font-black text-lg">{id}</span>
                            <span
                              className="text-xs px-2 py-0.5 rounded-full font-bold"
                              style={{ backgroundColor: INDUSTRY_COLORS[id] + '40', color: INDUSTRY_COLORS[id] }}
                            >
                              PER {stats.per}x
                            </span>
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ color: diff.color, backgroundColor: diff.color + '20' }}>
                              {'★'.repeat(diff.stars)}{'☆'.repeat(5 - diff.stars)} {diff.label}
                            </span>
                          </div>
                          <div className="text-gray-400 text-xs mt-1 italic">"{flavor}"</div>
                          <div className="text-gray-500 text-xs mt-0.5">{desc}</div>
                        </div>
                        {isSelected && (
                          <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                            <span className="text-gray-950 text-sm font-black">✓</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-4 rounded-xl border-2 border-gray-700 text-gray-400 font-bold hover:border-gray-500 hover:text-white transition-all"
              >
                ← 戻る
              </button>
              <button
                disabled={!industry}
                onClick={() => setStep(3)}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 disabled:text-gray-600 text-white font-black py-4 rounded-xl text-lg transition-all hover:scale-105 active:scale-95 disabled:scale-100 disabled:cursor-not-allowed"
              >
                次へ → 難易度を選ぶ
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: 難易度 ── */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">⚙️</div>
              <h1 className="text-3xl font-black text-white">難易度を選ぶ</h1>
              <p className="text-gray-500 mt-1">100種類のイベントがあなたを待っている</p>
            </div>

            <div className="space-y-3">
              {DIFFICULTY_ORDER.map((d) => {
                const cfg = DIFFICULTY_CONFIG[d]
                const isSelected = difficulty === d
                const eventPct = Math.round(cfg.eventRate * 100)
                return (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`w-full text-left rounded-2xl border-2 p-4 transition-all ${
                      isSelected
                        ? 'border-white scale-[1.02]'
                        : 'border-gray-800 hover:border-gray-600'
                    }`}
                    style={{
                      background: isSelected
                        ? `linear-gradient(135deg, ${cfg.color}20, transparent)`
                        : 'transparent',
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
                        style={{ backgroundColor: cfg.color + '25', border: `2px solid ${cfg.color}50` }}
                      >
                        {cfg.emoji}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-black text-lg">{cfg.label}</span>
                          <span
                            className="text-xs px-2 py-0.5 rounded-full font-bold"
                            style={{ backgroundColor: cfg.color + '30', color: cfg.color }}
                          >
                            Sランク {cfg.sRank >= 5 ? `×${cfg.sRank + 1}以上` : `×${cfg.sRank + 1}以上`}
                          </span>
                        </div>
                        <p className="text-gray-400 text-xs">{cfg.desc}</p>
                        <div className="flex gap-3 mt-1.5 text-xs text-gray-600">
                          <span>イベント発生率 <span style={{ color: cfg.color }} className="font-bold">{eventPct}%</span></span>
                          <span>コスト増加率 <span style={{ color: cfg.color }} className="font-bold">×{cfg.costGrowth}</span>/ターン</span>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                          <span className="text-gray-950 text-sm font-black">✓</span>
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-4 rounded-xl border-2 border-gray-700 text-gray-400 font-bold hover:border-gray-500 hover:text-white transition-all"
              >
                ← 戻る
              </button>
              <button
                disabled={!canSubmit}
                onClick={() => {
                  if (industry && name.trim()) {
                    foundCompany({ name: name.trim(), industry, foundedTurn: 1, color }, difficulty)
                  }
                }}
                className="flex-1 font-black py-4 rounded-xl text-lg transition-all hover:scale-105 active:scale-95"
                style={{
                  background: `linear-gradient(135deg, ${DIFFICULTY_CONFIG[difficulty].color}, ${DIFFICULTY_CONFIG[difficulty].color}99)`,
                  color: 'white',
                  boxShadow: `0 8px 24px ${DIFFICULTY_CONFIG[difficulty].color}40`,
                }}
              >
                🚀 IPO上場！
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
