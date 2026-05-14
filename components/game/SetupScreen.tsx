'use client'
import { useState, useEffect } from 'react'
import { useGameStore } from '@/store/gameStore'
import { Difficulty, Industry } from '@/lib/types'
import { DIFFICULTY_CONFIG, INDUSTRY_COLORS, INDUSTRY_STATS } from '@/lib/gameLogic'
import { generateCompanyName } from '@/lib/companyNames'
import { Layers, Sparkles, Settings2, RefreshCw, Rocket, Check } from 'lucide-react'

const INDUSTRIES: { id: Industry; emoji: string; desc: string; bg: string; flavor: string }[] = [
  { id: 'IT',     emoji: '💻', desc: '高成長・高PER。リスクと爆発力の業種',     bg: 'from-indigo-950 to-blue-950',    flavor: 'AIで世界を変える' },
  { id: '製造',   emoji: '🏭', desc: '安定した収益基盤。堅実な成長',             bg: 'from-amber-950 to-orange-950',   flavor: 'ものづくりで勝負' },
  { id: '飲食',   emoji: '🍜', desc: 'ブランド力で勝負。マーケが重要',           bg: 'from-red-950 to-pink-950',       flavor: '心と胃袋を掴め' },
  { id: '金融',   emoji: '💰', desc: '低成長だが安定。守りのプレイ向け',         bg: 'from-emerald-950 to-teal-950',   flavor: '資本で世界を動かす' },
  { id: 'エンタメ', emoji: '🎮', desc: '波が大きい。ヒット次第で大化け',         bg: 'from-pink-950 to-purple-950',    flavor: '熱狂を生み出せ' },
  { id: '医療',   emoji: '🏥', desc: '安定需要と高い社会的信頼感',               bg: 'from-cyan-950 to-teal-950',      flavor: '命と健康を守る' },
  { id: '不動産', emoji: '🏠', desc: '資産運用と景気に連動した低PER業種',        bg: 'from-lime-950 to-green-950',     flavor: '土地と夢を売る' },
  { id: '教育',   emoji: '📚', desc: '景気に左右されにくい安定業種',             bg: 'from-violet-950 to-purple-950',  flavor: '未来を育てる' },
  { id: '物流',   emoji: '🚚', desc: 'インフラを支える低PER・安定型',            bg: 'from-orange-950 to-amber-950',   flavor: '世界を繋ぐ' },
  { id: '小売',   emoji: '🛒', desc: '薄利多売。回転率が命の消費者向け業種',     bg: 'from-teal-950 to-cyan-950',      flavor: '日常に寄り添う' },
]

const COLORS = ['#6366f1', '#f59e0b', '#ef4444', '#10b981', '#ec4899', '#3b82f6', '#8b5cf6', '#f97316']
const DIFFICULTY_ORDER: Difficulty[] = ['easy', 'normal', 'hard', 'hell']

