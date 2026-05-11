import { NextRequest, NextResponse } from 'next/server'
import { generatePostContent, postToX, postToInstagram, postToDiscord, postToBluesky } from '@/lib/socialPost'

export const runtime = 'nodejs'
export const maxDuration = 30

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const text = await generatePostContent()

  const [xResult, igResult, discordResult, bskyResult] = await Promise.allSettled([
    postToX(text),
    postToInstagram(text),
    postToDiscord(text),
    postToBluesky(text),
  ])

  const result = {
    text,
    x: xResult.status === 'fulfilled' ? xResult.value : { success: false, error: 'failed' },
    instagram: igResult.status === 'fulfilled' ? igResult.value : { success: false, error: 'failed' },
    discord: discordResult.status === 'fulfilled' ? discordResult.value : { success: false, error: 'failed' },
    bluesky: bskyResult.status === 'fulfilled' ? bskyResult.value : { success: false, error: 'failed' },
    timestamp: new Date().toISOString(),
  }

  console.log('[daily-post]', JSON.stringify(result))
  return NextResponse.json(result)
}
