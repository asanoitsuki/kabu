'use client'
import { useState } from 'react'
import { useGameStore } from '@/store/gameStore'
import { Allocation } from '@/lib/types'
import { formatMoney } from '@/lib/gameLogic'

const ITEMS: { key: keyof Allocation; label: string; emoji: string; hint: string; color: string }[] = [
  { key: 'rd',        label: '研究開発',      emoji: '🔬', hint: '収益力・製品力が向上',    color: '#6366f1' },
  { key: 'marketing', label: 'マーケティング', emoji: '📢', hint: '売上に直結する即効薬',    color: '#f59e0b' },
  { key: 'hiring',    label: '採用',          emoji: '👥', hint: '組織力を高めて安定成長',  color: '#10b981' },
  { key: 'capex',     label: '設備投資',      emoji: '🏗️',  hint: '長期的な生産能力を強化', color: '#3b82f6' },
  { key: 'dividend',  label: '配当',          emoji: '💸', hint: '株主還元で株価を安定化',  color: '#ec4899' },
]

const PRESETS = [0, 10, 25, 50]

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

  function apply(key: keyof Allocation, v: number) {
    const clamped = Math.max(0, v)
    const newVals = { ...values, [key]: clamped }
    setValues(newVals)
    setAllocation(newVals)
  }

  function setPercent(key: keyof Allocation, pct: number) {
    apply(key, Math.round(budget * pct / 100))
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
      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden pb-2">
        {/* ヘッダー */}
        <div className="px-4 pt-4 pb-3 border-b border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-white font-black text-base">💼 予算配分</h2>
              <div className="text-gray-500 text-xs mt-0.5">
                利用可能: <span className="text-white font-bold">{formatMoney(budget)}</span>
              </div>
            </div>
            <div className={`text-right px-3 py-1.5 rounded-xl ${overBudget ? 'bg-red-950 border border-red-800' : 'bg-gray-800'}`}>
              <div className={`text-xs ${overBudget ? 'text-red-400' : 'text-gray-400'}`}>残り</div>
              <div className={`font-black text-sm ${overBudget ? 'text-red-400' : 'text-emerald-400'}`}>
                {formatMoney(remaining)}
              </div>
            </div>
          </div>
          <div className="h-2.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${usagePercent}%`,
                background: overBudget
                  ? 'linear-gradient(90deg, #ef4444, #f97316)'
                  : 'linear-gradient(90deg, #6366f1, #a855f7)',
              }}
            />
          </div>
        </div>

        {/* 各項目 */}
        <div className="p-4 space-y-4">
          {ITEMS.map(({ key, label, emoji, hint, color }) => {
            const pct = budget > 0 ? (values[key] / budget) * 100 : 0
            const isEditing = editingKey === key
            return (
              <div key={key}>
                {/* ラベル行 */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{emoji}</span>
                    <span className="text-white text-sm font-bold">{label}</span>
                    <span className="text-gray-600 text-xs hidden sm:inline">{hint}</span>
                  </div>

                  {/* 金額（タップで編集） */}
                  {isEditing ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        inputMode="numeric"
                        value={editRaw}
                        onChange={e => setEditRaw(e.target.value)}
                        onBlur={() => commitEdit(key)}
                        onKeyDown={e => e.key === 'Enter' && commitEdit(key)}
                        autoFocus
                        placeholder="0"
                        className="w-20 bg-gray-800 text-white text-sm font-bold text-right rounded-lg px-2 py-1 outline-none border border-gray-600 focus:border-indigo-500"
                      />
                      <span className="text-gray-500 text-xs">万円</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => startEdit(key)}
                      className="text-sm font-bold font-mono px-2 py-1 rounded-lg border transition-colors active:scale-95"
                      style={{ color, borderColor: color + '40', backgroundColor: color + '10' }}
                    >
                      {formatMoney(values[key])}
                    </button>
                  )}
                </div>

                {/* プリセットボタン */}
                <div className="grid grid-cols-4 gap-1.5 mb-2">
                  {PRESETS.map(p => {
                    const isActive = Math.abs(values[key] - Math.round(budget * p / 100)) < 1000
                    return (
                      <button
                        key={p}
                        onClick={() => setPercent(key, p)}
                        className="py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95"
                        style={{
                          backgroundColor: isActive ? color + '25' : '#1f2937',
                          color: isActive ? color : '#6b7280',
                          border: `1.5px solid ${isActive ? color + '60' : 'transparent'}`,
                        }}
                      >
                        {p}%
                      </button>
                    )
                  })}
                </div>

                {/* スライダー（太め） */}
                <div className="relative flex items-center">
                  <input
                    type="range"
                    min={0}
                    max={Math.round(budget)}
                    step={Math.max(10000, Math.round(budget / 100))}
                    value={values[key]}
                    onChange={e => apply(key, parseInt(e.target.value))}
                    className="w-full h-3 rounded-full appearance-none cursor-pointer"
                    style={{
                      accentColor: color,
                      background: `linear-gradient(to right, ${color} ${pct}%, #374151 ${pct}%)`,
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 次のターンへ（画面下部固定） */}
      <div className="sticky bottom-16 left-0 right-0 px-4 pb-4 pt-2 bg-gradient-to-t from-gray-950 via-gray-950/90 to-transparent pointer-events-none">
        <button
          onClick={onEndTurn}
          disabled={overBudget}
          className="w-full font-black py-5 rounded-2xl text-lg transition-all active:scale-95 disabled:cursor-not-allowed pointer-events-auto shadow-2xl"
          style={{
            background: overBudget ? '#1f2937' : 'linear-gradient(135deg, #6366f1, #a855f7)',
            color: overBudget ? '#4b5563' : 'white',
            boxShadow: overBudget ? 'none' : '0 8px 32px rgba(99,102,241,0.5)',
          }}
        >
          {overBudget ? '⚠️ 予算超過！' : '次のターンへ →'}
        </button>
      </div>

      <style>{`
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.4);
          cursor: pointer;
        }
        input[type='range']::-moz-range-thumb {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.4);
          cursor: pointer;
          border: none;
        }
      `}</style>
    </>
  )
}
