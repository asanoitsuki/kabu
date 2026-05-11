'use client'
import { TurnReport } from '@/lib/types'
import { formatMoney } from '@/lib/gameLogic'
import { useGameStore } from '@/store/gameStore'

interface Props {
  report: TurnReport
  onClose: () => void
}

const EVENT_BG: Record<string, string> = {
  boom:       'from-emerald-950 to-green-950',
  recession:  'from-red-950 to-rose-950',
  rival:      'from-orange-950 to-amber-950',
  innovation: 'from-blue-950 to-indigo-950',
  scandal:    'from-red-950 to-pink-950',
  award:      'from-yellow-950 to-amber-950',
  cyber:      'from-slate-950 to-gray-950',
  media:      'from-purple-950 to-violet-950',
}

export default function TurnReportModal({ report, onClose }: Props) {
  const { stockHistory, company } = useGameStore()
  const prevPrice = stockHistory.at(-2)?.price ?? report.stockPrice
  const priceChange = report.stockPrice - prevPrice
  const isUp = priceChange >= 0
  const label = `Q${((report.turn - 1) % 4) + 1} / Y${Math.ceil(report.turn / 4)}`
  const profitIsPos = report.financials.profit >= 0

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-gray-800">

        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 pt-6 pb-4 text-center border-b border-gray-800">
          <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">決算レポート</div>
          <div className="text-white font-black text-2xl">{label}</div>
          <div className="text-gray-500 text-sm">第{report.turn}ターン終了</div>
        </div>

        <div className="p-5 space-y-4">
          {/* イベント */}
          {report.event ? (
            <div className={`bg-gradient-to-r ${EVENT_BG[report.event.id] ?? 'from-gray-800 to-gray-900'} rounded-2xl p-4 border border-white/10`}>
              <div className="flex items-center gap-3">
                <div className="text-4xl">{report.event.icon}</div>
                <div>
                  <div className="text-white font-black text-lg leading-tight">{report.event.title}</div>
                  <div className="text-gray-300 text-sm mt-0.5">{report.event.description}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-800/50 rounded-2xl p-4 text-center border border-gray-700">
              <span className="text-2xl">📋</span>
              <div className="text-gray-400 text-sm mt-1">今ターンはイベントなし</div>
            </div>
          )}

          {/* 財務サマリー */}
          <div className="bg-gray-800/40 rounded-2xl p-4 space-y-2.5">
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
          <div className={`rounded-2xl p-5 text-center ${isUp ? 'bg-emerald-950 border border-emerald-800' : 'bg-red-950 border border-red-800'}`}>
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

        <div className="px-5 pb-5">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black py-3.5 rounded-2xl transition-all hover:scale-105 active:scale-95 text-lg"
          >
            次のターンへ →
          </button>
        </div>
      </div>
    </div>
  )
}
