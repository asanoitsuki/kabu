'use client'
import { useEffect, useState } from 'react'

interface NewsItem {
  title: string
  link: string
  pubDate: string
  source: string
}

function timeAgo(dateStr: string): string {
  try {
    const diff = Date.now() - new Date(dateStr).getTime()
    const h = Math.floor(diff / 3600000)
    if (h < 1) return '1時間以内'
    if (h < 24) return `${h}時間前`
    const d = Math.floor(h / 24)
    if (d < 7) return `${d}日前`
    return new Date(dateStr).toLocaleDateString('ja-JP')
  } catch {
    return ''
  }
}

export default function NewsScreen() {
  const [items, setItems] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('/api/news')
      .then(r => r.json())
      .then(d => {
        setItems(d.items ?? [])
        setError((d.items ?? []).length === 0)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="mb-5">
          <h1 className="text-xl font-black">📰 マーケットニュース</h1>
          <p className="text-gray-500 text-xs mt-0.5">日経平均・株価・経済の最新情報</p>
        </div>

        {loading ? (
          <div className="text-center text-gray-600 py-16 text-sm">読み込み中...</div>
        ) : error ? (
          <div className="text-center text-gray-600 py-16 text-sm">
            ニュースを取得できませんでした<br />
            <span className="text-gray-700">しばらくしてから再試行してください</span>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item, i) => (
              <a
                key={i}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-gray-900 border border-gray-800 rounded-2xl p-4 hover:border-indigo-700 transition-colors active:scale-[0.99]"
              >
                <p className="text-white text-sm font-bold leading-snug mb-2">{item.title}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  {item.source && (
                    <span className="bg-gray-800 px-2 py-0.5 rounded-full text-gray-400">
                      {item.source}
                    </span>
                  )}
                  {item.pubDate && <span>{timeAgo(item.pubDate)}</span>}
                  <span className="ml-auto text-gray-700">→ 記事を読む</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
