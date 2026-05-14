'use client'
import { useEffect, useState } from 'react'
import { useGameStore } from '@/store/gameStore'
import { useAuthStore } from '@/store/authStore'
import { useItemStore } from '@/store/itemStore'
import { cloudSaveGame } from '@/lib/cloudSave'
import { formatMoney, INDUSTRY_STATS } from '@/lib/gameLogic'
import StockChart from './StockChart'
import AllocationPanel from './AllocationPanel'
import TurnReportModal from './TurnReportModal'
import EventLogModal from './EventLogModal'
import ItemBagModal from './ItemBagModal'
import UserMenu from '@/components/auth/UserMenu'
import { TurnReport } from '@/lib/types'
import { hapticMedium, hapticHeavy, hapticSuccess, hapticWarning } from '@/lib/haptics'
import { soundUp, soundDown, soundTurnEnd, soundTap } from '@/lib/sounds'
import { Save, Check, Loader2, Package, ScrollText, Building2, Rocket, TrendingUp } from 'lucide-react'

interface Props {
  onShowHistory: () => void
  onShowRanking: () => void
}

export default function GameScreen({ onShowHistory, onShowRanking }: Props) {
  const store = useGameStore()
  const { company, turn, maxTurns, financials, endTurn, stockHistory, difficulty, activeEffects } = store
  const { resetGame, startSetup } = store
  const { user } = useAuthStore()
  const { getTotalItems } = useItemStore()
  const [lastReport, setLastReport] = useState<TurnReport | null>(null)
  const [showReport, setShowReport] = useState(false)
  const [savedFlash, setSavedFlash] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showNewCompanyDialog, setShowNewCompanyDialog] = useState(false)
  const [showEventLog, setShowEventLog] = useState(false)
  const [showItemBag, setShowItemBag] = useState(false)
  const totalItems = getTotalItems()

  // ターン終了後にクラウド保存
  useEffect(() => {
    if (!user || turn <= 1) return
    const state = useGameStore.getState()
    cloudSaveGame(user.id, state).then(() => {
      setSavedFlash(true)
      setTimeout(() => setSavedFlash(false), 2000)
    })
  }, [turn])

  async function handleManualSave() {
    if (!user || !company) return
    setSaving(true)
    const state = useGameStore.getState()
    await cloudSaveGame(user.id, state)
    setSaving(false)
    setSavedFlash(true)
    setTimeout(() => setSavedFlash(false), 2000)
  }

  async function handleNewCompanyWithSave() {
    if (user && company) {
      const state = useGameStore.getState()
      await cloudSaveGame(user.id, state)
    }
    setShowNewCompanyDialog(false)
    resetGame()
    startSetup()
  }

  function handleNewCompanyWithoutSave() {
    setShowNewCompanyDialog(false)
    resetGame()
    startSetup()
  }

  function handleEndTurn() {
    const prevPrice = stockHistory.at(-1)?.price ?? 0
    hapticMedium()
    soundTurnEnd()
    endTurn()
    const s = useGameStore.getState()
    const rep = s.reports[s.reports.length - 1]
    if (rep) {
      setLastReport(rep)
      setShowReport(true)
      // 株価変動に応じたフィードバック
      const newPrice = s.stockHistory.at(-1)?.price ?? 0
      setTimeout(() => {
        if (newPrice > prevPrice) { hapticSuccess(); soundUp() }
        else if (newPrice < prevPrice * 0.95) { hapticWarning(); soundDown() }
      }, 300)
    }
  }

  if (!company) return null

  const currentPrice = stockHistory.at(-1)?.price ?? 0
  const ipoPrice = stockHistory[0]?.price ?? 1
  const marketCap = currentPrice * financials.shares
  const priceReturn = ((currentPrice - ipoPrice) / ipoPrice * 100).toFixed(1)
  const isPriceUp = currentPrice >= ipoPrice
  const progress = ((turn - 1) / maxTurns) * 100
  const quarter = `Q${((turn - 1) % 4) + 1}`
  const year = `Y${Math.ceil((turn) / 4)}`

  return (
    <div className="min-h-screen bg-gray-950 text-white animate-screen">

      <header className="border-b border-gray-900 bg-gray-950/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3">

            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-base shadow-lg flex-shrink-0"
                style={{ backgroundColor: company.color, boxShadow: `0 4px 16px ${company.color}60` }}
              >
                {company.name[0]}
              </div>
              <div>
                <div className="font-black text-sm leading-tight">{company.name}</div>
                <div className="text-gray-500 text-xs">{company.industry}業</div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-right">
              {/* アイテムバッグボタン */}
              <button
                onClick={() => setShowItemBag(true)}
                className="relative w-9 h-9 flex items-center justify-center rounded-xl border border-gray-800 hover:border-indigo-600 text-gray-400 hover:text-indigo-400 transition-all active:scale-95"
              >
                <Package size={18} strokeWidth={1.8} />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 bg-indigo-600 rounded-full text-[9px] flex items-center justify-center font-black text-white px-0.5">
                    {totalItems}
                  </span>
                )}
              </button>
              {/* セーブボタン */}
              {user && (
                <button
                  onClick={handleManualSave}
                  disabled={saving}
                  className={`w-9 h-9 flex items-center justify-center rounded-xl border transition-all active:scale-95 ${
                    savedFlash
                      ? 'border-emerald-800 bg-emerald-950 text-emerald-400'
                      : 'border-gray-800 hover:border-gray-600 text-gray-400 hover:text-white'
                  }`}
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : savedFlash ? <Check size={16} /> : <Save size={16} strokeWidth={1.8} />}
                </button>
              )}
              <div className="hidden sm:block">
                <div className="text-xs text-gray-500">時価総額</div>
                <div className="font-bold text-sm">{formatMoney(marketCap)}</div>
              </div>
              <div className="hidden sm:block">
                <div className="text-xs text-gray-500">現金</div>
                <div className="font-bold text-sm">{formatMoney(financials.cash)}</div>
              </div>
              <div
                className="h-9 px-2.5 rounded-xl flex items-center gap-1.5 border"
                style={{ borderColor: company.color + '60', backgroundColor: company.color + '15' }}
              >
                <span className="text-xs font-black" style={{ color: company.color }}>{quarter}</span>
                <span className="text-gray-600 text-xs">/</span>
                <span className="text-white font-black text-xs">{turn - 1}<span className="text-gray-600 font-normal">/{maxTurns}</span></span>
              </div>
              <UserMenu onShowHistory={onShowHistory} onShowRanking={onShowRanking} />
            </div>
          </div>

          <div className="mt-2.5 h-1.5 bg-gray-900 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${company.color}, ${company.color}aa)` }}
            />
          </div>

          {/* アクティブエフェクト表示 */}
          {(activeEffects.profitMultiplier > 1 || activeEffects.forcePositiveSentiment || activeEffects.nullifyNextNegEvent || activeEffects.revenueBoostTurns > 0) && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {activeEffects.profitMultiplier > 1 && (
                <span className="text-[10px] font-bold bg-indigo-950 border border-indigo-800 text-indigo-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />方針改正中
                </span>
              )}
              {activeEffects.forcePositiveSentiment && (
                <span className="text-[10px] font-bold bg-amber-950 border border-amber-800 text-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />神の一手
                </span>
              )}
              {activeEffects.nullifyNextNegEvent && (
                <span className="text-[10px] font-bold bg-purple-950 border border-purple-800 text-purple-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" />危機待機中
                </span>
              )}
              {activeEffects.revenueBoostTurns > 0 && (
                <span className="text-[10px] font-bold bg-red-950 border border-red-800 text-red-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />ブースター残{activeEffects.revenueBoostTurns}T
                </span>
              )}
            </div>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-3">

        {/* 財務サマリー（3列コンパクト） */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: '売上', value: formatMoney(financials.revenue), color: 'text-blue-400' },
            { label: '利益', value: formatMoney(financials.profit),  color: financials.profit >= 0 ? 'text-emerald-400' : 'text-red-400' },
            { label: 'EPS',  value: `¥${financials.eps.toLocaleString()}`, color: 'text-indigo-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-gray-900 rounded-xl px-3 py-2 flex items-center justify-between border border-gray-800">
              <span className="text-gray-500 text-xs">{label}</span>
              <span className={`font-black text-xs ${color}`}>{value}</span>
            </div>
          ))}
        </div>

        <StockChart compact />
        <AllocationPanel onEndTurn={handleEndTurn} />

        <div className="flex items-center justify-between">
          <div className="text-gray-700 text-xs">
            残り {maxTurns - (turn - 1)} ターン · {INDUSTRY_STATS[company.industry].per}x PER
          </div>
          <button
            onClick={() => setShowEventLog(true)}
            className="text-xs text-gray-500 hover:text-gray-300 border border-gray-800 hover:border-gray-600 rounded-xl px-3 py-1.5 transition-colors flex items-center gap-1.5"
          >
            <ScrollText size={12} strokeWidth={1.8} />
            イベント履歴
          </button>
        </div>

        <button
          onClick={() => setShowNewCompanyDialog(true)}
          className="w-full text-gray-600 hover:text-gray-400 border border-gray-800 hover:border-gray-600 rounded-2xl py-3 text-sm transition-colors mb-4 flex items-center justify-center gap-2"
        >
          <Building2 size={14} strokeWidth={1.8} />
          新しい会社を作る
        </button>
      </main>

      {showReport && lastReport && (
        <TurnReportModal report={lastReport} onClose={() => setShowReport(false)} />
      )}
      {showEventLog && <EventLogModal onClose={() => setShowEventLog(false)} />}
      {showItemBag && <ItemBagModal onClose={() => setShowItemBag(false)} />}

      {/* 新しい会社作成確認ダイアログ */}
      {showNewCompanyDialog && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 z-50"
          onClick={() => setShowNewCompanyDialog(false)}
        >
          <div
            className="bg-gray-900 border border-gray-700 rounded-3xl w-full max-w-sm p-6 space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-gray-800 flex items-center justify-center mx-auto mb-3">
                <Building2 size={28} strokeWidth={1.5} className="text-gray-400" />
              </div>
              <h2 className="text-white font-black text-lg">新しい会社を作りますか？</h2>
              <p className="text-gray-400 text-sm mt-1">
                「{company.name}」の進行中データはどうしますか？
              </p>
            </div>

            {user && (
              <button
                onClick={handleNewCompanyWithSave}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-2xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <Save size={16} /> 保存して新しい会社へ
              </button>
            )}
            <button
              onClick={handleNewCompanyWithoutSave}
              className={`w-full ${user ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-indigo-600 hover:bg-indigo-500 text-white'} font-bold py-3.5 rounded-2xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2`}
            >
              <Rocket size={16} /> {user ? '保存せずに始める' : '新しい会社を作る'}
            </button>
            <button
              onClick={() => setShowNewCompanyDialog(false)}
              className="w-full text-gray-600 hover:text-gray-400 text-sm py-2 transition-colors"
            >
              キャンセル
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
