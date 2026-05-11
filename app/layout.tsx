import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = 'https://kabu-three.vercel.app'

export const metadata: Metadata = {
  title: '株式会社シミュレーター | 自分だけの仮想会社を上場させよう',
  description: '社名を決めてIPO上場。20ターンの経営判断で株価を最大化する無料ブラウザゲーム。登録不要・即プレイ。',
  keywords: ['株式会社', 'シミュレーター', '経営ゲーム', '株価', 'ブラウザゲーム', '無料', 'IPO'],
  openGraph: {
    title: '株式会社シミュレーター | 自分だけの仮想会社を上場させよう',
    description: '社名を決めてIPO上場。20ターンの経営判断で株価を最大化する無料ブラウザゲーム。登録不要・即プレイ。',
    url: BASE_URL,
    siteName: '株式会社シミュレーター',
    locale: 'ja_JP',
    type: 'website',
    images: [{ url: `${BASE_URL}/og`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '株式会社シミュレーター | 自分だけの仮想会社を上場させよう',
    description: '社名を決めてIPO上場。20ターンの経営判断で株価を最大化する無料ブラウザゲーム。登録不要・即プレイ。',
    images: [`${BASE_URL}/og`],
  },
  metadataBase: new URL(BASE_URL),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9474313759444287"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
        {children}
        <footer className="text-center py-4 text-gray-700 text-xs">
          <Link href="/privacy" className="hover:text-gray-500 transition-colors">プライバシーポリシー</Link>
        </footer>
      </body>
    </html>
  );
}
