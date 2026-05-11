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

export default function AllocationPanel({ onEndTurn }: { onEndTurn: () => void }) {
  const { financials, currentAllocation, setAllocation } = useGameStore()
  const budget = financials.cash * 0.5
  const [values, setValues] = useState<Allocation>(currentAllocation)

  const totalSpent = Object.values(values).reduce((a, b) => a + b, 0)
  const remaining = budget - totalSpent
  const overBudget = remaining < 0
  const usagePercent = Math.min(100, (totalSpent / budget) * 100)

  function handleChange(key: keyof Allocation, raw: string | number) {
    const v = Math.max(0, parseInt(String(raw).replace(/,/g, '')) || 0)
    const newVals = { ...values, [key]: v }
    setValues(newVals)
    setAllocation(newVals)
  }

  function setPercent(key: keyof Allocation, pct: number) {
    const v = Math.round(budget * pct)
    const newVals = { ...values, [key]: v }
    setValues(newVals)
    setAllocation(newVals)
  }

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
      {/* ヘッダー */}
      <div className="px-5 pt-5 pb-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-white font-black text-lg">💼 予算配分</h2>
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

        {/* 全体バー */}
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
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
        <div className="text-xs text-gray-600 mt-1 text-right">{usagePercent.toFixed(0)}% 使用</div>
      </div>

      {/* 各項目 */}
      <div className="p-5 space-y-5">
        {ITEMS.map(({ key, label, emoji, hint, color }) => {
          const pct = budget > 0 ? (values[key] / budget) * 100 : 0
          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{emoji}</span>
                  <div>
                    <span className="text-white text-sm font-bold">{label}</span>
                    <span className="text-gray-600 text-xs ml-2 hidden sm:inline">{hint}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {[0, 10, 25, 50].map(p => (
                    <button
                      key={p}
                      onClick={() => setPercent(key, p / 100)}
                      className="text-xs px-2 py-0.5 rounded-lg transition-colors"
                      style={{
                        backgroundColor: values[key] === Math.round(budget * p / 100) ? color + '30' : '#1f2937',
                        color: values[key] === Math.round(budget * p / 100) ? color : '#6b7280',
                        border: `1px solid ${values[key] === Math.round(budget * p / 100) ? color + '60' : 'transparent'}`,
                      }}
                    >
                      {p}%
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={Math.round(budget)}
                  step={Math.max(1, Math.round(budget / 100))}
                  value={values[key]}
                  onChange={e => handleChange(key, e.target.value)}
                  className="flex-1"
                  style={{ accentColor: color }}
                />
                <span className="text-sm font-bold w-20 text-right font-mono" style={{ color }}>
                  {formatMoney(values[key])}
                </span>
              </div>

              {/* 割合バー */}
              <div className="h-1 bg-gray-800 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-200"
                  style={{ width: `${Math.min(100, pct)}%`, backgroundColor: color }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* フッター */}
      <div className="px-5 pb-5">
        <button
          onClick={onEndTurn}
          disabled={overBudget}
          className="w-full font-black py-4 rounded-2xl text-lg transition-all hover:scale-105 active:scale-95 disabled:scale-100 disabled:cursor-not-allowed"
          style={{
            background: overBudget ? '#1f2937' : 'linear-gradient(135deg, #6366f1, #a855f7)',
            color: overBudget ? '#4b5563' : 'white',
            boxShadow: overBudget ? 'none' : '0 8px 24px rgba(99,102,241,0.4)',
          }}
        >
          {overBudget ? '⚠️ 予算超過！' : '次のターンへ →'}
        </button>
      </div>
    </div>
  )
}
