/**
 * ランキング削除スクリプト
 * - 禁句ワードを含む会社名・ユーザー名を削除
 * - 指定ユーザー名を全削除
 */

import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

let supabaseUrl = ''
let supabaseKey = ''
try {
  const env = readFileSync(join(root, '.env.local'), 'utf-8')
  for (const line of env.split('\n')) {
    const [k, ...v] = line.split('=')
    if (k?.trim() === 'NEXT_PUBLIC_SUPABASE_URL') supabaseUrl = v.join('=').trim()
    if (k?.trim() === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') supabaseKey = v.join('=').trim()
  }
} catch {
  console.error('❌ .env.local が見つかりません')
  process.exit(1)
}

// 禁句ワード
const BANNED_WORDS = [
  "admin","administrator","root","system","master","owner","info","support",
  "test","guest","user","運営","運営者","管理","管理者","公式","スタッフ",
  "システム","テスト","ゲスト","null","undefined","nan","dummy","sample",
  "ばか","バカ","アホ","あほ","クソ","くそ","糞","ゴミ","ごみ","カス","かす",
  "雑魚","ざこ","ザコ","しね","死ね","シネ","氏ね","タヒ","殺す","ころす",
  "キモい","きもい","うざい","ウザい","ぼけ","ボケ","まぬけ","マヌケ",
  "ブス","ぶす","デブ","でぶ","ハゲ","はげ","無能","低能",
  "ちんこ","チンコ","ちんぽ","チンポ","ちんちん","チンチン","おちんちん","ちんぽこ",
  "まんこ","マンコ","おまんこ","われめ","ワレメ","けつまんこ","げろまんこ",
  "うんこ","ウンコ","うんち","ウンチ","おなら","オナラ",
  "エロ","えろ","ero","ポルノ","porno","激えろ",
  "セックス","せっくす","sex","中出し","なかだし",
  "オナニー","おなにー","シコシコ","しこしこ","どすけべ","すけべ",
  "童貞","どうてい","処女","しょじょ","ビッチ","びっち","やりまん","ヤリマン",
  "巨乳","きょにゅう","貧乳","ひんにゅう","ロリ","ろり","ショタ","しょた",
  "風俗","ふうぞく","ソープ","デリヘル","ヘルス",
  "援助交際","えんこう","パパ活","ママ活","アダルト",
  "詐欺","さぎ","違法","犯罪","スパム",
  "おもんない","凶悪",
]

// 完全一致で削除するdisplay_name（荒らしユーザー）
const BAN_USERNAMES = [
  "大動脈",
]

function normalize(s) {
  let r = s
    .toLowerCase()
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0))
    .replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60))
    .replace(/[ーｰ－\-~～]/g, '')
    .replace(/\s/g, '').replace(/　/g, '')
    .replace(/[!-\/:-@\[-`{-~！-／：-＠]/g, '')
    .replace(/0/g,'o').replace(/1/g,'i').replace(/3/g,'e')
    .replace(/4/g,'a').replace(/5/g,'s').replace(/7/g,'t')
  r = r.replace(/(.)\1+/g, '$1')
  return r
}

function hasBannedWord(text) {
  if (!text) return false
  const norm = normalize(text)
  return BANNED_WORDS.some(w => norm.includes(normalize(w)))
}

async function supabaseFetch(path, options = {}) {
  const res = await fetch(`${supabaseUrl}/rest/v1${path}`, {
    ...options,
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
      ...options.headers,
    },
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`${res.status}: ${text}`)
  return text ? JSON.parse(text) : []
}

async function main() {
  console.log('🔍 game_results を取得中...')
  const entries = await supabaseFetch('/game_results?select=id,company_name,display_name&limit=10000')
  console.log(`📋 総エントリ数: ${entries.length}`)

  const toDelete = entries.filter(e =>
    hasBannedWord(e.company_name) ||
    hasBannedWord(e.display_name) ||
    BAN_USERNAMES.includes(e.display_name)
  )

  if (toDelete.length === 0) {
    console.log('✅ 削除対象はありませんでした')
    return
  }

  console.log(`🚨 削除対象: ${toDelete.length}件`)
  toDelete.forEach(e => console.log(`  - "${e.company_name}" / "${e.display_name}"`))

  const ids = toDelete.map(e => e.id).join(',')
  await supabaseFetch(`/game_results?id=in.(${ids})`, { method: 'DELETE', headers: { 'Prefer': '' } })
  console.log(`✅ ${toDelete.length}件を削除しました`)
}

main().catch(err => { console.error('❌', err.message); process.exit(1) })
