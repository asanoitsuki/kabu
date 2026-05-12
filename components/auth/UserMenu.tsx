'use client'
import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import GlossaryModal from '@/components/game/GlossaryModal'

interface Props {
  onShowHistory: () => void
  onShowRanking: () => void
}

export default function UserMenu({ onShowHistory, onShowRanking }: Props) {
  const { user, signOut } = useAuthStore()
  const [open, setOpen] = useState(false)
  const [showGlossary, setShowGlossary] = useState(false)

  if (!user) return null

  const name = user.user_metadata?.full_name ?? user.email ?? 'ユーザー'
  const initial = name[0].toUpperCase()
  const avatarUrl = user.user_metadata?.avatar_url as string | undefined

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-9 h-9 rounded-full overflow-hidden border-2 border-gray-700 hover:border-indigo-500 transition-colors flex-shrink-0"
        title={name}
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-indigo-600 flex items-center justify-center text-white font-black text-sm">
            {initial}
          </div>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-11 w-52 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-800">
              <p className="text-white font-bold text-sm truncate">{name}</p>
              <p className="text-gray-500 text-xs truncate">{user.email}</p>
            </div>
            <button
              onClick={() => { setOpen(false); onShowHistory() }}
              className="w-full text-left px-4 py-3 text-gray-300 hover:bg-gray-800 text-sm transition-colors"
            >
              📊 プレイ履歴
            </button>
            <button
              onClick={() => { setOpen(false); onShowRanking() }}
              className="w-full text-left px-4 py-3 text-gray-300 hover:bg-gray-800 text-sm transition-colors"
            >
              🏆 世界ランキング
            </button>
            <button
              onClick={() => { setOpen(false); setShowGlossary(true) }}
              className="w-full text-left px-4 py-3 text-gray-300 hover:bg-gray-800 text-sm transition-colors"
            >
              📖 用語集
            </button>
            <button
              onClick={() => { setOpen(false); signOut() }}
              className="w-full text-left px-4 py-3 text-red-400 hover:bg-gray-800 text-sm transition-colors border-t border-gray-800"
            >
              🚪 ログアウト
            </button>
          </div>
        </>
      )}
      {showGlossary && <GlossaryModal onClose={() => setShowGlossary(false)} />}
    </div>
  )
}
