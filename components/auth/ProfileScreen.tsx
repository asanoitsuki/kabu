'use client'
import { useEffect, useState, useCallback } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useAchievementStore, calcLevel, xpToNextLevel } from '@/store/achievementStore'
import { useItemStore } from '@/store/itemStore'
import { getProfile, upsertProfile, searchProfiles, UserProfile } from '@/lib/profile'
import {
  sendFriendRequest, acceptFriendRequest, declineFriendRequest,
  removeFriend, getFriends, FriendEntry,
} from '@/lib/friends'
import { detectBannedWord } from '@/lib/bannedWords'
import { ITEMS, ITEM_MAP, RARITY_CONFIG } from '@/lib/items'
import GachaModal from '@/components/game/GachaModal'
import { useAchievementStore as useAchStore } from '@/store/achievementStore'
import { ALL_ACHIEVEMENTS } from '@/lib/achievements'
import { User, Package, Award, Users, Save, Check, X, Loader2 } from 'lucide-react'

const AVATARS = [
  '😊','🚀','🔥','💎','👑','🏆','⚡','🌟','🦊','🐉',
  '🎮','💼','🏭','💰','🎵','🌈','🦁','🐺','🦋','🎯',
  '🍜','💻','🏀','🎸','🌙','🦄','🐯','🦅','🌊','⚔️',
]

interface Props {
  onClose?: () => void
}

