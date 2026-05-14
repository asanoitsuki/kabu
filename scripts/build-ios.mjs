/**
 * iOS向け静的ビルドスクリプト
 * - Next.js の output: 'export' で out/ に静的ファイルを生成
 * - APIルート（サーバー必須）を一時退避してからビルド
 * - ビルド後に元に戻す
 */

import { execSync } from 'child_process'
import { existsSync, renameSync, rmSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

// 静的エクスポート時に問題になるルートを退避
const routesToHide = [
  { from: join(root, 'app', 'api'),    to: join(root, 'app', '_api_hidden') },
  { from: join(root, 'app', 'og'),     to: join(root, 'app', '_og_hidden') },
  { from: join(root, 'app', 'result'), to: join(root, 'app', '_result_hidden') },
]

function hide() {
  for (const { from, to } of routesToHide) {
    if (existsSync(from)) {
      renameSync(from, to)
      console.log(`[build-ios] Hid: ${from} → ${to}`)
    }
  }
}

function restore() {
  for (const { from, to } of routesToHide) {
    if (existsSync(to)) {
      renameSync(to, from)
      console.log(`[build-ios] Restored: ${to} → ${from}`)
    }
  }
}

try {
  hide()
  // TypeScriptキャッシュをクリア（退避したルートの古い型情報を消す）
  const nextCacheDir = join(root, '.next')
  if (existsSync(nextCacheDir)) {
    rmSync(nextCacheDir, { recursive: true, force: true })
    console.log('[build-ios] Cleared .next cache')
  }
  console.log('[build-ios] Running next build with output=export ...')
  execSync('next build', {
    cwd: root,
    stdio: 'inherit',
    env: { ...process.env, NEXT_OUTPUT: 'export' },
  })
  console.log('[build-ios] Build complete! Output: out/')
} catch (err) {
  console.error('[build-ios] Build failed:', err.message)
} finally {
  restore()
}
