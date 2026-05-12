'use client'
import { useEffect, useState } from 'react'
import { fetchRankings, fetchLocalRankings, RankingEntry } from '@/lib/cloudSave'
import { useAuthStore } from '@/store/authStore'

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: '😊 易しい', normal: '😐 普通', hard: '😤 難しい', hell: '💀 地獄',
}
const DIFFICULTY_COLOR: Record<string, string> = {
  easy: 'text-emerald-400', normal: 'text-gray-300', hard: 'text-yellow-400', hell: 'text-red-400',
}
const INDUSTRY_EMOJI: Record<string, string> = {
  IT: '💻', 製造: '🏭', 飲食: '🍜', 金融: '💰', エンタメ: '🎮',
}
const GRADE_COLOR: Record<string, string> = {
  S: 'text-yellow-400 bg-yellow-950 border-yellow-700',
  A: 'text-emerald-400 bg-emerald-950 border-emerald-700',
  B: 'text-blue-400 bg-blue-950 border-blue-700',
  C: 'text-gray-300 bg-gray-900 border-gray-700',
  D: 'text-orange-400 bg-orange-950 border-orange-800',
  F: 'text-red-400 bg-red-950 border-red-800',
}
const RANK_MEDAL = ['🥇', '🥈', '🥉']
const DIFFICULTIES = ['', 'easy', 'normal', 'hard', 'hell'] as const
const INDUSTRIES   = ['', 'IT', '製造', '飲食', '金融', 'エンタメ'] as const

interface Props { onBack: () => void }

function EntryRow({
  entry, rank, isMe,
}: { entry: RankingEntry; rank: number; isMe: boolean }) {
  return (
    <div
      className={`border rounded-2xl p-4 flex items-center gap-3 transition-all ${
        isMe
          ? 'bg-indigo-950 border-indigo-600'
          : rank === 1 ? 'bg-gray-900 border-yellow-800'
          : rank === 2 ? 'bg-gray-900 border-gray-600'
          : rank === 3 ? 'bg-gray-900 border-orange-800'
          : 'bg-gray-900 border-gray-800'
      }`}
    >
      <div className="w-9 text-center flex-shrink-0">
        {rank <= 3
          ? <span className="text-xl">{RANK_MEDAL[rank - 1]}</span>
          : <span className="text-gray-500 text-sm font-bold">{rank}</span>
        }
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm">{INDUSTRY_EMOJI[entry.industry] ?? '🏢'}</span>
          <span className="font-bold text-sm truncate">{entry.company_name}</span>
          {isMe && <span className="text-xs text-indigo-400 font-bold flex-shrink-0">← YOU</span>}
        </div>
      </div>
      <div className={`text-xs font-black px-2 py-1 rounded-lg border flex-shrink-0 ${GRADE_COLOR[entry.grade] ?? 'text-gray-400 bg-gray-800 border-gray-700'}`}>
        {entry.grade}
      </div>
      <div className="text-right flex-shrink-0 min-w-[60px]">
        <div className={`font-black text-sm ${entry.total_return >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {entry.total_return >= 0 ? '+' : ''}{entry.total_return}%
        </div>
        <div className={`text-xs mt-0.5 ${DIFFICULTY_COLOR[entry.difficulty] ?? 'text-gray-500'}`}>
          {DIFFICULTY_LABEL[entry.difficulty] ?? entry.difficulty}
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
      <div className="flex gap-2 flex-wrap">
        {DIFFICULTIES.map(d => (
          <button key={d} onClick={() => setDifficulty(d)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              difficulty === d ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-gray-700 text-gray-400 hover:border-gray-500'
            }`}>
            {d === '' ? '全難易度' : DIFFICULTY_LABEL[d]}
          </button>
        ))}
      </div>
      <div className="flex gap-2 flex-wrap">
        {INDUSTRIES.map(ind => (
          <button key={ind} onClick={() => setIndustry(ind)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              industry === ind ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-gray-700 text-gray-400 hover:border-gray-500'
            }`}>
            {ind === '' ? '全業種' : `${INDUSTRY_EMOJI[ind]} ${ind}`}
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* ヘッダー */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={onBack}
            className="text-gray-400 hover:text-white transition-colors text-sm px-3 py-1.5 rounded-lg border border-gray-800 hover:border-gray-600">
            ← 戻る
          </button>
          <div>
            <h1 className="text-xl font-black">🏆 世界ランキング</h1>
            <p className="text-gray-500 text-xs mt-0.5">IPO比リターン上位</p>
          </div>
        </div>

        {/* タブ */}
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => setTab('global')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${
              tab === 'global' ? 'bg-indigo-600 text-white' : 'bg-gray-900 text-gray-400 border border-gray-800 hover:border-gray-600'
            }`}
          >
            🌍 グローバル Top100
          </button>
          <button
            onClick={() => setTab('local')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${
              tab === 'local' ? 'bg-indigo-600 text-white' : 'bg-gray-900 text-gray-400 border border-gray-800 hover:border-gray-600'
            }`}
          >
            👤 自分の周辺
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
            <div className="space-y-2">
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
              まだランキングデータがありません<br />
              <span className="text-gray-700">ゲームをクリアして登録しよう！</span>
            </div>
          ) : (
            <div className="space-y-2">
              {userRank > 0 && (
                <div className="text-center text-indigo-400 text-sm font-bold mb-3">
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
