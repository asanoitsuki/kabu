'use client'
import { useEffect } from 'react'
import { useAchievementStore } from '@/store/achievementStore'
import { ALL_ACHIEVEMENTS } from '@/lib/achievements'

const RARITY_CONFIG = {
  common:    { label: 'コモン',     color: 'text-gray-300',   border: 'border-gray-700',   bg: 'bg-gray-800/60' },
  rare:      { label: 'レア',       color: 'text-blue-400',   border: 'border-blue-800',   bg: 'bg-blue-950/60' },
  epic:      { label: 'エピック',   color: 'text-purple-400', border: 'border-purple-800', bg: 'bg-purple-950/60' },
  legendary: { label: 'レジェンド', color: 'text-yellow-400', border: 'border-yellow-700', bg: 'bg-yellow-950/60' },
}

export default function AchievementsScreen() {
  const { unlockedIds, newIds, clearNew } = useAchievementStore()

  useEffect(() => {
    if (newIds.length > 0) {
      const t = setTimeout(clearNew, 3000)
      return () => clearTimeout(t)
    }
  }, [newIds])

  const groups = ['legendary', 'epic', 'rare', 'common'] as const
  const total = ALL_ACHIEVEMENTS.length
  const unlocked = unlockedIds.length

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-2xl mx-auto px-4 py-6">

        <div className="mb-5">
          <h1 className="text-xl font-black">🏅 実績</h1>
          <p className="text-gray-500 text-xs mt-0.5">コレクションを集めよう</p>
        </div>

        {/* 進捗バー */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 mb-5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-white">達成率</span>
            <span className="text-sm font-black text-indigo-400">{unlocked} / {total}</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700"
              style={{ width: `${(unlocked / total) * 100}%` }}
            />
          </div>
        </div>

        {/* 新着通知 */}
        {newIds.length > 0 && (
          <div className="mb-4 bg-indigo-950 border border-indigo-600 rounded-2xl p-3 flex items-center gap-3 animate-pulse">
            <span className="text-2xl">🎉</span>
            <div>
              <p className="text-indigo-300 font-bold text-sm">新しい実績を解除！</p>
              <p className="text-indigo-400 text-xs">
                {newIds.map(id => ALL_ACHIEVEMENTS.find(a => a.id === id)?.title).filter(Boolean).join(' / ')}
              </p>
            </div>
          </div>
        )}

        {/* 実績一覧 */}
        {groups.map(rarity => {
          const items = ALL_ACHIEVEMENTS.filter(a => a.rarity === rarity)
          const cfg = RARITY_CONFIG[rarity]
          return (
            <div key={rarity} className="mb-5">
              <div className={`text-xs font-black uppercase tracking-widest mb-2 ${cfg.color}`}>
                {cfg.label}
              </div>
              <div className="grid grid-cols-1 gap-2">
                {items.map(achievement => {
                  const isUnlocked = unlockedIds.includes(achievement.id)
                  const isNew = newIds.includes(achievement.id)
                  return (
                    <div
                      key={achievement.id}
                      className={`rounded-2xl p-3.5 border flex items-center gap-3.5 transition-all
                        ${isUnlocked
                          ? `${cfg.bg} ${cfg.border} ${isNew ? 'ring-2 ring-indigo-500' : ''}`
                          : 'bg-gray-900/40 border-gray-800 opacity-50'
                        }`}
                    >
                      <div className={`text-3xl w-10 text-center flex-shrink-0 ${!isUnlocked ? 'grayscale' : ''}`}>
                        {isUnlocked ? achievement.icon : '🔒'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-black text-sm ${isUnlocked ? 'text-white' : 'text-gray-600'}`}>
                          {isUnlocked ? achievement.title : '???'}
                        </div>
                        <div className={`text-xs mt-0.5 ${isUnlocked ? 'text-gray-400' : 'text-gray-700'}`}>
                          {isUnlocked ? achievement.description : 'まだ解除されていません'}
                        </div>
                      </div>
                      {isUnlocked && (
                        <div className={`text-xs font-bold flex-shrink-0 ${cfg.color}`}>✓</div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
