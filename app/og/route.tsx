import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1040 50%, #0f0f1a 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 背景グリッド */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(99,102,241,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.08) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          display: 'flex',
        }} />

        {/* SVGチャート */}
        <svg
          style={{ position: 'absolute', bottom: 80, left: 0, right: 0, opacity: 0.25 }}
          viewBox="0 0 1200 300"
          preserveAspectRatio="none"
          width="1200"
          height="300"
        >
          <path
            d="M0,280 L60,260 L120,240 L180,220 L240,230 L300,200 L360,175 L420,185 L480,150 L540,155 L600,120 L660,130 L720,95 L780,80 L840,100 L900,60 L960,70 L1020,40 L1080,25 L1140,15 L1200,10"
            fill="none"
            stroke="#6366f1"
            strokeWidth="4"
          />
          <path
            d="M0,280 L60,260 L120,240 L180,220 L240,230 L300,200 L360,175 L420,185 L480,150 L540,155 L600,120 L660,130 L720,95 L780,80 L840,100 L900,60 L960,70 L1020,40 L1080,25 L1140,15 L1200,10 L1200,300 L0,300 Z"
            fill="url(#grad)"
          />
          <defs>
            <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* メインコンテンツ */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', zIndex: 10 }}>
          <div style={{ fontSize: '72px' }}>📈</div>
          <h1 style={{
            fontSize: '64px',
            fontWeight: 900,
            color: 'white',
            margin: 0,
            textAlign: 'center',
            lineHeight: 1.2,
          }}>
            株式会社
            <span style={{ color: '#818cf8' }}>シミュレーター</span>
          </h1>
          <p style={{
            fontSize: '28px',
            color: '#9ca3af',
            margin: 0,
            textAlign: 'center',
          }}>
            自分だけの仮想会社を上場させよう
          </p>
          <div style={{
            display: 'flex',
            gap: '16px',
            marginTop: '12px',
          }}>
            {['無料', '登録不要', '即プレイ'].map(tag => (
              <div key={tag} style={{
                background: 'rgba(99,102,241,0.2)',
                border: '1px solid rgba(99,102,241,0.5)',
                borderRadius: '100px',
                padding: '8px 20px',
                color: '#a5b4fc',
                fontSize: '22px',
              }}>
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
