'use client'
import { useEffect, useState } from 'react'
import { TurnReport } from '@/lib/types'
import { formatMoney } from '@/lib/gameLogic'
import { useGameStore } from '@/store/gameStore'

interface Props {
  report: TurnReport
  onClose: () => void
}

export default function TurnReportModal({ report, onClose }: Props) {
  const { stockHistory } = useGameStore()
  const prevPrice = stockHistory.at(-2)?.price ?? report.stockPrice
  const priceChange = report.stockPrice - prevPrice
  const isUp = priceChange >= 0
  const label = `Q${((report.turn - 1) % 4) + 1} / Y${Math.ceil(report.turn / 4)}`
  const profitIsPos = report.financials.profit >= 0
  const isNegEvent = report.event && [
    'recession','scandal','cyber_attack','pandemic','market_crash','sns_fire',
    'strike','talent_exodus','equipment_breakdown','product_recall','lawsuit',
    'data_breach','war','supply_chain','inflation','rate_hike','rival_entry',
  ].some(id => report.event?.id.includes(id) || report.event?.id === id)

  const [phase, setPhase] = useState<'enter' | 'event' | 'stats'>('enter')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('event'), 200)
    const t2 = setTimeout(() => setPhase('stats'), report.event ? 900 : 400)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [report.event])

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
      <div
        className="bg-gray-900 rounded-3xl max-w-sm w-full shadow-2xl border border-gray-800 overflow-y-auto"
        style={{ animation: 'modalIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both', maxHeight: '90dvh' }}
      >
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 pt-6 pb-4 text-center border-b border-gray-800">
          <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">決算レポート</div>
          <div className="text-white font-black text-2xl">{label}</div>
          <div className="text-gray-500 text-sm">第{report.turn}ターン終了</div>
        </div>

        <div className="p-5 space-y-4">
          {/* イベント */}
          {phase !== 'enter' && (
            <div style={{ animation: 'slideDown 0.4s ease both' }}>
              {report.event ? (
                <div className={`rounded-2xl p-4 border ${
                  isNegEvent
                    ? 'bg-gradient-to-r from-red-950 to-rose-950 border-red-800'
                    : 'bg-gradient-to-r from-emerald-950 to-green-950 border-emerald-800'
                }`}>
                  <div className="flex items-start gap-3">
                    <div
                      className="text-4xl flex-shrink-0"
                      style={{ animation: 'eventPop 0.5s 0.3s cubic-bezier(0.34,1.56,0.64,1) both' }}
                    >
                      {report.event.icon}
                    </div>
                    <div>
                      <div className={`font-black text-base leading-tight ${isNegEvent ? 'text-red-200' : 'text-emerald-200'}`}>
                        {report.event.title}
                      </div>
                      <div className="text-gray-300 text-xs mt-1 leading-relaxed line-clamp-3">
                        {report.event.description}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-800/50 rounded-2xl p-4 text-center border border-gray-700">
                  <span className="text-2xl">📋</span>
                  <div className="text-gray-400 text-sm mt-1">今ターンはイベントなし</div>
                </div>
              )}
            </div>
          )}

          {/* 財務・株価（少し遅れて表示） */}
          {phase === 'stats' && (
            <div style={{ animation: 'fadeUp 0.35s ease both' }}>
              {/* 財務サマリー */}
              <div className="bg-gray-800/40 rounded-2xl p-4 space-y-2.5 mb-4">
                {[
                  { label: '売上', value: formatMoney(report.financials.revenue), color: 'text-blue-400' },
                  { label: '費用', value: `- ${formatMoney(report.financials.expenses)}`, color: 'text-red-300' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex justify-between items-center">
                    <span className="text-gray-500 text-sm">{label}</span>
                    <span className={`font-semibold text-sm ${color}`}>{value}</span>
                  </div>
                ))}
                <div className="border-t border-gray-700 pt-2.5 flex justify-between items-center">
                  <span className="text-white font-bold text-sm">純利益</span>
                  <span className={`font-black text-base ${profitIsPos ? 'text-emerald-400' : 'text-red-400'}`}>
                    {profitIsPos ? '+' : ''}{formatMoney(report.financials.profit)}
                  </span>
                </div>
              </div>

              {/* 株価 */}
              <div className={`rounded-2xl p-5 text-center mb-4 ${isUp ? 'bg-emerald-950 border border-emerald-800' : 'bg-red-950 border border-red-800'}`}
                   style={{ animation: 'stockPop 0.4s 0.1s cubic-bezier(0.34,1.56,0.64,1) both' }}>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="text-2xl">{isUp ? '📈' : '📉'}</span>
                  <span className="text-gray-300 text-sm font-semibold">株価</span>
                </div>
                <div className="text-3xl font-black text-white">
                  ¥{report.stockPrice.toLocaleString()}
                </div>
                <div className={`text-sm font-bold mt-1 ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isUp ? '▲ +' : '▼ '}{Math.abs(priceChange).toLocaleString()}円
                  ({isUp ? '+' : ''}{((priceChange / prevPrice) * 100).toFixed(1)}%)
                </div>
              </div>

              {/* 現金残高 */}
              <div className="flex justify-between items-center px-1">
                <span className="text-gray-500 text-sm">残高</span>
                <span className="text-white font-bold">{formatMoney(report.financials.cash)}</span>
              </div>
            </div>
          )}
        </div>

        <div className="px-5 pb-5">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black py-3.5 rounded-2xl transition-all hover:scale-105 active:scale-95 text-lg"
          >
            次のターンへ →
          </button>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.85) translateY(20px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes eventPop {
          from { opacity: 0; transform: scale(0.5) rotate(-10deg); }
          to   { opacity: 1; transform: scale(1)   rotate(0deg); }
        }
        @keyframes stockPop {
          from { opacity: 0; transform: scale(0.9); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