export default function SetupScreen() {
  const { foundCompany } = useGameStore()
  const [industry, setIndustry] = useState<Industry | null>(null)
  const [color, setColor] = useState(COLORS[0])
  const [difficulty, setDifficulty] = useState<Difficulty>('normal')
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [generatedName, setGeneratedName] = useState('')

  // 業種が選ばれたら自動生成
  useEffect(() => {
    if (industry) {
      setGeneratedName(generateCompanyName(industry))
    }
  }, [industry])

  function handleSelectIndustry(id: Industry) {
    setIndustry(id)
    setGeneratedName(generateCompanyName(id))
  }

  function handleRegenerate() {
    if (industry) setGeneratedName(generateCompanyName(industry))
  }

  return (
    <div className="min-h-screen bg-gray-950 p-4 py-8">
      <div className="w-full max-w-lg mx-auto">

        {/* ステップインジケーター */}
        <div className="flex items-center gap-2 mb-8">
          {([1, 2, 3] as const).map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black transition-all ${
                step >= s ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-600'
              }`}>{s}</div>
              <span className={`text-xs font-semibold ${step >= s ? 'text-white' : 'text-gray-600'}`}>
                {s === 1 ? '業種' : s === 2 ? 'カスタマイズ' : '難易度'}
              </span>
              {s < 3 && <div className={`flex-1 h-0.5 ${step > s ? 'bg-indigo-600' : 'bg-gray-800'}`} />}
            </div>
          ))}
        </div>

        {/* ── STEP 1: 業種 ── */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-indigo-950 border border-indigo-800 flex items-center justify-center mx-auto mb-3">
                <Layers size={32} strokeWidth={1.5} className="text-indigo-400" />
              </div>
              <h1 className="text-3xl font-black text-white">業種を選ぶ</h1>
              <p className="text-gray-500 mt-1">業種を選ぶと会社名が自動で決まります</p>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {INDUSTRIES.map(({ id, emoji }) => {
                const isSelected = industry === id
                return (
                  <button
                    key={id}
                    onClick={() => handleSelectIndustry(id)}
                    className={`aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 border-2 transition-all active:scale-95 ${
                      isSelected
                        ? 'border-white bg-gray-800 scale-105 shadow-lg'
                        : 'border-gray-800 bg-gray-900 hover:border-gray-600'
                    }`}
                    style={isSelected ? { boxShadow: `0 0 16px ${INDUSTRY_COLORS[id]}60` } : {}}
                  >
                    <span className="text-2xl leading-none">{emoji}</span>
                    <span className={`text-[11px] font-black leading-tight text-center px-0.5 ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                      {id}
                    </span>
                    {isSelected && (
                      <span className="text-[9px] font-bold" style={{ color: INDUSTRY_COLORS[id] }}>✓</span>
                    )}
                  </button>
                )
              })}
            </div>

            <div className="pt-2">
              <button
                disabled={!industry}
                onClick={() => setStep(2)}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 disabled:text-gray-600 text-white font-black py-4 rounded-xl text-lg transition-all hover:scale-105 active:scale-95 disabled:scale-100 disabled:cursor-not-allowed"
              >
                次へ → カスタマイズ
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: カスタマイズ（社名プレビュー + カラー） ── */}
        {step === 2 && industry && (
          <div className="space-y-5">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-purple-950 border border-purple-800 flex items-center justify-center mx-auto mb-3">
                <Sparkles size={32} strokeWidth={1.5} className="text-purple-400" />
              </div>
              <h1 className="text-3xl font-black text-white">会社をカスタマイズ</h1>
              <p className="text-gray-500 mt-1">AIが会社名を決めました！</p>
            </div>

            {/* 生成された社名 */}
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5 space-y-4">
              <div>
                <div className="text-gray-400 text-xs font-semibold mb-2">AI生成 社名</div>
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black text-white shadow-lg flex-shrink-0"
                    style={{ backgroundColor: color, boxShadow: `0 4px 16px ${color}60` }}
                  >
                    {generatedName[0] || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-black text-lg leading-tight break-all">{generatedName}</div>
                    <div className="text-gray-500 text-xs mt-0.5">{INDUSTRIES.find(i => i.id === industry)?.emoji} {industry}業</div>
                  </div>
                  <button
                    onClick={handleRegenerate}
                    className="flex-shrink-0 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700 rounded-xl p-2.5 text-sm font-bold transition-all hover:scale-105 active:scale-95"
                  >
                    <RefreshCw size={16} strokeWidth={2} />
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-800 pt-4">
                <div className="text-gray-400 text-xs font-semibold mb-3">コーポレートカラー</div>
                <div className="flex gap-3 items-center flex-wrap">
                  {COLORS.map(c => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className="w-9 h-9 rounded-full transition-all hover:scale-110 active:scale-95"
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
            </div>

            {/* プレビューカード */}
            <div
              className="rounded-2xl p-5 flex items-center gap-4 border-2 transition-all"
              style={{ borderColor: color + '60', background: `linear-gradient(135deg, ${color}15, ${color}05)` }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-lg flex-shrink-0"
                style={{ backgroundColor: color, boxShadow: `0 8px 24px ${color}60` }}
              >
                {generatedName[0] || '?'}
              </div>
              <div>
                <div className="text-lg font-black text-white leading-tight">{generatedName}</div>
                <div className="text-gray-500 text-sm mt-0.5">株式会社 · 設立準備中</div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-4 rounded-xl border-2 border-gray-700 text-gray-400 font-bold hover:border-gray-500 hover:text-white transition-all"
              >
                ← 戻る
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-xl text-lg transition-all hover:scale-105 active:scale-95"
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
              <div className="w-16 h-16 rounded-2xl bg-gray-900 border border-gray-700 flex items-center justify-center mx-auto mb-3">
                <Settings2 size={32} strokeWidth={1.5} className="text-gray-400" />
              </div>
              <h1 className="text-3xl font-black text-white">難易度を選ぶ</h1>
              <p className="text-gray-500 mt-1">難しいほど株価が動きやすい</p>
            </div>

            <div className="space-y-3">
              {DIFFICULTY_ORDER.map((d) => {
                const cfg = DIFFICULTY_CONFIG[d]
                const isSelected = difficulty === d
                const xpMult: Record<Difficulty, string> = { easy: '×1', normal: '×1.5', hard: '×2', hell: '×3' }
                return (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`w-full text-left rounded-2xl border-2 p-4 transition-all ${
                      isSelected ? 'border-white scale-[1.02]' : 'border-gray-800 hover:border-gray-600'
                    }`}
                    style={{
                      background: isSelected ? `linear-gradient(135deg, ${cfg.color}20, transparent)` : 'transparent',
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
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-white font-black text-lg">{cfg.label}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                            XP {xpMult[d]}
                          </span>
                        </div>
                        <p className="text-gray-400 text-xs">{cfg.desc}</p>
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
                onClick={() => {
                  if (industry && generatedName) {
                    foundCompany({ name: generatedName, industry, foundedTurn: 1, color }, difficulty)
                  }
                }}
                className="flex-1 font-black py-4 rounded-xl text-lg transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                style={{
                  background: `linear-gradient(135deg, ${DIFFICULTY_CONFIG[difficulty].color}, ${DIFFICULTY_CONFIG[difficulty].color}99)`,
                  color: 'white',
                  boxShadow: `0 8px 24px ${DIFFICULTY_CONFIG[difficulty].color}40`,
                }}
              >
                <Rocket size={20} strokeWidth={2} /> IPO上場！
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
