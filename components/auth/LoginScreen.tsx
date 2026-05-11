'use client'
import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { isSupabaseConfigured } from '@/lib/supabase'

interface Props {
  onGuest: () => void
}

export default function LoginScreen({ onGuest }: Props) {
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
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">

        {/* ロゴ */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-indigo-600 text-4xl shadow-2xl shadow-indigo-900/60 mb-5">
            📈
          </div>
          <h1 className="text-3xl font-black text-white">株式会社シミュレーター</h1>
          <p className="text-gray-400 text-sm mt-2">ログインしてプレイ履歴を保存しよう</p>
        </div>

        <div className="bg-gray-900 rounded-3xl border border-gray-800 p-6 space-y-4">

          {!isSupabaseConfigured ? (
            <div className="bg-yellow-950 border border-yellow-800 rounded-2xl p-4 text-center">
              <p className="text-yellow-300 font-bold text-sm">⚙️ Supabase未設定</p>
            </div>
          ) : sent ? (
            <div className="bg-emerald-950 border border-emerald-800 rounded-2xl p-6 text-center">
              <div className="text-4xl mb-3">📧</div>
              <p className="text-emerald-300 font-bold">メールを送信しました！</p>
              <p className="text-gray-400 text-sm mt-2">{email} に届いたリンクをクリックしてください</p>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>

        <button
          onClick={onGuest}
          className="w-full mt-4 text-gray-600 hover:text-gray-400 text-sm py-3 transition-colors"
        >
          ログインせずにゲストとして遊ぶ →
        </button>
      </div>
    </div>
  )
}
