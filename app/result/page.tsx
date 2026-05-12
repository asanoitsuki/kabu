import type { Metadata } from 'next'
import Link from 'next/link'

type Props = {
  searchParams: Promise<{ grade?: string; company?: string; ret?: string; industry?: string; difficulty?: string }>
}

const GRADE_COLOR: Record<string, string> = {
  S: 'text-yellow-400', A: 'text-emerald-400', B: 'text-blue-400',
  C: 'text-gray-300', D: 'text-orange-400', F: 'text-red-400',
}
const DIFFICULTY_LABEL: Record<string, string> = {
  easy: '😊 易しい', normal: '😐 普通', hard: '😤 難しい', hell: '💀 地獄',
}
const INDUSTRY_EMOJI: Record<string, string> = {
  IT: '💻', 製造: '🏭', 飲食: '🍜', 金融: '💰', エンタメ: '🎮',
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const p = await searchParams
  const grade   = p.grade   ?? 'C'
  const company = p.company ?? '株式会社'
  const ret     = p.ret     ?? '0'
  const retStr  = `${parseFloat(ret) >= 0 ? '+' : ''}${parseFloat(ret).toFixed(1)}%`

  const base = 'https://kabu-three.vercel.app'
  const qs = new URLSearchParams({ grade, company, ret: ret ?? '0', industry: p.industry ?? 'IT', difficulty: p.difficulty ?? 'normal' })
  const imageUrl = `${base}/api/og/result?${qs}`

  return {
    title: `${company} − ${grade}ランク達成！株価${retStr}`,
    description: `株式会社シミュレーターで${company}を経営して${grade}評価！IPO比${retStr}を記録。`,
    openGraph: {
      title: `${company} − ${grade}ランク達成！`,
      description: `IPO比リターン ${retStr} #株式会社シミュレーター`,
      images: [{ url: imageUrl, width: 1200, height: 630 }],
      url: base,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${company} − ${grade}ランク達成！`,
      description: `IPO比リターン ${retStr} #株式会社シミュレーター`,
      images: [imageUrl],
    },
  }
}

export default async function ResultPage({ searchParams }: Props) {
  const p       = await searchParams
  const grade   = p.grade      ?? 'C'
  const company = p.company    ?? '株式会社'
  const ret     = parseFloat(p.ret ?? '0')
  const industry   = p.industry   ?? 'IT'
  const difficulty = p.difficulty ?? 'normal'
  const isPlus  = ret >= 0
  const retStr  = `${isPlus ? '+' : ''}${ret.toFixed(1)}%`

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-sm w-full space-y-5 text-center">
        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">プレイ結果</p>

        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 space-y-3">
          <div className="text-sm text-gray-400">
            {INDUSTRY_EMOJI[industry] ?? '🏢'} {industry}業 · {DIFFICULTY_LABEL[difficulty] ?? difficulty}
          </div>
          <h1 className="text-2xl font-black">{company}</h1>
          <div className={`text-8xl font-black leading-none ${GRADE_COLOR[grade] ?? 'text-gray-400'}`}
               style={{ textShadow: '0 0 40px currentColor' }}>
            {grade}
          </div>
          <div className={`text-4xl font-black ${isPlus ? 'text-emerald-400' : 'text-red-400'}`}>
            {retStr}
          </div>
          <p className="text-gray-500 text-sm">IPO比リターン</p>
        </div>

        <Link
          href="/"
          className="block w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black py-4 rounded-2xl text-lg"
        >
          🚀 自分も挑戦する
        </Link>
        <p className="text-gray-700 text-xs">無料 · 登録不要ですぐプレイ</p>
      </div>
    </div>
  )
}
