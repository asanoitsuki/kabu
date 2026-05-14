'use client'
import { hapticLight } from '@/lib/haptics'
import { Building2, BarChart2, Sparkles, Trophy, User } from 'lucide-react'

export type NavTab = 'startup' | 'history' | 'gacha' | 'ranking' | 'profile'

interface Props {
  active: NavTab
  onTab: (tab: NavTab) => void
  pendingFriends?: number
  gachaCoins?: number
}

const TABS: { id: NavTab; icon: React.ReactNode; label: string }[] = [
  { id: 'startup', icon: <Building2 size={22} strokeWidth={1.8} />, label: '起業' },
  { id: 'history', icon: <BarChart2  size={22} strokeWidth={1.8} />, label: '履歴' },
  { id: 'gacha',   icon: <Sparkles   size={22} strokeWidth={1.8} />, label: 'ガチャ' },
  { id: 'ranking', icon: <Trophy     size={22} strokeWidth={1.8} />, label: 'ランキング' },
  { id: 'profile', icon: <User       size={22} strokeWidth={1.8} />, label: 'プロフィール' },
]

export default function BottomNav({ active, onTab, pendingFriends = 0, gachaCoins = 0 }: Props) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 bg-gray-950/98 backdrop-blur-xl border-t border-white/5"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex max-w-lg mx-auto">
        {TABS.map(({ id, icon, label }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              onClick={() => { hapticLight(); onTab(id) }}
              className="flex-1 flex flex-col items-center pt-3 pb-3 gap-1 relative min-h-[60px]"
            >
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-indigo-400 rounded-full" />
              )}
              <span className={`relative transition-all duration-200 ${isActive ? 'text-indigo-400 scale-110' : 'text-gray-600'}`}>
                {icon}
                {id === 'profile' && pendingFriends > 0 && (
                  <span className="absolute -top-1 -right-1.5 min-w-[14px] h-[14px] bg-red-500 rounded-full text-[8px] flex items-center justify-center font-black text-white px-0.5">
                    {pendingFriends}
                  </span>
                )}
                {id === 'gacha' && gachaCoins > 0 && (
                  <span className="absolute -top-1 -right-1.5 min-w-[14px] h-[14px] bg-yellow-400 rounded-full text-[8px] flex items-center justify-center font-black text-gray-950 px-0.5">
                    {gachaCoins}
                  </span>
                )}
              </span>
              <span className={`text-[10px] font-medium tracking-tight transition-colors ${isActive ? 'text-indigo-400' : 'text-gray-600'}`}>
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
