'use client'
import { useState } from 'react'
import { useItemStore } from '@/store/itemStore'
import { useGameStore } from '@/store/gameStore'
import { ITEMS, ITEM_MAP, RARITY_CONFIG } from '@/lib/items'
import { Package, X, Check } from 'lucide-react'

interface Props {
  onClose: () => void
}

export default function ItemBagModal({ onClose }: Props) {
  const { inventory, useItem } = useItemStore()
  const { activeEffects, applyStockRecovery, applyMotivationReform, applyDivineMove, applyCrisisManual, applyRocketBooster } = useGameStore()
  const [confirm, setConfirm] = useState<string | null>(null)
  const [usedFlash, setUsedFlash] = useState<string | null>(null)

  const totalItems = ITEMS.reduce((s, it) => s + (inventory[it.id] ?? 0), 0)

  function canUse(itemId: string): { ok: boolean; reason?: string } {
    if ((inventory[itemId] ?? 0) <= 0) return { ok: false, reason: '所持していません' }
    switch (itemId) {
      case 'stock_recovery':
        if (activeEffects.stockRecoveryUsed) return { ok: false, reason: '1ゲームに1回のみ使用可' }
        return { ok: true }
      case 'motivation_reform':
        if (activeEffects.profitMultiplier > 1) return { ok: false, reason: '効果発動中' }
        return { ok: true }
      case 'divine_move':
        if (activeEffects.forcePositiveSentiment) return { ok: false, reason: '効果発動中' }
        return { ok: true }
      case 'crisis_manual':
        if (activeEffects.nullifyNextNegEvent) return { ok: false, reason: '効果発動中' }
        return { ok: true }
      case 'rocket_booster':
        if (activeEffects.revenueBoostTurns > 0) return { ok: false, reason: `効果発動中（残り${activeEffects.revenueBoostTurns}T）` }
        return { ok: true }
      default:
        return { ok: true }
    }
  }

  function handleUse(itemId: string) {
    if (!useItem(itemId)) return
    switch (itemId) {
      case 'stock_recovery':    applyStockRecovery(); break
      case 'motivation_reform': applyMotivationReform(); break
      case 'divine_move':       applyDivineMove(); break
      case 'crisis_manual':     applyCrisisManual(); break
      case 'rocket_booster':    applyRocketBooster(); break
    }
    setConfirm(null)
    setUsedFlash(itemId)
    setTimeout(() => { setUsedFlash(null); onClose() }, 1200)
  }

  // アクティブエフェクト表示
  const activeList: { label: string; color: string }[] = []
  if (activeEffects.profitMultiplier > 1)       activeList.push({ label: '方針改正書 発動中', color: '#6366f1' })
  if (activeEffects.forcePositiveSentiment)      activeList.push({ label: '神の一手 発動中', color: '#f59e0b' })
  if (activeEffects.nullifyNextNegEvent)         activeList.push({ label: '危機管理マニュアル 待機中', color: '#8b5cf6' })
  if (activeEffects.revenueBoostTurns > 0)       activeList.push({ label: `ブースター 残り${activeEffects.revenueBoostTurns}T`, color: '#ef4444' })

  return (
    <div
      className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 z-50"
      onClick={confirm ? undefined : onClose}
    >
      <div
        className="w-full max-w-sm bg-gray-950 border border-gray-700 rounded-3xl overflow-hidden"
        style={{ maxHeight: '90dvh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="p-5">
          {/* ヘッダー */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gray-800 flex items-center justify-center flex-shrink-0">
                <Package size={18} strokeWidth={1.8} className="text-gray-300" />
              </div>
              <div>
                <h2 className="text-white font-black text-base leading-tight">アイテムバッグ</h2>
                <p className="text-gray-500 text-xs">
                  {totalItems > 0 ? `${totalItems}個所持中` : '所持アイテムなし'}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-600 hover:text-gray-400 transition-colors p-1">
              <X size={18} strokeWidth={2} />
            </button>
          </div>

          {/* 発動中エフェクト */}
          {activeList.length > 0 && (
            <div className="mb-4 space-y-1.5">
              <p className="text-gray-500 text-xs font-bold">◆ 現在の効果</p>
              {activeList.map((a, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-900 border border-gray-800 text-xs font-bold" style={{ color: a.color }}>
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: a.color }} />
                  {a.label}
                </div>
              ))}
            </div>
          )}

          {/* 使用完了フラッシュ */}
          {usedFlash && (
            <div className="mb-4 text-center py-4 bg-emerald-950 border border-emerald-700 rounded-2xl">
              <div className="text-3xl mb-1">{ITEM_MAP[usedFlash]?.emoji}</div>
              <div className="text-emerald-400 font-black text-sm">「{ITEM_MAP[usedFlash]?.name}」を使用しました！</div>
              <div className="text-emerald-600 text-xs mt-1">{ITEM_MAP[usedFlash]?.shortEffect}</div>
            </div>
          )}

          {/* アイテム一覧 */}
          {!usedFlash && (
            <div className="space-y-2">
              {ITEMS.map(item => {
                const count = inventory[item.id] ?? 0
                const { ok, reason } = canUse(item.id)
                const rarCfg = RARITY_CONFIG[item.rarity]
                const isConfirming = confirm === item.id

                return (
                  <div
                    key={item.id}
                    className={`rounded-2xl border-2 p-4 transition-all ${
                      count > 0 ? `${item.bg} ${item.border}` : 'bg-gray-900 border-gray-800 opacity-40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="text-3xl w-12 h-12 flex items-center justify-center rounded-xl flex-shrink-0"
                        style={{ backgroundColor: item.color + '20', border: `1.5px solid ${item.color}50` }}
                      >
                        {item.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-black text-sm">{item.name}</span>
                          <span className={`text-[10px] font-bold ${rarCfg.textColor}`}>{rarCfg.label}</span>
                        </div>
                        <p className="text-gray-400 text-xs mt-0.5 leading-tight">{item.shortEffect}</p>
                        {!ok && reason && (
                          <p className="text-xs mt-0.5" style={{ color: item.color + 'aa' }}>{reason}</p>
                        )}
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <div className="text-white font-black text-lg">{count}</div>
                        <div className="text-gray-600 text-[10px]">所持</div>
                      </div>
                    </div>

                    {/* 使用ボタン */}
                    {count > 0 && (
                      <div className="mt-3">
                        {isConfirming ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleUse(item.id)}
                              className="flex-1 font-black py-2 rounded-xl text-sm transition-all hover:scale-105 active:scale-95 text-white flex items-center justify-center gap-1"
                              style={{ backgroundColor: item.color, boxShadow: `0 4px 12px ${item.color}50` }}
                            >
                              <Check size={14} strokeWidth={2.5} /> 使う
                            </button>
                            <button
                              onClick={() => setConfirm(null)}
                              className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-400 font-bold py-2 rounded-xl text-sm transition-all"
                            >
                              キャンセル
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => ok ? setConfirm(item.id) : undefined}
                            disabled={!ok}
                            className="w-full font-bold py-2 rounded-xl text-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed border"
                            style={ok ? {
                              backgroundColor: item.color + '20',
                              color: item.color,
                              borderColor: item.color + '60',
                            } : {
                              backgroundColor: 'transparent',
                              color: '#6b7280',
                              borderColor: '#374151',
                            }}
                          >
                            {ok ? '使用する' : reason}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}

              {totalItems === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-2xl bg-gray-900 flex items-center justify-center mx-auto mb-3">
                    <Package size={32} strokeWidth={1.5} className="text-gray-700" />
                  </div>
                  <p className="text-gray-400 font-bold text-sm">アイテムを持っていません</p>
                  <p className="text-gray-600 text-xs mt-1">プロフィールのガチャでアイテムを入手しよう</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
