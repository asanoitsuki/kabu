'use client'
import { useState } from 'react'
import { useItemStore } from '@/store/itemStore'
import { ITEM_MAP, RARITY_CONFIG, ItemRarity } from '@/lib/items'

interface Props {
  onClose: () => void
}

type Phase = 'idle' | 'rolling' | 'reveal'

export default function GachaModal({ onClose }: Props) {
  const { gachaCoins, rollGacha, inventory } = useItemStore()
  const [phase, setPhase] = useState<Phase>('idle')
  const [result, setResult] = useState<string | null>(null)

  function handleRoll() {
    if (gachaCoins < 1 || phase !== 'idle') return
    setPhase('rolling')
    setTimeout(() => {
      const itemId = rollGacha()
      setResult(itemId)
      setPhase('reveal')
    }, 1800)
  }

  function handleNext() {
    setResult(null)
    setPhase('idle')
  }

  const item = result ? ITEM_MAP[result] : null
  const rarity = item?.rarity as ItemRarity | undefined
  const rarCfg = rarity ? RARITY_CONFIG[rarity] : null

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 z-50 overflow-hidden"
      onClick={phase === 'idle' ? onClose : undefined}
    >
      <div
        className="w-full max-w-sm rounded-3xl border border-gray-700 bg-gray-950 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div className="relative p-6 pb-0 text-center">
          <div className="text-3xl mb-1">🎰</div>
          <h2 className="text-white font-black text-xl">ガチャ</h2>
          <p className="text-gray-500 text-xs mt-1">アイテムをランダムで獲得！</p>
          <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-yellow-950 border border-yellow-800 rounded-xl px-3 py-1.5">
            <span className="text-yellow-400 text-sm">🪙</span>
            <span className="text-yellow-300 font-black text-sm">{gachaCoins}</span>
          </div>
        </div>

        {/* メインエリア */}
        <div className="p-6">
          {/* idle / rolling フェーズ */}
          {phase !== 'reveal' && (
            <div className="text-center space-y-6">
              {/* ガチャ球アニメーション */}
              <div className="flex items-center justify-center h-40">
                {phase === 'idle' ? (
                  <div className="relative">
                    <div
                      className="w-28 h-28 rounded-full flex items-center justify-center text-5xl shadow-2xl border-4 border-indigo-600"
                      style={{ background: 'radial-gradient(circle at 35% 35%, #818cf8, #4338ca, #1e1b4b)', boxShadow: '0 0 40px #6366f180' }}
                    >
                      ❓
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-8 bg-gray-700 rounded-full" />
                  </div>
                ) : (
                  <div className="relative" style={{ animation: 'gachaSpin 0.3s linear infinite' }}>
                    <div
                      className="w-28 h-28 rounded-full flex items-center justify-center text-5xl shadow-2xl border-4 border-yellow-500"
                      style={{ background: 'radial-gradient(circle at 35% 35%, #fde68a, #f59e0b, #78350f)', boxShadow: '0 0 60px #fbbf2480', animation: 'gachaGlow 0.3s ease-in-out infinite alternate' }}
                    >
                      ✨
                    </div>
                  </div>
                )}
              </div>

              {/* コスト表示 */}
              <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                <span className="text-yellow-400">🪙 1コイン</span>
                <span>消費</span>
              </div>

              {/* ボタン */}
              {phase === 'idle' && (
                <button
                  onClick={handleRoll}
                  disabled={gachaCoins < 1}
                  className="w-full font-black py-4 rounded-2xl text-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed"
                  style={gachaCoins >= 1 ? {
                    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                    color: 'white',
                    boxShadow: '0 8px 24px #6366f140',
                  } : {
                    background: '#374151',
                    color: '#6b7280',
                  }}
                >
                  {gachaCoins >= 1 ? '🎰 ガチャを引く！' : 'コインが足りません'}
                </button>
              )}
              {phase === 'rolling' && (
                <div className="text-indigo-400 font-black text-lg animate-pulse">
                  アイテムを選んでいます...
                </div>
              )}

              {/* コイン入手方法 */}
              {gachaCoins < 1 && (
                <p className="text-gray-600 text-xs">
                  ゲームでSランク: +3コイン / Aランク: +2コイン<br />
                  500XP達成ごと: +1コイン
                </p>
              )}
            </div>
          )}

          {/* reveal フェーズ */}
          {phase === 'reveal' && item && rarCfg && (
            <div className="text-center space-y-4" style={{ animation: 'gachaReveal 0.5s ease-out' }}>
              {/* レアリティバナー */}
              <div
                className={`inline-block px-4 py-1.5 rounded-full text-sm font-black border ${item.bg} ${item.border}`}
                style={{ color: item.color, boxShadow: `0 0 20px ${item.color}60` }}
              >
                {rarCfg.label}
              </div>

              {/* アイテム表示 */}
              <div
                className={`${item.bg} border-2 ${item.border} rounded-3xl p-8 mx-4`}
                style={{ boxShadow: `0 0 40px ${item.color}40` }}
              >
                <div
                  className="text-7xl mb-3"
                  style={{ filter: `drop-shadow(0 0 16px ${item.color})`, animation: 'gachaFloat 2s ease-in-out infinite' }}
                >
                  {item.emoji}
                </div>
                <div className="text-white font-black text-xl mb-2">{item.name}</div>
                <div className="text-xs font-bold" style={{ color: item.color }}>{item.shortEffect}</div>
                <div className="text-gray-400 text-xs mt-2 leading-relaxed">{item.description}</div>
              </div>

              {/* 所持数 */}
              <div className="text-gray-500 text-xs">
                現在の所持数: <span className="text-white font-bold">{inventory[item.id] ?? 0}</span>個
              </div>

              {/* ボタン */}
              <div className="flex gap-2">
                {gachaCoins >= 1 && (
                  <button
                    onClick={handleNext}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-black py-3.5 rounded-2xl transition-all hover:scale-105 active:scale-95"
                  >
                    🎰 もう一度
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold py-3.5 rounded-2xl transition-all"
                >
                  {gachaCoins >= 1 ? '閉じる' : '✓ 完了'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes gachaSpin {
          from { transform: rotate(0deg) scale(1); }
          50%  { transform: rotate(180deg) scale(1.1); }
          to   { transform: rotate(360deg) scale(1); }
        }
        @keyframes gachaGlow {
          from { box-shadow: 0 0 30px #fbbf2460; }
          to   { box-shadow: 0 0 80px #fbbf2499; }
        }
        @keyframes gachaReveal {
          from { opacity: 0; transform: scale(0.8) translateY(20px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes gachaFloat {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  )
}
