'use client'
import { useEffect, useState } from 'react'
import { fetchRankings, fetchLocalRankings, RankingEntry } from '@/lib/cloudSave'
import { useAuthStore } from '@/store/authStore'
import { Globe, User, TrendingUp, TrendingDown } from 'lucide-react'

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: '易しい', normal: '普通', hard: '難しい', hell: '地獄',
}
const DIFFICULTY_COLOR: Record<string, string> = {
  easy: 'text-emerald-400', normal: 'text-gray-400', hard: 'text-yellow-400', hell: 'text-red-400',
}
const GRADE_STYLE: Record<string, string> = {
  S: 'text-yellow-400',
  A: 'text-emerald-400',
  B: 'text-blue-400',
  C: 'text-gray-300',
  D: 'text-orange-400',
  E: 'text-gray-500',
  F: 'text-red-400',
}
const DIFFICULTIES = ['', 'easy', 'normal', 'hard', 'hell'] as const
const INDUSTRIES   = ['', 'IT', '製造', '飲食', '金融', 'エンタメ', '医療', '不動産', '教育', '物流', '小売'] as const

interface Props { onBack: () => void }

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <span className="text-yellow-400 font-black text-sm w-7 text-center">1st</span>
  if (rank === 2) return <span className="text-gray-300 font-black text-sm w-7 text-center">2nd</span>
  if (rank === 3) return <span className="text-orange-400 font-black text-sm w-7 text-center">3rd</span>
  return <span className="text-gray-600 font-medium text-sm w-7 text-center">{rank}</span>
}

function EntryRow({ entry, rank, isMe }: { entry: RankingEntry; rank: number; isMe: boolean }) {
  const playerName = entry.profile_username || entry.display_name || '匿名'
  const avatar = entry.profile_avatar || '?'
  const isUp = entry.total_return >= 0
  return (
    <div className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all ${
      isMe ? 'bg-indigo-500/10 ring-1 ring-indigo-500/40' : 'bg-white/[0.03] hover:bg-white/[0.06]'
    }`}>
      <RankBadge rank={rank} />
      <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-base flex-shrink-0">
        {avatar}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-sm text-white truncate">{entry.company_name}</span>
          {isMe && <span className="text-[10px] text-indigo-400 font-bold bg-indigo-500/15 px-1.5 py-0.5 rounded-full flex-shrink-0">YOU</span>}
        </div>
        <div className="text-gray-500 text-xs mt-0.5 truncate">{playerName} · {entry.industry}</div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className={`font-bold text-sm flex items-center gap-1 justify-end ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
          {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {isUp ? '+' : ''}{entry.total_return}%
        </div>
        <div className="flex items-center gap-1.5 justify-end mt-0.5">
          <span className={`text-xs font-black ${GRADE_STYLE[entry.grade] ?? 'text-gray-400'}`}>{entry.grade}</span>
          <span className={`text-[10px] ${DIFFICULTY_COLOR[entry.difficulty] ?? 'text-gray-500'}`}>{DIFFICULTY_LABEL[entry.difficulty] ?? entry.difficulty}</span>
        </div>
      </div>
    </div>
  )
}

export default function RankingScreen({ onBack }: Props) {
  const { user } = useAuthStore()
  const [tab, setTab] = useState<'global' | 'local'>('global')
  const [entries, setEntries] = useState<RankingEntry[]>([])
  const [localEntries, setLocalEntries] = useState<RankingEntry[]>([])
  const [userRank, setUserRank] = useState(-1)
  const [loading, setLoading] = useState(true)
  const [difficulty, setDifficulty] = useState('')
  const [industry, setIndustry] = useState('')

  useEffect(() => {
    setLoading(true)
    const opts = { difficulty: difficulty || undefined, industry: industry || undefined }
    if (tab === 'global') {
      fetchRankings(opts).then(data => { setEntries(data); setLoading(false) })
    } else {
      if (!user) { setLoading(false); return }
      fetchLocalRankings(user.id, opts).then(({ entries: e, userRank: r }) => {
        setLocalEntries(e); setUserRank(r); setLoading(false)
      })
    }
  }, [tab, difficulty, industry, user])

  const filters = (
    <div className="space-y-2 mb-5">
      <div className="flex gap-1.5 flex-wrap">
        {DIFFICULTIES.map(d => (
          <button key={d} onClick={() => setDifficulty(d)}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
              difficulty === d
                ? 'bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-500/50'
                : 'text-gray-500 hover:text-gray-300 bg-white/[0.04]'
            }`}>
            {d === '' ? '全難易度' : DIFFICULTY_LABEL[d]}
          </button>
        ))}
      </div>
      <div className="flex gap-1.5 flex-wrap">
        {INDUSTRIES.map(ind => (
          <button key={ind} onClick={() => setIndustry(ind)}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
              industry === ind
                ? 'bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-500/50'
                : 'text-gray-500 hover:text-gray-300 bg-white/[0.04]'
            }`}>
            {ind === '' ? '全業種' : ind}
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* ヘッダー */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-white">ランキング</h1>
          <p className="text-gray-500 text-xs mt-0.5">IPO比リターン上位</p>
        </div>

        {/* タブ */}
        <div className="flex gap-1 mb-5 bg-white/[0.04] rounded-xl p-1">
          <button
            onClick={() => setTab('global')}
            className={`flex-1 py-2 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-1.5 ${
              tab === 'global' ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <Globe size={14} />
            グローバル
          </button>
          <button
            onClick={() => setTab('local')}
            className={`flex-1 py-2 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-1.5 ${
              tab === 'local' ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <User size={14} />
            自分の周辺
          </button>
        </div>

        {filters}

        {loading ? (
          <div className="text-center text-gray-600 py-16 text-sm">読み込み中...</div>
        ) : tab === 'global' ? (
          entries.length === 0 ? (
            <div className="text-center text-gray-600 py-16 text-sm">
              まだデータがありません<br />
              <span className="text-gray-700">ゲームをプレイして1位を狙おう！</span>
            </div>
          ) : (
            <div className="space-y-1">
              {entries.map((entry, i) => (
                <EntryRow
                  key={entry.id}
                  entry={entry}
                  rank={i + 1}
                  isMe={!!user && entry.display_name === (user.user_metadata?.full_name ?? user.email)}
                />
              ))}
            </div>
          )
        ) : (
          !user ? (
            <div className="text-center text-gray-600 py-16 text-sm">
              ログインすると自分の順位が確認できます
            </div>
          ) : localEntries.length === 0 ? (
            <div className="text-center text-gray-600 py-16 text-sm">
              まだランキングデータがありません
            </div>
          ) : (
            <div className="space-y-1">
              {userRank > 0 && (
                <div className="text-center text-indigo-400 text-xs font-medium mb-3">
                  あなたの順位：{userRank}位
                </div>
              )}
              {localEntries.map((entry, i) => {
                const rank = Math.max(1, userRank - 5) + i
                const isMe = !!user && entry.display_name === (user.user_metadata?.full_name ?? user.email)
                return <EntryRow key={entry.id} entry={entry} rank={rank} isMe={isMe} />
              })}
            </div>
          )
        )}
      </div>
    </div>
  )
}
