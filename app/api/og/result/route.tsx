import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

const GRADE_COLOR: Record<string, string> = {
  S: '#fbbf24', A: '#34d399', B: '#60a5fa', C: '#9ca3af', D: '#fb923c', F: '#f87171',
}
const GRADE_BG: Record<string, string> = {
  S: '#451a03', A: '#022c22', B: '#172554', C: '#111827', D: '#431407', F: '#450a0a',
}
const GRADE_MSG: Record<string, string> = {
  S: '神の采配', A: '優秀な経営者', B: '堅実な経営', C: '現状維持', D: '業績悪化', F: '経営破綻寸前',
}
const INDUSTRY_EMOJI: Record<string, string> = {
  IT: '💻', 製造: '🏭', 飲食: '🍜', 金融: '💰', エンタメ: '🎮',
}
const DIFFICULTY_LABEL: Record<string, string> = {
  easy: '😊 易しい', normal: '😐 普通', hard: '😤 難しい', hell: '💀 地獄',
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const grade      = searchParams.get('grade')      ?? 'C'
  const company    = searchParams.get('company')    ?? '株式会社'
  const ret        = parseFloat(searchParams.get('ret') ?? '0')
  const industry   = searchParams.get('industry')   ?? 'IT'
  const difficulty = searchParams.get('difficulty') ?? 'normal'

  const gradeColor = GRADE_COLOR[grade] ?? '#9ca3af'
  const gradeBg    = GRADE_BG[grade]    ?? '#111827'
  const isPlus     = ret >= 0
  const retStr     = `${isPlus ? '+' : ''}${ret.toFixed(1)}%`
  const retColor   = isPlus ? '#34d399' : '#f87171'

  return new ImageResponse(
    (
      <div style={{
        width: '1200px', height: '630px',
        background: 'linear-gradient(135deg, #030712 0%, #0f0f1a 50%, #030712 100%)',
        display: 'flex', fontFamily: 'sans-serif', position: 'relative', overflow: 'hidden',
      }}>
        {/* グリッド背景 */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px)',
          backgroundSize: '60px 60px', display: 'flex',
        }} />

        {/* グロー */}
        <div style={{
          position: 'absolute', top: '-100px', left: '-100px',
          width: '500px', height: '500px',
          background: `radial-gradient(circle, ${gradeColor}18 0%, transparent 70%)`,
          display: 'flex',
        }} />

        {/* 左: グレード */}
        <div style={{
          width: '420px', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: `${gradeBg}cc`,
          borderRight: `2px solid ${gradeColor}40`,
        }}>
          <div style={{ fontSize: '200px', fontWeight: 900, color: gradeColor, lineHeight: 1,
            textShadow: `0 0 80px ${gradeColor}80`, }}>
            {grade}
          </div>
          <div style={{ fontSize: '24px', color: gradeColor, fontWeight: 700, marginTop: '8px',
            background: `${gradeColor}20`, padding: '6px 20px', borderRadius: '100px',
            border: `1px solid ${gradeColor}40`, }}>
            {GRADE_MSG[grade]}
          </div>
        </div>

        {/* 右: 詳細 */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          justifyContent: 'center', padding: '60px 64px', gap: '24px',
        }}>
          {/* 会社名 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '20px', color: '#6b7280', fontWeight: 700, letterSpacing: '2px' }}>
              {INDUSTRY_EMOJI[industry] ?? '🏢'} {industry}業  ·  {DIFFICULTY_LABEL[difficulty] ?? difficulty}
            </div>
            <div style={{ fontSize: '52px', fontWeight: 900, color: 'white', lineHeight: 1.1 }}>
              {company}
            </div>
          </div>

          {/* リターン */}
          <div style={{
            display: 'flex', flexDirection: 'column', gap: '4px',
            background: '#ffffff08', borderRadius: '20px', padding: '28px 32px',
            border: '1px solid #ffffff10',
          }}>
            <div style={{ fontSize: '20px', color: '#6b7280', fontWeight: 700 }}>IPO比リターン</div>
            <div style={{ fontSize: '80px', fontWeight: 900, color: retColor, lineHeight: 1,
              textShadow: `0 0 40px ${retColor}60`, }}>
              {retStr}
            </div>
          </div>

          {/* フッター */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '22px', color: '#4b5563', fontWeight: 700 }}>
              #株式会社シミュレーター
            </div>
            <div style={{
              fontSize: '18px', color: '#6366f1', fontWeight: 700,
              background: '#6366f120', padding: '8px 20px', borderRadius: '100px',
              border: '1px solid #6366f140',
            }}>
              kabu-three.vercel.app
            </div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
