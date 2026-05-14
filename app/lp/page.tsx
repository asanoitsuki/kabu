import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '株式会社シミュレーター | 自分だけの仮想会社を上場させよう',
  description: '社名・業種を決めてIPO上場。20ターンの経営判断で株価を最大化するブラウザゲーム。無料・登録不要。',
}

const FEATURES = [
  {
    emoji: '🏢',
    title: '自由な会社設立',
    desc: '社名・業種・コーポレートカラーを自分で決めてIPO上場。IT、製造、飲食、金融、エンタメから選べる。',
  },
  {
    emoji: '💼',
    title: '戦略的な経営判断',
    desc: '毎ターン「研究開発・マーケティング・採用・設備投資・配当」に予算を配分。どこに投資するかで業績が変わる。',
  },
  {
    emoji: '📊',
    title: 'リアルな株価チャート',
    desc: '業績・市場環境・ランダムイベントが絡み合い株価が変動。IPO比で何倍にできるかを競え。',
  },
  {
    emoji: '🎲',
    title: 'ランダムイベント',
    desc: '景気好況・競合参入・スキャンダル・技術革新など8種のイベントが経営を揺さぶる。毎回違う展開。',
  },
  {
    emoji: '🏆',
    title: 'S〜Fランク評価',
    desc: '20ターン後の最終株価上昇率でS・A・B・C・D・Fを判定。S評価「伝説の経営者」を目指せ。',
  },
  {
    emoji: '💾',
    title: '自動セーブ',
    desc: 'ブラウザを閉じても進行状況を自動保存。続きからプレイできる。登録不要・完全無料。',
  },
]

const STEPS = [
  { num: '01', title: '会社を設立', desc: '社名と業種を決めてIPO。初期株価1,000円からスタート。' },
  { num: '02', title: '予算を配分', desc: '毎ターン利用可能資金の50%を5つの経営項目に振り分ける。' },
  { num: '03', title: '決算を確認', desc: 'ターン終了後に売上・利益・株価変動・イベントをレポートで確認。' },
  { num: '04', title: '20ターンで勝負', desc: '5年間（20四半期）の経営結果で最終評価。株価を最大化せよ。' },
]

const GRADES = [
  { grade: 'S', label: '伝説の経営者', color: '#f59e0b', req: '株価4倍以上' },
  { grade: 'A', label: '優秀な経営者', color: '#10b981', req: '株価2.5倍以上' },
  { grade: 'B', label: '堅実な経営者', color: '#6366f1', req: '株価1.5倍以上' },
  { grade: 'C', label: '普通',          color: '#9ca3af', req: '現状維持' },
]

export default function LPPage() {
  return (
    <div className="bg-gray-950 text-white min-h-screen">

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-gray-950 to-gray-950" />
        <div className="relative max-w-4xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-950 border border-indigo-800 rounded-full px-4 py-1.5 text-sm text-indigo-300 mb-8">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse inline-block" />
            無料・登録不要・即プレイ
          </div>

          <h1 className="text-5xl sm:text-6xl font-black leading-tight mb-6">
            あなただけの<br />
            <span className="text-indigo-400">仮想株式会社</span>を<br />
            上場させよう
          </h1>

          <p className="text-gray-400 text-lg sm:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
            社名を決めてIPO。20ターンの経営判断で株価を最大化するブラウザ経営シミュレーション。
          </p>

          <Link
            href="/"
            className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-10 rounded-2xl text-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-900/50"
          >
            今すぐプレイ →
          </Link>

          <p className="text-gray-600 text-sm mt-4">アカウント不要 · ブラウザだけで動く · 完全無料</p>

          {/* モック株価チャート */}
          <div className="mt-16 bg-gray-900 rounded-2xl p-6 text-left max-w-lg mx-auto border border-gray-800">
            <div className="flex items-end justify-between mb-3">
              <div>
                <div className="text-gray-500 text-xs">テックスター株式会社 · IT業</div>
                <div className="text-3xl font-black text-white">¥4,280</div>
                <div className="text-emerald-400 text-sm font-semibold">▲ ¥3,280 (+328%) IPO比</div>
              </div>
              <div className="text-xs text-gray-600 text-right">
                <div>高値 ¥4,890</div><div>安値 ¥890</div>
              </div>
            </div>
            {/* SVGチャート */}
            <svg viewBox="0 0 400 100" className="w-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="heroGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3"/>
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0"/>
                </linearGradient>
              </defs>
              <path d="M0,90 L20,85 L40,80 L60,72 L80,75 L100,65 L120,55 L140,60 L160,45 L180,50 L200,38 L220,42 L240,30 L260,25 L280,32 L300,18 L320,22 L340,12 L360,8 L380,5 L400,3" fill="none" stroke="#6366f1" strokeWidth="2.5"/>
              <path d="M0,90 L20,85 L40,80 L60,72 L80,75 L100,65 L120,55 L140,60 L160,45 L180,50 L200,38 L220,42 L240,30 L260,25 L280,32 L300,18 L320,22 L340,12 L360,8 L380,5 L400,3 L400,100 L0,100 Z" fill="url(#heroGrad)"/>
            </svg>
          </div>
        </div>
      </section>

      {/* 特徴 */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-black text-center mb-3">ゲームの特徴</h2>
        <p className="text-gray-500 text-center mb-12">シンプルなのに奥が深い、経営シミュレーション</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(({ emoji, title, desc }) => (
            <div key={title} className="bg-gray-900 rounded-2xl p-5 border border-gray-800 hover:border-indigo-800 transition-colors">
              <div className="text-3xl mb-3">{emoji}</div>
              <h3 className="text-white font-bold mb-2">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 遊び方 */}
      <section className="bg-gray-900/50 py-20">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-black text-center mb-3">遊び方</h2>
          <p className="text-gray-500 text-center mb-12">4ステップで始められる</p>
          <div className="space-y-4">
            {STEPS.map(({ num, title, desc }) => (
              <div key={num} className="flex gap-5 items-start">
                <div className="text-3xl font-black text-indigo-800 leading-none w-10 shrink-0">{num}</div>
                <div className="bg-gray-900 rounded-xl p-4 flex-1 border border-gray-800">
                  <div className="text-white font-bold mb-1">{title}</div>
                  <p className="text-gray-400 text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ランク */}
      <section className="max-w-3xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-black text-center mb-3">あなたは何ランク？</h2>
        <p className="text-gray-500 text-center mb-12">最終株価の上昇率で評価される</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {GRADES.map(({ grade, label, color, req }) => (
            <div key={grade} className="bg-gray-900 rounded-2xl p-5 text-center border border-gray-800">
              <div className="text-5xl font-black mb-2" style={{ color }}>{grade}</div>
              <div className="text-white font-semibold text-sm mb-1">{label}</div>
              <div className="text-gray-500 text-xs">{req}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-xl mx-auto text-center bg-gradient-to-b from-indigo-950 to-gray-950 rounded-3xl p-12 border border-indigo-900">
          <div className="text-5xl mb-4">📈</div>
          <h2 className="text-3xl font-black mb-4">さあ、経営を始めよう</h2>
          <p className="text-gray-400 mb-8">登録不要。今すぐブラウザで無料プレイ。</p>
          <Link
            href="/"
            className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-10 rounded-2xl text-xl transition-all hover:scale-105 active:scale-95"
          >
            無料でプレイする →
          </Link>
        </div>
      </section>

      {/* フッター */}
      <footer className="border-t border-gray-900 py-8 text-center text-gray-600 text-sm">
        株式会社シミュレーター · ブラウザゲーム · 無料
      </footer>
    </div>
  )
}
