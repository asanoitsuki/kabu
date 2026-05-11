'use client'
import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { isSupabaseConfigured } from '@/lib/supabase'

interface Props {
  onClose: () => void
}

export default function AuthModal({ onClose }: Props) {
  const { signInWithGoogle, signInWithEmail } = useAuthStore()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await signInWithEmail(email)
    if (error) setError(error)
    else setSent(true)
    setLoading(false)
  }

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 rounded-3xl max-w-sm w-full shadow-2xl border border-gray-800 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🔐</div>
            <h2 className="text-white font-black text-2xl">ログイン</h2>
            <p className="text-gray-400 text-sm mt-2">
              プレイ履歴の保存・どこでも続きから
            </p>
          </div>

          {!isSupabaseConfigured ? (
            <div className="bg-yellow-950 border border-yellow-800 rounded-2xl p-4 text-center">
              <p className="text-yellow-300 font-bold text-sm">⚙️ Supabase未設定</p>
              <p className="text-gray-400 text-xs mt-1">環境変数を設定してください</p>
            </div>
          ) : (
            <>
              {sent ? (
                <div className="bg-emerald-950 border border-emerald-800 rounded-2xl p-5 text-center">
                  <div className="text-3xl mb-2">📧</div>
                  <p className="text-emerald-300 font-bold text-sm">メールを送信しました！</p>
                  <p className="text-gray-400 text-xs mt-1">{email} のリンクをクリック</p>
                </div>
              ) : (
                <form onSubmit={handleEmailSubmit} className="space-y-3">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="メールアドレス"
                    required
                    className="w-full bg-gray-800 text-white rounded-xl px-4 py-3.5 outline-none border-2 border-gray-700 focus:border-indigo-500 transition-colors placeholder-gray-600"
                  />
                  {error && <p className="text-red-400 text-xs">{error}</p>}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 text-white font-bold py-3.5 rounded-xl transition-all hover:scale-105 active:scale-95"
                  >
                    {loading ? '送信中...' : 'マジックリンクを送る'}
                  </button>
                </form>
              )}
            </>
          )}

          <button
            onClick={onClose}
            className="w-full mt-4 text-gray-600 hover:text-gray-400 text-sm py-2 transition-colors"
          >
            ゲストとして続ける
          </button>
        </div>
      </div>
    </div>
  )
}
