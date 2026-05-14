import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'プライバシーポリシー | マイビズ',
  description: 'マイビズのプライバシーポリシーです。',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm mb-8 block">← トップに戻る</Link>

        <h1 className="text-2xl font-black mb-8">プライバシーポリシー</h1>

        <div className="space-y-8 text-gray-300 text-sm leading-relaxed">

          <section>
            <h2 className="text-white font-bold text-base mb-3">基本方針</h2>
            <p>マイビズ（以下「本サービス」）は、ユーザーのプライバシーを尊重し、個人情報の保護に努めます。本ポリシーは、本サービスにおける個人情報の取り扱いについて説明します。</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">収集する情報</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>メールアドレス（アカウント登録時）</li>
              <li>ゲームプレイデータ（スコア、進行状況等）</li>
              <li>アクセスログ（IPアドレス、ブラウザ情報等）</li>
              <li>Cookie・ローカルストレージのデータ</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">情報の利用目的</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>本サービスの提供・改善</li>
              <li>ゲームデータの保存・復元</li>
              <li>サービスに関するお知らせ</li>
              <li>利用状況の分析</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">第三者への提供</h2>
            <p>本サービスは、法令に基づく場合を除き、ユーザーの個人情報を第三者に提供しません。</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">広告について</h2>
            <p>本サービスはGoogle AdSenseを利用した広告を掲載しています。Google AdSenseはCookieを使用してユーザーに関連性の高い広告を表示します。Googleによる広告Cookieの使用を無効にする場合は、<a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">広告設定ページ</a>をご覧ください。</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">アクセス解析</h2>
            <p>本サービスはアクセス解析ツールを使用する場合があります。これらのツールはCookieを使用してデータを収集しますが、個人を特定する情報は含まれません。</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">Cookieの管理</h2>
            <p>ブラウザの設定からCookieを無効にすることができますが、一部のサービス機能が利用できなくなる場合があります。</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">お問い合わせ</h2>
            <p>プライバシーポリシーに関するお問い合わせは、本サービスのSNSアカウントまでご連絡ください。</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">改定</h2>
            <p>本ポリシーは必要に応じて改定することがあります。重要な変更がある場合はサービス上でお知らせします。</p>
            <p className="mt-2 text-gray-500">制定日：2026年5月11日</p>
          </section>
        </div>
      </div>
    </div>
  )
}
