'use client'
import { useEffect, useState } from 'react'
import { useGameStore } from '@/store/gameStore'
import { useAuthStore } from '@/store/authStore'
import { SaveSlot, loadAllSaves, deleteSave } from '@/lib/cloudSave'
import { DIFFICULTY_CONFIG } from '@/lib/gameLogic'
import { Difficulty } from '@/lib/types'

const GRADE_STYLE: Record<string, { text: string; bg: string; border: string }> = {
  S: { text: 'text-yellow-400',  bg: 'bg-yellow-950',  border: 'border-yellow-800' },
  A: { text: 'text-emerald-400', bg: 'bg-emerald-950', border: 'border-emerald-800' },
  B: { text: 'text-blue-400',    bg: 'bg-blue-950',    border: 'border-blue-800' },
  C: { text: 'text-gray-300',    bg: 'bg-gray-900',    border: 'border-gray-700' },
  D: { text: 'text-orange-400',  bg: 'bg-orange-950',  border: 'border-orange-900' },
  F: { text: 'text-red-400',     bg: 'bg-red-950',     border: 'border-red-900' },
}

const INDUSTRY_EMOJI: Record<string, string> = {
  IT: '💻', 製造: '🏭', 飲食: '🍜', 金融: '💰', エンタメ: '🎮',
}

interface Props {
  onBack: () => void
  onPlay: () => void
}

export default function HistoryScreen({ onBack, onPlay }: Props) {
  const { user } = useAuthStore()
  const { loadFromCloud } = useGameStore()
  const [saves, setSaves] = useState<SaveSlot[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    loadAllSaves(user.id).then(data => {
      setSaves(data)
      setLoading(false)
    })
  }, [user])

  function handleContinue(slot: SaveSlot) {
    loadFromCloud(slot.game_state)
    onBack()
  }

  async function handleDelete(slot: SaveSlot) {
    if (!user) return
    await deleteSave(user.id, slot.company_name)
    setSaves(prev => prev.filter(s => s.company_name !== slot.company_name))
  }

  const playingCount = saves.filter(s => s.game_state?.phase === 'playing').length
  const bestReturn = saves.length > 0 ? Math.max(...saves.map(s => Number(s.total_return))) : null
  const sCount = saves.filter(s => s.grade === 'S').length

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-lg mx-auto p-4 py-8 space-y-5">

        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-600 transition-colors text-lg"
          >
            ←
          </button>
          <div>
            <h1 className="text-2xl font-black">プレイ履歴</h1>
            <p className="text-gray-500 text-sm">{loading ? '...' : `${saves.length}社 · 進行中${playingCount}社`}</p>
          </div>
        </div>

        {saves.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800 text-center">
              <div className="text-yellow-400 font-black text-2xl">{sCount}</div>
              <div className="text-gray-500 text-xs mt-0.5">Sランク</div>
            </div>
            <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800 text-center">
              <div className={`font-black text-2xl ${(bestReturn ?? 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {bestReturn !== null ? `${bestReturn >= 0 ? '+' : ''}${Number(bestReturn).toFixed(0)}%` : '-'}
              </div>
              <div className="text-gray-500 text-xs mt-0.5">最高リターン</div>
            </div>
            <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800 text-center">
              <div className="text-indigo-400 font-black text-2xl">{playingCount}</div>
              <div className="text-gray-500 text-xs mt-0.5">進行中</div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-16 text-gray-600">読み込み中...</div>
        ) : saves.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-gray-400 font-bold">まだセーブデータがありません</p>
            <p className="text-gray-600 text-sm mt-1">ゲーム中に💾セーブすると記録されます</p>
            <button
              onClick={onPlay}
              className="mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 px-8 rounded-xl transition-all hover:scale-105 active:scale-95"
            >
              🚀 プレイする
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {saves.map((slot) => {
              const isPlaying = slot.game_state?.phase === 'playing'
              const retNum = Number(slot.total_return)
              const cfg = DIFFICULTY_CONFIG[slot.difficulty as Difficulty]
              const style = GRADE_STYLE[slot.grade] ?? GRADE_STYLE.C
              const date = new Date(slot.updated_at).toLocaleDateString('ja-JP', {
                year: '2-digit', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit',
              })
              return (
                <div key={slot.id} className={`${style.bg} border ${style.border} rounded-2xl p-4`}>
                  <div className="flex items-center gap-3">
                    <div className={`text-4xl font-black w-10 text-center leading-none flex-shrink-0 ${style.text}`}
                      style={{ textShadow: '0 0 20px currentColor' }}>
                      {slot.grade}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold text-sm truncate">{slot.company_name}</span>
                        {isPlaying ? (
                          <span className="bg-indigo-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0">進行中</span>
                        ) : (
                          <span className="bg-gray-700 text-gray-300 text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0">完了</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="text-gray-500 text-xs">{INDUSTRY_EMOJI[slot.industry]} {slot.industry}</span>
                        {cfg && <span className="text-xs" style={{ color: cfg.color }}>{cfg.emoji} {cfg.label}</span>}
                        <span className="text-gray-600 text-xs">{slot.turn - 1}/{slot.max_turns}ターン</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className={`font-black text-base ${retNum >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {retNum >= 0 ? '+' : ''}{retNum.toFixed(1)}%
                      </div>
                      <div className="text-gray-600 text-xs">{date}</div>
                    </div>
                  </div>

                  {isPlaying && (
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => handleContinue(slot)}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-xl text-sm transition-all hover:scale-105 active:scale-95"
                      >
                        ▶ 続きから
                      </button>
                      <button
                        onClick={() => handleDelete(slot)}
                        className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-500 hover:text-red-400 rounded-xl text-xs transition-colors"
                      >
                        削除
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