export default function ProfileScreen({ onClose }: Props) {
  const { user, signOut } = useAuthStore()
  const { xp } = useAchievementStore()
  const { inventory, gachaCoins } = useItemStore()
  const { progress: xpProgress, current: xpCurrent, required: xpRequired } = xpToNextLevel(xp)

  const [username, setUsername]       = useState('')
  const [avatar, setAvatar]           = useState('😊')
  const [usernameError, setUsernameError] = useState<string | null>(null)
  const [saving, setSaving]           = useState(false)
  const [saved, setSaved]             = useState(false)

  const [friends, setFriends]         = useState<FriendEntry[]>([])
  const [sentIds, setSentIds]         = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<UserProfile[]>([])
  const [searching, setSearching]     = useState(false)
  const [friendMsg, setFriendMsg]     = useState<string | null>(null)
  const [tab, setTab]                 = useState<'profile' | 'items' | 'badges' | 'friends'>('profile')
  const [showGacha, setShowGacha]     = useState(false)
  const { unlockedIds, newIds, clearNew } = useAchStore()
  const [loadingFriends, setLoadingFriends] = useState(false)

  const loadFriends = useCallback(async () => {
    if (!user) return
    setLoadingFriends(true)
    const data = await getFriends(user.id)
    setFriends(data)
    // 送信済みIDをセット
    const sent = new Set(data.filter(f => f.iAmRequester && f.status === 'pending').map(f => f.friendId))
    setSentIds(sent)
    setLoadingFriends(false)
  }, [user])

  useEffect(() => {
    if (!user) return
    getProfile(user.id).then(p => {
      if (p) {
        setUsername(p.username ?? '')
        setAvatar(p.avatar ?? '😊')
      } else {
        setUsername(user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? '')
      }
    })
    loadFriends()
  }, [user, loadFriends])

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
    // 自分・既フレンドを除外
    const friendIds = new Set(friends.map(f => f.friendId))
    setSearchResults(results.filter(r => r.id !== user?.id && !friendIds.has(r.id)))
    setSearching(false)
  }

  async function handleAddFriend(targetId: string, targetName: string) {
    if (!user) return
    const { error } = await sendFriendRequest(user.id, targetId)
    if (error) {
      setFriendMsg(`❌ ${error}`)
    } else {
      setSentIds(prev => new Set([...prev, targetId]))
      setFriendMsg(`✅ ${targetName}さんにフレンド申請を送りました！`)
      await loadFriends()
    }
    setTimeout(() => setFriendMsg(null), 3000)
  }

  async function handleAccept(requesterId: string) {
    if (!user) return
    await acceptFriendRequest(user.id, requesterId)
    await loadFriends()
  }

  async function handleDecline(requesterId: string) {
    if (!user) return
    await declineFriendRequest(user.id, requesterId)
    await loadFriends()
  }

  async function handleRemove(friendId: string) {
    if (!user) return
    await removeFriend(user.id, friendId)
    await loadFriends()
  }

  const accepted       = friends.filter(f => f.status === 'accepted')
  const receivedPending = friends.filter(f => f.status === 'pending' && !f.iAmRequester)
  const sentPending    = friends.filter(f => f.status === 'pending' && f.iAmRequester)

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-500 text-sm">ログインしてください</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">

      {/* ヘッダー */}
      <div className="bg-gray-950/95 backdrop-blur-sm border-b border-gray-800 px-4 py-3 sticky top-0 z-10 flex-shrink-0">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          {onClose && (
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1">
              <X size={18} strokeWidth={2} />
            </button>
          )}
          <div className="flex gap-1.5 flex-1">
            <button
              onClick={() => setTab('profile')}
              className={`flex-1 py-2 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1 ${
                tab === 'profile' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <User size={13} strokeWidth={2} />
              <span className="hidden sm:inline">プロフィール</span>
            </button>
            <button
              onClick={() => setTab('items')}
              className={`flex-1 py-2 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1 ${
                tab === 'items' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Package size={13} strokeWidth={2} />
              <span className="hidden sm:inline">アイテム</span>
            </button>
            <button
              onClick={() => setTab('badges')}
              className={`flex-1 py-2 rounded-xl font-bold text-xs transition-all relative flex items-center justify-center gap-1 ${
                tab === 'badges' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Award size={13} strokeWidth={2} />
              <span className="hidden sm:inline">実績</span>
              {newIds.length > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-red-500 rounded-full text-[9px] flex items-center justify-center font-black text-white px-0.5">
                  {newIds.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setTab('friends')}
              className={`flex-1 py-2 rounded-xl font-bold text-xs transition-all relative flex items-center justify-center gap-1 ${
                tab === 'friends' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Users size={13} strokeWidth={2} />
              <span className="hidden sm:inline">フレンド</span>
              {receivedPending.length > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-red-500 rounded-full text-[9px] flex items-center justify-center font-black text-white px-0.5">
                  {receivedPending.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto p-4 space-y-4 pb-24">

          {/* ────────── プロフィールタブ ────────── */}
          {tab === 'profile' && (
            <>
              {/* XPカード */}
              <div className="bg-gradient-to-br from-indigo-950 to-purple-950 rounded-3xl p-6 border border-indigo-800">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-5xl">{avatar}</div>
                  <div className="flex-1">
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
                    <div className="flex justify-between text-indigo-400 text-xs mt-1.5">
                      <span>{xpCurrent.toLocaleString()} XP</span>
                      <span>次のレベルまで {(xpRequired - xpCurrent).toLocaleString()} XP</span>
                    </div>
                  </div>
                )}
              </div>

              {/* ニックネーム入力 */}
              <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5 space-y-3">
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
                {usernameError && <p className="text-red-400 text-xs font-bold">{usernameError}</p>}
              </div>

              {/* アバター選択 */}
              <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
                <h3 className="text-white font-black mb-4">アバター</h3>
                <div className="grid grid-cols-6 gap-2">
                  {AVATARS.map(a => (
                    <button
                      key={a}
                      onClick={() => setAvatar(a)}
                      className={`aspect-square rounded-2xl text-2xl flex items-center justify-center transition-all ${
                        avatar === a
                          ? 'bg-indigo-600 scale-110 shadow-lg shadow-indigo-900/60'
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
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-60 text-white font-black py-4 rounded-2xl text-lg transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                {saving ? <><Loader2 size={18} className="animate-spin" /> 保存中...</> : saved ? <><Check size={18} /> 保存しました</> : <><Save size={18} /> 保存する</>}
              </button>

              <button
                onClick={signOut}
                className="w-full text-gray-600 hover:text-gray-400 text-sm py-2 transition-colors"
              >
                ログアウト
              </button>
            </>
          )}

          {/* ────────── アイテムタブ ────────── */}
          {tab === 'items' && (
            <>
              {/* コイン表示＆ガチャボタン */}
              <div className="bg-gradient-to-br from-yellow-950 to-amber-950 rounded-3xl p-5 border border-yellow-800 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-yellow-900/60 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🪙</span>
                </div>
                <div className="flex-1">
                  <div className="text-yellow-300 font-black text-xl">{gachaCoins} コイン</div>
                  <div className="text-yellow-600 text-xs mt-0.5">S=+3 / A=+2 / B=+1 / 500XP=+1</div>
                </div>
                <button
                  onClick={() => setShowGacha(true)}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black px-4 py-3 rounded-2xl text-sm transition-all hover:scale-105 active:scale-95"
                >
                  ガチャ
                </button>
              </div>

              {/* アイテム一覧 */}
              <div className="space-y-2">
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">所持アイテム</h3>
                {ITEMS.map(item => {
                  const count = inventory[item.id] ?? 0
                  const rarCfg = RARITY_CONFIG[item.rarity]
                  return (
                    <div
                      key={item.id}
                      className={`rounded-2xl border-2 p-4 transition-all ${
                        count > 0 ? `${item.bg} ${item.border}` : 'bg-gray-900 border-gray-800 opacity-40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="text-3xl w-12 h-12 flex items-center justify-center rounded-xl flex-shrink-0"
                          style={{ backgroundColor: item.color + '20', border: `1.5px solid ${item.color}50` }}
                        >
                          {item.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-black text-sm">{item.name}</span>
                            <span className={`text-[10px] font-bold ${rarCfg.textColor}`}>{rarCfg.label}</span>
                          </div>
                          <p className="text-gray-400 text-xs mt-0.5 leading-tight">{item.shortEffect}</p>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          <div className="text-white font-black text-xl">{count}</div>
                          <div className="text-gray-600 text-[10px]">所持</div>
                        </div>
                      </div>
                      {count > 0 && (
                        <div className="mt-2 text-xs text-gray-500 leading-relaxed">{item.description}</div>
                      )}
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {/* ────────── 実績タブ ────────── */}
          {tab === 'badges' && (() => {
            const RARITY_ACH = {
              common:    { label: 'コモン',     color: 'text-gray-300',   border: 'border-gray-700',   bg: 'bg-gray-800/60' },
              rare:      { label: 'レア',       color: 'text-blue-400',   border: 'border-blue-800',   bg: 'bg-blue-950/60' },
              epic:      { label: 'エピック',   color: 'text-purple-400', border: 'border-purple-800', bg: 'bg-purple-950/60' },
              legendary: { label: 'レジェンド', color: 'text-yellow-400', border: 'border-yellow-700', bg: 'bg-yellow-950/60' },
            } as const
            const total = ALL_ACHIEVEMENTS.length
            const unlocked = unlockedIds.length
            const groups = ['legendary', 'epic', 'rare', 'common'] as const
            return (
              <>
                {/* 新着通知 */}
                {newIds.length > 0 && (
                  <div className="bg-indigo-950 border border-indigo-600 rounded-2xl p-3 flex items-center gap-3 animate-pulse">
                    <span className="text-2xl">🎉</span>
                    <div>
                      <p className="text-indigo-300 font-bold text-sm">新しい実績を解除！</p>
                      <p className="text-indigo-400 text-xs">
                        {newIds.map(id => ALL_ACHIEVEMENTS.find(a => a.id === id)?.title).filter(Boolean).join(' / ')}
                      </p>
                    </div>
                    <button onClick={clearNew} className="ml-auto text-indigo-600 hover:text-indigo-400 text-lg">✕</button>
                  </div>
                )}
                {/* 進捗 */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-white flex items-center gap-1.5"><Award size={14} className="text-indigo-400" /> 実績 達成率</span>
                    <span className="text-sm font-black text-indigo-400">{unlocked} / {total}</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700"
                      style={{ width: `${(unlocked / total) * 100}%` }}
                    />
                  </div>
                </div>
                {/* 一覧 */}
                {groups.map(rarity => {
                  const items = ALL_ACHIEVEMENTS.filter(a => a.rarity === rarity)
                  const cfg = RARITY_ACH[rarity]
                  return (
                    <div key={rarity}>
                      <div className={`text-xs font-black uppercase tracking-widest mb-2 ${cfg.color}`}>{cfg.label}</div>
                      <div className="grid grid-cols-1 gap-2">
                        {items.map(ach => {
                          const isUnlocked = unlockedIds.includes(ach.id)
                          const isNew = newIds.includes(ach.id)
                          return (
                            <div
                              key={ach.id}
                              className={`rounded-2xl p-3.5 border flex items-center gap-3.5 transition-all ${
                                isUnlocked
                                  ? `${cfg.bg} ${cfg.border}${isNew ? ' ring-2 ring-indigo-500' : ''}`
                                  : 'bg-gray-900/40 border-gray-800 opacity-50'
                              }`}
                            >
                              <div className={`text-3xl w-10 text-center flex-shrink-0 ${!isUnlocked ? 'grayscale' : ''}`}>
                                {isUnlocked ? ach.icon : '🔒'}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className={`font-black text-sm ${isUnlocked ? 'text-white' : 'text-gray-600'}`}>
                                  {isUnlocked ? ach.title : '???'}
                                </div>
                                <div className={`text-xs mt-0.5 ${isUnlocked ? 'text-gray-400' : 'text-gray-700'}`}>
                                  {isUnlocked ? ach.description : 'まだ解除されていません'}
                                </div>
                              </div>
                              {isUnlocked && <div className={`text-xs font-bold flex-shrink-0 ${cfg.color}`}>✓</div>}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </>
            )
          })()}

          {/* ────────── フレンドタブ ────────── */}
          {tab === 'friends' && (
            <>
              {/* 受信中の申請（通知） */}
              {receivedPending.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <h3 className="text-white font-black text-sm">フレンド申請が届いています</h3>
                    <span className="bg-red-500 text-white text-xs font-black px-2 py-0.5 rounded-full">
                      {receivedPending.length}
                    </span>
                  </div>
                  {receivedPending.map(f => (
                    <div
                      key={f.id}
                      className="bg-indigo-950 border border-indigo-700 rounded-2xl p-4"
                      style={{ animation: 'slideDown 0.3s ease both' }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-3xl">{f.friendProfile?.avatar ?? '😊'}</div>
                        <div className="flex-1">
                          <div className="text-white font-black">{f.friendProfile?.username ?? '?'}</div>
                          <div className="text-indigo-300 text-xs">
                            Lv.{f.friendProfile?.level ?? 1} · {(f.friendProfile?.xp ?? 0).toLocaleString()} XP
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAccept(f.friendId)}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black py-2.5 rounded-xl text-sm transition-all active:scale-95"
                        >
                          ✓ 承認する
                        </button>
                        <button
                          onClick={() => handleDecline(f.friendId)}
                          className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 font-bold py-2.5 rounded-xl text-sm transition-all active:scale-95"
                        >
                          ✕ 断る
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* フレンド検索 */}
              <div className="bg-gray-900 rounded-2xl border border-gray-800 p-4 space-y-3">
                <h3 className="text-white font-black text-sm flex items-center gap-1.5"><Users size={14} className="text-gray-400" /> フレンドを検索して追加</h3>
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
                    disabled={searching || !searchQuery.trim()}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 text-white font-black px-4 rounded-xl transition-all active:scale-95"
                  >
                    {searching ? '…' : '検索'}
                  </button>
                </div>

                {friendMsg && (
                  <div className={`text-sm font-bold px-3 py-2 rounded-xl ${
                    friendMsg.startsWith('✅') ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-red-950 text-red-300 border border-red-800'
                  }`}>
                    {friendMsg}
                  </div>
                )}

                {searchResults.length > 0 && (
                  <div className="space-y-2">
                    {searchResults.map(r => {
                      const isSent = sentIds.has(r.id)
                      return (
                        <div key={r.id} className="flex items-center gap-3 bg-gray-800 rounded-xl p-3">
                          <div className="text-2xl">{r.avatar}</div>
                          <div className="flex-1">
                            <div className="text-white font-bold text-sm">{r.username}</div>
                            <div className="text-gray-400 text-xs">Lv.{r.level} · {r.xp.toLocaleString()} XP</div>
                          </div>
                          {isSent ? (
                            <span className="text-xs bg-gray-700 text-gray-400 font-bold px-3 py-1.5 rounded-lg">
                              申請済み ✓
                            </span>
                          ) : (
                            <button
                              onClick={() => handleAddFriend(r.id, r.username)}
                              className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-black px-3 py-1.5 rounded-lg transition-all active:scale-95"
                            >
                              + 申請
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
                {searchResults.length === 0 && searchQuery && !searching && (
                  <p className="text-gray-600 text-xs text-center py-2">見つかりませんでした</p>
                )}
              </div>

              {/* フレンド一覧 */}
              <div className="space-y-2">
                <h3 className="text-white font-black text-sm flex items-center gap-1.5">
                  <Users size={14} className="text-gray-400" /> フレンド <span className="text-indigo-400">{accepted.length}</span>人
                </h3>
                {accepted.length === 0 && receivedPending.length === 0 && sentPending.length === 0 && (
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gray-800 flex items-center justify-center mx-auto mb-3">
                      <Users size={32} strokeWidth={1.5} className="text-gray-600" />
                    </div>
                    <p className="text-gray-400 font-bold text-sm">まだフレンドがいません</p>
                    <p className="text-gray-600 text-xs mt-1">上の検索で友達を探そう！</p>
                  </div>
                )}
                {accepted.map(f => (
                  <div key={f.id} className="flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-2xl p-4">
                    <div className="text-3xl">{f.friendProfile?.avatar ?? '😊'}</div>
                    <div className="flex-1">
                      <div className="text-white font-black">{f.friendProfile?.username ?? '?'}</div>
                      <div className="text-gray-400 text-xs">Lv.{f.friendProfile?.level ?? 1} · {(f.friendProfile?.xp ?? 0).toLocaleString()} XP</div>
                    </div>
                    <button
                      onClick={() => handleRemove(f.friendId)}
                      className="text-xs text-gray-600 hover:text-red-400 transition-colors px-2 py-1"
                    >
                      削除
                    </button>
                  </div>
                ))}
              </div>

              {/* 申請履歴（送信済み） */}
              {sentPending.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-gray-500 font-bold text-xs uppercase tracking-wider">申請中（相手の承認待ち）</h3>
                  {sentPending.map(f => (
                    <div key={f.id} className="flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-2xl p-3 opacity-70">
                      <div className="text-2xl">{f.friendProfile?.avatar ?? '😊'}</div>
                      <div className="flex-1">
                        <div className="text-white font-bold text-sm">{f.friendProfile?.username ?? '?'}</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                          <span className="text-yellow-400 text-xs">承認待ち</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemove(f.friendId)}
                        className="text-xs text-gray-600 hover:text-red-400 transition-colors"
                      >
                        取消
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {showGacha && <GachaModal onClose={() => setShowGacha(false)} />}

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
