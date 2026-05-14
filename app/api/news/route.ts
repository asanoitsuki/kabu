import { NextResponse } from 'next/server'

interface NewsItem {
  title: string
  link: string
  pubDate: string
  source: string
}

function parseItems(xml: string): NewsItem[] {
  const items: NewsItem[] = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  let match
  while ((match = itemRegex.exec(xml)) !== null) {
    const c = match[1]
    const text = (tag: string) => {
      const m = c.match(new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`, 'i'))
      return m?.[1]?.trim() ?? ''
    }
    const title = text('title').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    const link = c.match(/<link>([\s\S]*?)<\/link>/i)?.[1]?.trim() ?? ''
    const pubDate = text('pubDate')
    const source = text('source')
    if (title && link) items.push({ title, link, pubDate, source })
  }
  return items.slice(0, 20)
}

export async function GET() {
  try {
    const url = 'https://news.google.com/rss/search?q=%E6%97%A5%E7%B5%8C%E5%B9%B3%E5%9D%87+%E6%A0%AA%E4%BE%A1+%E7%B5%8C%E6%B8%88&hl=ja&gl=JP&ceid=JP:ja'
    const res = await fetch(url, {
      next: { revalidate: 300 },
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NewsBot/1.0)' },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const xml = await res.text()
    const items = parseItems(xml)
    return NextResponse.json({ items })
  } catch (e) {
    return NextResponse.json({ items: [], error: String(e) })
  }
}
