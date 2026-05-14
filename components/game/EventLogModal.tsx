'use client'
import { useGameStore } from '@/store/gameStore'

interface Props {
  onClose: () => void
}

const NEG_IDS = [
  'recession','scandal','cyber_attack','pandemic','market_crash','sns_fire',
  'strike','talent_exodus','equipment_breakdown','product_recall','lawsuit',
  'data_breach','war','supply_chain','inflation','rate_hike','rival_entry',
  'food_poisoning','food_cockroach','food_hygiene_fail','food_bad_review',
  'fin_bad_loan','fin_fraud','fin_shutdown','fin_crypto_crash',
  'ent_scandal','ent_cancel','ent_copyright','mfg_fire','mfg_recall','mfg_ban',
]

function isNegative(eventId: string): boolean {
  return NEG_IDS.some(n => eventId.includes(n) || eventId === n)
}

export default function EventLogModal({ onClose }: Props) {
  const { reports } = useGameStore()
  const eventsOnly = reports.filter(r => r.event)

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 rounded-3xl w-full max-w-sm max-h-[80vh] flex flex-col border border-gray-700"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-800 flex-shrink-0">
          <h2 className="text-white font-black text-lg">📋 イベント履歴</h2>
          <span className="text-gray-500 text-sm">{eventsOnly.length}件</span>
        </div>

        <div className="overflow-y-auto flex-1 p-4 space-y-3">
          {eventsOnly.length === 0 && (
            <p className="text-gray-600 text-sm text-center py-8">まだイベントが発生していません</p>
          )}
          {[...eventsOnly].reverse().map(r => {
            const neg = isNegative(r.event!.id)
            const q = `Q${((r.turn - 1) % 4) + 1} Y${Math.ceil(r.turn / 4)}`
            return (
              <div
                key={r.turn}
                className={`rounded-2xl p-4 border ${
                  neg
                    ? 'bg-red-950/60 border-red-900'
                    : 'bg-emerald-950/60 border-emerald-900'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl flex-shrink-0">{r.event!.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-bold text-sm leading-tight ${neg ? 'text-red-200' : 'text-emerald-200'}`}>
                      {r.event!.title}
                    </div>
                    <div className="text-gray-400 text-xs mt-1 line-clamp-2">
                      {r.event!.description}
                    </div>
                  </div>
                  <div className="text-gray-600 text-xs flex-shrink-0 text-right">
                    {q}<br />T{r.turn}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="p-4 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-2xl transition-all"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  )
}
