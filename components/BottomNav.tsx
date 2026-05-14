'use client'

export type NavTab = 'startup' | 'history' | 'badges' | 'ranking' | 'profile'

interface Props {
  active: NavTab
  onTab: (tab: NavTab) => void
  pendingFriends?: number
}

const TABS: { id: NavTab; emoji: string; label: string }[] = [
  { id: 'startup', emoji: '🏢', label: '起業' },
  { id: 'history', emoji: '📊', label: '履歴' },
  { id: 'badges',  emoji: '🏅', label: '実績' },
  { id: 'ranking', emoji: '🏆', label: 'ランキング' },
  { id: 'profile', emoji: '👤', label: 'プロフィール' },
]

export default function BottomNav({ active, onTab, pendingFriends = 0 }: Props) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 bg-gray-950/95 backdrop-blur-md border-t border-gray-800"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex max-w-lg mx-auto">
        {TABS.map(({ id, emoji, label }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              onClick={() => onTab(id)}
              className="flex-1 flex flex-col items-center pt-3 pb-3 gap-1 relative transition-colors min-h-[60px]"
            >
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-indigo-500 rounded-full" />
              )}
              <span className={`text-2xl transition-all relative ${isActive ? 'scale-110' : 'opacity-50'}`}>
                {emoji}
                {id === 'profile' && pendingFriends > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] bg-red-500 rounded-full text-[9px] flex items-center justify-center font-black text-white px-0.5">
                    {pendingFriends}
                  </span>
                )}
              </span>
              <span className={`text-[11px] font-bold transition-colors ${isActive ? 'text-indigo-400' : 'text-gray-600'}`}>
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
