'use client'

export type NavTab = 'news' | 'history' | 'ask-ai' | 'ranking' | 'home'

interface Props {
  active: NavTab
  onTab: (tab: NavTab) => void
}

const TABS: { id: NavTab; emoji: string; label: string }[] = [
  { id: 'news',     emoji: '📰', label: 'ニュース' },
  { id: 'history',  emoji: '📊', label: '履歴' },
  { id: 'ask-ai',   emoji: '🤖', label: 'Ask AI' },
  { id: 'ranking',  emoji: '🏆', label: 'ランキング' },
  { id: 'home',     emoji: '🏠', label: 'ホーム' },
]

export default function BottomNav({ active, onTab }: Props) {
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
              className="flex-1 flex flex-col items-center pt-2 pb-2.5 gap-0.5 relative transition-colors"
            >
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-indigo-500 rounded-full" />
              )}
              <span className={`text-xl transition-all ${isActive ? 'scale-110' : 'opacity-50'}`}>
                {emoji}
              </span>
              <span className={`text-[10px] font-bold transition-colors ${isActive ? 'text-indigo-400' : 'text-gray-600'}`}>
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
