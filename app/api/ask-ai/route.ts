import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
  }

  const { company, industry, difficulty, grade, totalReturn, events, turns } = await req.json()

  const difficultyLabel: Record<string, string> = {
    easy: '易しい', normal: '普通', hard: '難しい', hell: '地獄',
  }

  const prompt = `あなたは株式会社シミュレーターというゲームの経営アドバイザーです。
プレイヤーが経営した会社の結果を分析して、わかりやすく日本語で教えてください。

【会社情報】
- 会社名: ${company}
- 業種: ${industry}
- 難易度: ${difficultyLabel[difficulty] ?? difficulty}
- 最終評価: ${grade}ランク
- IPO比リターン: ${Number(totalReturn) >= 0 ? '+' : ''}${totalReturn}%
- 経営期間: ${turns}ターン（${Math.ceil(turns / 4)}年）

【発生したイベント】
${events.length > 0 ? events.map((e: string) => `・${e}`).join('\n') : '特になし'}

以下の形式で分析してください：

**総評**
（2〜3文で全体的な評価）

**うまくいったこと**
（良かった点を箇条書きで2〜3つ）

**失敗の原因**（あれば）
（悪かった点・改善できた点を箇条書きで2〜3つ）

**次回へのアドバイス**
（具体的なアドバイスを1〜2文で）

簡潔に、ゲーム初心者でもわかりやすい言葉で書いてください。`

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 800 },
        }),
      }
    )

    const data = await res.json()
    if (!res.ok) {
      return NextResponse.json({ error: data?.error?.message ?? 'API error' }, { status: 500 })
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
    return NextResponse.json({ analysis: text })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
