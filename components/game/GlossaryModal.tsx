'use client'
import { useState } from 'react'

const GLOSSARY = [
  { term: 'IPO（新規株式公開）', emoji: '🚀', desc: '会社が初めて株式市場に上場すること。このゲームではIPO時の株価を基準にリターンを計算します。' },
  { term: '株価', emoji: '📈', desc: '会社の株1株あたりの値段。業績・イベント・市場の雰囲気などで毎ターン変動します。' },
  { term: '時価総額', emoji: '💰', desc: '株価 × 発行済み株式数。会社全体の値段のこと。大きいほど大企業です。' },
  { term: 'IPO比リターン', emoji: '📊', desc: '上場時の株価と比べて何%上がったか（または下がったか）を示す数値。ランキングはこれで決まります。' },
  { term: '研究開発（R&D）', emoji: '🔬', desc: '製品や技術を改善するための投資。長期的に収益力が上がり、特許取得などのイベントが起きやすくなります。' },
  { term: 'マーケティング', emoji: '📢', desc: '広告・宣伝への投資。売上に即効性があり、新規顧客を獲得しやすくなります。低いとブランド力が落ちてきます。' },
  { term: '採用', emoji: '👥', desc: '人材を増やすための投資。組織が安定し、成長を支える基盤になります。少なすぎるとストライキが起きることも。' },
  { term: '設備投資（CAPEX）', emoji: '🏗️', desc: '工場・機器などの設備への投資。生産能力が上がり、長期的な成長につながります。放置すると設備故障が起きやすくなります。' },
  { term: '配当', emoji: '💸', desc: '株主に利益を還元すること。株主の満足度が上がり株価が安定しますが、成長への再投資は減ります。' },
  { term: '市場センチメント', emoji: '🌡️', desc: '市場全体の雰囲気（強気・弱気）。好景気なら株価が上がりやすく、不景気なら下がりやすくなります。' },
  { term: '難易度', emoji: '⚙️', desc: '「易しい」ほどイベントの悪影響が少なく株価が安定。「地獄」は激しい上下で高リターンも大暴落もあります。' },
  { term: 'ターン', emoji: '🔄', desc: '1ターン＝1四半期（3ヶ月）。全20ターン（5年間）の経営シミュレーションです。' },
]

interface Props {
  onClose: () => void
}

export default function GlossaryModal({ onClose }: Props) {
  const [openTerm, setOpenTerm] = useState<string | null>(null)

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-gray-950 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800 flex-shrink-0">
          <h2 className="text-white font-black text-base">📖 ゲーム用語集</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white text-2xl leading-none transition-colors"
          >
            ×
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-3 space-y-1.5">
          {GLOSSARY.map(({ term, emoji, desc }) => (
            <div key={term} className="rounded-xl border border-gray-800 overflow-hidden bg-gray-900">
              <button
                onClick={() => setOpenTerm(openTerm === term ? null : term)}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-200 hover:text-white transition-colors"
              >
                <span className="text-lg">{emoji}</span>
                <span className="flex-1 text-left">{term}</span>
                <span className="text-gray-600 text-xs">{openTerm === term ? '▲' : '▼'}</span>
              </button>
              {openTerm === term && (
                <div className="px-4 pb-3 pt-1 text-gray-400 text-xs leading-relaxed border-t border-gray-800">
                  {desc}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
