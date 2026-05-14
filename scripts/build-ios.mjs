/**
 * iOS static export build script
 * API routes are not used in Capacitor apps.
 * We stub them out during build, then restore originals.
 */
import { execSync } from 'child_process'
import { readFileSync, writeFileSync } from 'fs'

// Routes to stub entirely (can't be statically rendered)
const STUB_ROUTES = [
  'app/og/route.tsx',
  'app/api/og/result/route.tsx',
]

// Pages to stub entirely (use dynamic searchParams)
const STUB_PAGES = [
  { path: 'app/result/page.tsx', stub: `export const dynamic = 'force-static'\nexport default function Page() { return null }\n` },
]

// Routes that just need force-static added
const STATIC_ROUTES = [
  'app/api/ask-ai/route.ts',
  'app/api/news/route.ts',
  'app/api/cron/daily-post/route.ts',
]

const STUB_CONTENT = `export const dynamic = 'force-static'
export function GET() { return new Response('', { status: 200 }) }
`
const FORCE_STATIC = "export const dynamic = 'force-static'\n"

// Read originals
const allPaths = [...STUB_ROUTES, ...STATIC_ROUTES, ...STUB_PAGES.map(p => p.path)]
const originals = allPaths.map(p => ({ path: p, content: readFileSync(p, 'utf8') }))

try {
  // Stub OG routes
  for (const path of STUB_ROUTES) {
    writeFileSync(path, STUB_CONTENT)
  }

  // Stub dynamic pages
  for (const { path, stub } of STUB_PAGES) {
    writeFileSync(path, stub)
  }

  // Add force-static to API routes
  for (const path of STATIC_ROUTES) {
    const content = readFileSync(path, 'utf8')
    if (!content.includes("export const dynamic")) {
      writeFileSync(path, FORCE_STATIC + content)
    }
  }

  // Build with static export
  execSync('npm run build', {
    stdio: 'inherit',
    env: { ...process.env, NEXT_OUTPUT: 'export' },
  })

  console.log('\n✅ Static export complete — running cap sync...')
  execSync('npx cap sync ios', { stdio: 'inherit' })
  console.log('\n✅ iOS build complete! Open Xcode to archive & submit.')

} finally {
  // Always restore originals
  for (const { path, content } of originals) {
    writeFileSync(path, content)
  }
  console.log('✅ Source files restored.')
}
