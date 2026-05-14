'use client'
import { useState } from 'react'
import { useGameStore } from '@/store/gameStore'
import { Allocation } from '@/lib/types'
import { formatMoney, calcAllocationEffect } from '@/lib/gameLogic'
import { hapticLight, hapticMedium } from '@/lib/haptics'
import { soundTap } from '@/lib/sounds'

const ITEMS: {
  key: keyof Allocation
  label: string
  emoji: string
  hint: string
  color: string
  effectKey?: 'rdEffect' | 'mktEffect' | 'hireEffect' | 'capexEffect'
}[] = [
  { key: 'rd',        label: '研究開発',   emoji: '🔬', hint: '売上を恒久的に底上げ',  color: '#6366f1', effectKey: 'rdEffect'    },
  { key: 'marketing', label: 'マーケ',     emoji: '📢', hint: '売上への直接効果が最大', color: '#f59e0b', effectKey: 'mktEffect'   },
  { key: 'hiring',    label: '採用',       emoji: '👥', hint: '組織力・安定成長に寄与', color: '#10b981', effectKey: 'hireEffect'  },
  { key: 'capex',     label: '設備投資',   emoji: '🏗️',  hint: '長期的な生産能力強化',  color: '#3b82f6', effectKey: 'capexEffect' },
  { key: 'dividend',  label: '配当',       emoji: '💸', hint: '株主還元で株価を安定化', color: '#ec4899'                           },
]

// セグメントの選択肢 (% )
const SEGMENTS = [0, 10, 20, 30, 50]

