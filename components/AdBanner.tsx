'use client'
import { useEffect } from 'react'

interface Props {
  slot: string
  format?: 'auto' | 'rectangle' | 'horizontal'
  className?: string
}

export default function AdBanner({ slot, format = 'auto', className = '' }: Props) {
  useEffect(() => {
    try {
      const adsbygoogle = (window as any).adsbygoogle
      if (adsbygoogle) {
        adsbygoogle.push({})
      }
    } catch {}
  }, [])

  return (
    <div className={`overflow-hidden ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-9474313759444287"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
