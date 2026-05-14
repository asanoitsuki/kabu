'use client'
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useAchievementStore, calcLevel, xpToNextLevel } from '@/store/achievementStore'
import { getProfile, upsertProfile, searchProfiles, UserProfile } from '@/lib/profile'
import { sendFriendRequest, acceptFriendRequest, removeFriend, getFriends, FriendEntry } from '@/lib/friends'
import { detectBannedWord } from '@/lib/bannedWords'

const AVATARS = ['😊','🚀','🔥','💎','👑','🏆','⚡','🌟','🦊','🐉','🎮','💼','🏭','💰','🎵','🌈','🦁','🐺','🦋','🎯']

export default function ProfileScreen() {
  const { user, signOut } = useAuthStore()
  const { xp, level } = useAchievementStore()
  const { progress: xpProgress, current: xpCurrent, required: xpRequired } = xpToNextLevel(xp)

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [username, setUsername] = useState('')
  const [avatar, setAvatar] = useState('😊')
  const [usernameError, setUsernameError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // フレンド
  const [friends, setFriends] = useState<FriendEntry[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<UserProfile[]>([])
  const [searching, setSearching] = useState(false)
  const [friendMsg, setFriendMsg] = useState<string | null>(null)
  const [tab, setTab] = useState<'profile' | 'friends'>('profile')

  useEffect(() => {
    if (!user) return
    getProfile(user.id).then(p => {
      if (p) {
        setProfile(p)
        setUsername(p.username ?? '')
        setAvatar(p.avatar ?? '😊')
      } else {
        setUsername(user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? '')
      }
    })
    getFriends(user.id).then(setFriends)
  }, [user])

  async function handleSave() {
    if (!user) return
    const trimmed = username.trim()
    if (!trimmed) { setUsernameError('ニックネームを入力してください'); return }
    const banned = detectBannedWord(trimmed)
    if (banned) { setUsernameError('そのニックネームは使用できません'); return }
    setSaving(true)
    await upsertProfile({ id: user.id, username: trimmed, avatar, xp, level: calcLevel(xp) })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function handleSearch() {
    if (!searchQuery.trim()) return
    setSearching(true)
    const results = await searchProfiles(searchQuery.trim())
    setSearchResults(results.filter(r => r.id !== user?.id))
    setSearching(false)
  }

  async function handleAddFriend(targetId: string) {
    if (!user) return
    const { error } = await sendFriendRequest(user.id, targetId)
    if (error) {
      setFriendMsg(error)
    } else {
      setFriendMsg('フレンド申請を送りました！')
      setSearchResults([])
      setSearchQuery('')
      getFriends(user.id).then(setFriends)
    }
    setTimeout(() => setFriendMsg(null), 3000)
  }

  async function handleAccept(requesterId: string) {
    if (!user) return
    await acceptFriendRequest(user.id, requesterId)
    getFriends(user.id).then(setFriends)
  }

  async function handleRemove(friendId: string) {
    if (!user) return
    await removeFriend(user.id, friendId)
    getFriends(user.id).then(setFriends)
  }

  const accepted = friends.filter(f => f.status === 'accepted')
  const pending  = friends.filter(f => f.status === 'pending')

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
        <p className="text-gray-500">ログインしてください</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-lg mx-auto">

        {/* ヘッダー */}
        <div className="bg-gray-950/95 backdrop-blur-sm border-b border-gray-800 px-4 py-4 sticky top-0 z-10">
          <div className="flex gap-3">
            <button
              onClick={() => setTab('profile')}
              className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all ${
                tab === 'profile' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              👤 プロフィール
            </button>
            <button
              onClick={() => setTab('friends')}
              className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all relative ${
                tab === 'friends' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              👥 フレンド
              {pending.filter(f => !f.iAmRequester).length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center font-black">
                  {pending.filter(f => !f.iAmRequester).length}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="p-4 space-y-5 pb-24">

          {/* ── プロフィールタブ ── */}
          {tab === 'profile' && (
            <>
              {/* XP/レベル */}
              <div className="bg-gradient-to-br from-indigo-950 to-purple-950 rounded-3xl p-6 border border-indigo-800">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-5xl">{avatar}</div>
                  <div>
                    <div className="text-white font-black text-xl">{username || '名前未設定'}</div>
                    <div className="text-indigo-300 text-sm">Lv.{calcLevel(xp)} · {xp.toLocaleString()} XP</div>
                  </div>
                </div>
                {xpRequired > 0 && (
                  <div>
                    <div className="h-2.5 bg-indigo-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full transition-all duration-700"
                        style={{ width: `${xpProgress}%` }}
                      />
                    </div>
                    <div className="text-indigo-400 text-xs mt-1.5 text-right">
                      次のレベルまで {(xpRequired - xpCurrent).toLocaleString()} XP
                    </div>
                  </div>
                )}
              </div>

              {/* ニックネーム */}
              <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5 space-y-4">
                <h3 className="text-white font-black">ニックネーム</h3>
                <input
                  type="text"
                  value={username}
                  onChange={e => { setUsername(e.target.value); setUsernameError(null) }}
                  maxLength={20}
                  placeholder="ニックネームを入力"
                  className={`w-full bg-gray-800 text-white rounded-xl px-4 py-3 outline-none border-2 transition-colors placeholder-gray-600 ${
                    usernameError ? 'border-red-500' : 'border-gray-700 focus:border-indigo-500'
                  }`}
                />
                {usernameError && <p className="text-red-400 text-xs">{usernameError}</p>}
              </div>

              {/* アバター */}
              <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
                <h3 className="text-white font-black mb-4">アバター</h3>
                <div className="grid grid-cols-5 gap-3">
                  {AVATARS.map(a => (
                    <button
                      key={a}
                      onClick={() => setAvatar(a)}
                      className={`w-full aspect-square rounded-2xl text-3xl flex items-center justify-center transition-all ${
                        avatar === a
                          ? 'bg-indigo-600 scale-110 shadow-lg shadow-indigo-900'
                          : 'bg-gray-800 hover:bg-gray-700'
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-60 text-white font-black py-4 rounded-2xl text-lg transition-all hover:scale-105 active:scale-95"
              >
                {saving ? '保存中...' : saved ? '✓ 保存しました' : '💾 保存する'}
              </button>

              <button
                onClick={signOut}
                className="w-full text-gray-600 hover:text-gray-400 text-sm py-2 transition-colors"
              >
                ログアウト
              </button>
            </>
          )}

          {/* ── フレンドタブ ── */}
          {tab === 'friends' && (
            <>
              {/* 検索 */}
              <div className="bg-gray-900 rounded-2xl border border-gray-800 p-4 space-y-3">
                <h3 className="text-white font-black text-sm">ユーザーを検索してフレンド追加</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    placeholder="ニックネームで検索"
                    className="flex-1 bg-gray-800 text-white rounded-xl px-4 py-3 outline-none border-2 border-gray-700 focus:border-indigo-500 transition-colors placeholder-gray-600 text-sm"
                  />
                  <button
                    onClick={handleSearch}
                    disabled={searching}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-3 rounded-xl transition-all active:scale-95"
                  >
                    🔍
                  </button>
                </div>
                {friendMsg && (
                  <p className="text-indigo-300 text-sm font-bold">{friendMsg}</p>
                )}
                {searchResults.map(r => (
                  <div key={r.id} className="flex items-center gap-3 bg-gray-800 rounded-xl p-3">
                    <span className="text-2xl">{r.avatar}</span>
                    <div className="flex-1">
                      <div className="text-white font-bold text-sm">{r.username}</div>
                      <div className="text-gray-400 text-xs">Lv.{r.level} · {r.xp.toLocaleString()} XP</div>
                    </div>
                    <button
                      onClick={() => handleAddFriend(r.id)}
                      className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-1.5 rounded-lg transition-all"
                    >
                      申請
                    </button>
                  </div>
                ))}
                {searchResults.length === 0 && searchQuery && !searching && (
                  <p className="text-gray-600 text-xs text-center py-2">見つかりませんでした</p>
                )}
              </div>

              {/* 受信中の申請 */}
              {pending.filter(f => !f.iAmRequester).length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-white font-black text-sm">📬 フレンド申請</h3>
                  {pending.filter(f => !f.iAmRequester).map(f => (
                    <div key={f.id} className="flex items-center gap-3 bg-gray-900 border border-indigo-800 rounded-2xl p-3">
                      <span className="text-2xl">{f.friendProfile?.avatar ?? '😊'}</span>
                      <div className="flex-1">
                        <div className="text-white font-bold text-sm">{f.friendProfile?.username ?? '?'}</div>
                        <div className="text-gray-400 text-xs">Lv.{f.friendProfile?.level} · {(f.friendProfile?.xp ?? 0).toLocaleString()} XP</div>
                      </div>
                      <button onClick={() => handleAccept(f.friendId)} className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg">承認</button>
                      <button onClick={() => handleRemove(f.friendId)} className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 font-bold px-3 py-1.5 rounded-lg">拒否</button>
                    </div>
                  ))}
                </div>
              )}

              {/* フレンド一覧 */}
              <div className="space-y-2">
                <h3 className="text-white font-black text-sm">
                  👥 フレンド {accepted.length}人
                </h3>
                {accepted.length === 0 && (
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
                    <p className="text-gray-600 text-sm">まだフレンドがいません</p>
                    <p className="text-gray-700 text-xs mt-1">上の検索でフレンドを追加しよう</p>
                  </div>
                )}
                {accepted.map(f => (
                  <div key={f.id} className="flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-2xl p-3">
                    <span className="text-2xl">{f.friendProfile?.avatar ?? '😊'}</span>
                    <div className="flex-1">
                      <div className="text-white font-bold text-sm">{f.friendProfile?.username ?? '?'}</div>
                      <div className="text-gray-400 text-xs">Lv.{f.friendProfile?.level} · {(f.friendProfile?.xp ?? 0).toLocaleString()} XP</div>
                    </div>
                    <button
                      onClick={() => handleRemove(f.friendId)}
                      className="text-xs text-gray-600 hover:text-red-400 transition-colors"
                    >
                      削除
                    </button>
                  </div>
                ))}

                {/* 送信中の申請 */}
                {pending.filter(f => f.iAmRequester).length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="text-gray-500 text-xs font-bold">申請中</h4>
                    {pending.filter(f => f.iAmRequester).map(f => (
                      <div key={f.id} className="flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-2xl p-3 opacity-60">
                        <span className="text-2xl">{f.friendProfile?.avatar ?? '😊'}</span>
                        <div className="flex-1">
                          <div className="text-white font-bold text-sm">{f.friendProfile?.username ?? '?'}</div>
                          <div className="text-gray-500 text-xs">承認待ち</div>
                        </div>
                        <button onClick={() => handleRemove(f.friendId)} className="text-xs text-gray-600 hover:text-red-400">取消</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
