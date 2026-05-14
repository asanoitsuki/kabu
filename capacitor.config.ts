import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  // アプリ名（App Store表示名）
  appName: 'マイビズ',
  // バンドルID（後でApple Developer Portalで取得した値に変更）
  appId: 'com.startupstudio.app',
  // Next.js 静的ビルドの出力先
  webDir: 'out',
  server: {
    // iOSネイティブで動かすのでローカルファイルを使用
    androidScheme: 'https',
  },
  ios: {
    // ステータスバーをWebViewに含める
    contentInset: 'automatic',
  },
}

export default config
