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
              {/* Google ログイン */}
              <button
                onClick={signInWithGoogle}
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-900 font-bold py-3.5 rounded-xl transition-all hover:scale-105 active:scale-95 mb-4"
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Googleでログイン
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-gray-800" />
                <span className="text-gray-600 text-xs">またはメールで</span>
                <div className="flex-1 h-px bg-gray-800" />
              </div>

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
                    className="w-full bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white font-bold py-3.5 rounded-xl transition-all hover:scale-105 active:scale-95"
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