export default function AllocationPanel({ onEndTurn }: { onEndTurn: () => void }) {
  const { financials, currentAllocation, setAllocation } = useGameStore()
  const budget = financials.cash * 0.5
  const [values, setValues] = useState<Allocation>(currentAllocation)
  const [editingKey, setEditingKey] = useState<keyof Allocation | null>(null)
  const [editRaw, setEditRaw] = useState('')

  const totalSpent = Object.values(values).reduce((a, b) => a + b, 0)
  const remaining = budget - totalSpent
  const overBudget = remaining < 0
  const usagePercent = Math.min(100, (totalSpent / budget) * 100)

  const effects = calcAllocationEffect(
    { rd: values.rd, marketing: values.marketing, hiring: values.hiring, capex: values.capex },
    totalSpent > 0 ? totalSpent : 1
  )

  function apply(key: keyof Allocation, v: number) {
    const newVals = { ...values, [key]: Math.max(0, v) }
    setValues(newVals)
    setAllocation(newVals)
  }

  function setPercent(key: keyof Allocation, pct: number) {
    hapticLight()
    soundTap()
    apply(key, Math.round(budget * pct / 100))
  }

  // 現在のセグメントに最も近いインデックス
  function activeSegment(key: keyof Allocation): number {
    const pct = budget > 0 ? (values[key] / budget) * 100 : 0
    let closest = 0
    let minDiff = Infinity
    SEGMENTS.forEach((s, i) => {
      const d = Math.abs(s - pct)
      if (d < minDiff) { minDiff = d; closest = i }
    })
    return closest
  }

  function startEdit(key: keyof Allocation) {
    setEditingKey(key)
    setEditRaw(values[key] > 0 ? String(Math.round(values[key] / 10000)) : '')
  }

  function commitEdit(key: keyof Allocation) {
    const man = parseInt(editRaw.replace(/[^0-9]/g, '')) || 0
    apply(key, man * 10000)
    setEditingKey(null)
  }

  return (
    <>
      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">

        {/* ─── ヘッダー ─── */}
        <div className="px-4 pt-3 pb-2.5 border-b border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-black text-sm">💼 予算配分</span>
            <div className="flex items-center gap-2">
              {totalSpent > 0 && (
                <span className="text-emerald-400 text-xs font-bold">
                  +{effects.totalRevEffect.toFixed(1)}%収益
                </span>
              )}
              <div className={`px-2.5 py-1 rounded-lg text-xs font-black ${
                overBudget ? 'bg-red-950 text-red-400' : 'bg-gray-800 text-emerald-400'
              }`}>
                残 {formatMoney(remaining)}
              </div>
            </div>
          </div>
          {/* 使用率バー */}
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${usagePercent}%`,
                background: overBudget
                  ? 'linear-gradient(90deg,#ef4444,#f97316)'
                  : 'linear-gradient(90deg,#6366f1,#a855f7)',
              }}
            />
          </div>
        </div>

        {/* ─── 各項目（コンパクト） ─── */}
        <div className="divide-y divide-gray-800/60">
          {ITEMS.map(({ key, label, emoji, color, effectKey }) => {
            const effect = effectKey ? effects[effectKey] : null
            const active = activeSegment(key)
            const isEditing = editingKey === key

            return (
              <div key={key} className="px-3 py-2.5">
                {/* 上段: ラベル + 効果 + 金額 */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg leading-none">{emoji}</span>
                  <span className="text-white text-sm font-bold flex-1">{label}</span>
                  {effect !== null && effect > 0 && (
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded font-bold"
                      style={{ backgroundColor: color + '25', color }}
                    >
                      +{effect.toFixed(1)}%
                    </span>
                  )}
                  {key === 'dividend' && values.dividend > 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-pink-950 text-pink-300">
                      安定↑
                    </span>
                  )}
                  {/* 金額タップ編集 */}
                  {isEditing ? (
                    <div className="flex items-center gap-0.5">
                      <input
                        type="number"
                        inputMode="numeric"
                        value={editRaw}
                        onChange={e => setEditRaw(e.target.value)}
                        onBlur={() => commitEdit(key)}
                        onKeyDown={e => e.key === 'Enter' && commitEdit(key)}
                        autoFocus
                        placeholder="0"
                        className="w-16 bg-gray-800 text-white text-xs font-bold text-right rounded px-1.5 py-1 outline-none border border-indigo-500"
                      />
                      <span className="text-gray-500 text-[10px]">万</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => startEdit(key)}
                      className="text-xs font-bold font-mono px-2 py-1 rounded-lg border transition-colors active:scale-95"
                      style={{ color, borderColor: color + '50', backgroundColor: color + '12' }}
                    >
                      {formatMoney(values[key])}
                    </button>
                  )}
                </div>

                {/* 下段: セグメントボタン */}
                <div className="grid grid-cols-5 gap-1">
                  {SEGMENTS.map((pct, i) => (
                    <button
                      key={pct}
                      onClick={() => setPercent(key, pct)}
                      className="py-2 rounded-xl text-xs font-black transition-all active:scale-95"
                      style={{
                        backgroundColor: active === i ? color + '28' : '#1f2937',
                        color: active === i ? color : '#6b7280',
                        border: `1.5px solid ${active === i ? color + '70' : 'transparent'}`,
                      }}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ─── ターン終了ボタン（固定） ─── */}
      <div className="sticky bottom-16 left-0 right-0 px-0 pb-2 pt-2 bg-gradient-to-t from-gray-950 via-gray-950/90 to-transparent pointer-events-none">
        <button
          onClick={() => { hapticMedium(); onEndTurn() }}
          disabled={overBudget}
          className="w-full font-black py-5 rounded-2xl text-lg transition-all active:scale-95 disabled:cursor-not-allowed pointer-events-auto shadow-2xl"
          style={{
            background: overBudget ? '#1f2937' : 'linear-gradient(135deg,#6366f1,#a855f7)',
            color: overBudget ? '#4b5563' : 'white',
            boxShadow: overBudget ? 'none' : '0 8px 32px rgba(99,102,241,0.45)',
          }}
        >
          {overBudget ? '⚠️ 予算超過！' : '次のターンへ →'}
        </button>
      </div>
    </>
  )
}
