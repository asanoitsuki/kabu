const BANNED_WORDS: string[] = [
  "admin", "administrator", "root", "system", "master", "owner", "info", "support",
  "test", "guest", "user", "運営", "運営者", "管理", "管理者", "公式", "スタッフ",
  "システム", "テスト", "ゲスト", "null", "undefined", "nan", "dummy", "sample",
  "password", "qwerty", "ああああ", "いいいい", "うううう", "ええええ", "おおおお",
  "script", "http", "https", "www", ".com", ".net", ".jp", "url",
  "ばか", "バカ", "アホ", "あほ", "クソ", "くそ", "糞", "ゴミ", "ごみ", "カス", "かす",
  "雑魚", "ざこ", "ザコ", "しね", "死ね", "シネ", "氏ね", "４ね", "タヒ", "殺す",
  "ころす", "コロス", "キモい", "きもい", "うざい", "ウザい", "ぼけ", "ボケ",
  "まぬけ", "マヌケ", "ブス", "ぶす", "デブ", "でぶ", "ハゲ", "はげ", "無能", "むのう", "低能", "ていのう",
  "ちんこ", "チンコ", "ちんぽ", "チンポ", "ちんちん", "チンチン", "おちんちん",
  "まんこ", "マンコ", "おまんこ", "われめ", "ワレメ",
  "うんこ", "ウンコ", "うんち", "ウンチ", "げり", "ゲリ", "おなら", "オナラ",
  "エロ", "えろ", "ero", "ポルノ", "porno",
  "セックス", "せっくす", "sex", "中出し", "なかだし",
  "オナニー", "おなにー", "シコシコ", "しこしこ", "オカズ",
  "童貞", "どうてい", "処女", "しょじょ", "ビッチ", "びっち", "やりまん", "ヤリマン",
  "巨乳", "きょにゅう", "貧乳", "ひんにゅう", "ロリ", "ろり", "ショタ", "しょた",
  "風俗", "ふうぞく", "ソープ", "デリヘル", "ヘルス", "キャバクラ", "ホスト",
  "やりもく", "ヤリモク", "出会い厨", "裏垢", "うらあか",
  "援助交際", "えんこう", "エンコウ", "パパ活", "ママ活", "アダルト", "出会い",
  "稼げる", "儲かる", "副業", "詐欺", "さぎ", "宣伝", "勧誘", "違法", "犯罪", "スパム",
]

/**
 * 強力な正規化
 * - 全角→半角 / カタカナ→ひらがな
 * - あらゆる空白・記号・絵文字を除去
 * - 数字→英字（leetspeak）変換
 * - 繰り返し文字の圧縮（ちんんこ→ちんこ）
 */
function normalize(s: string): string {
  let r = s
    .toLowerCase()
    // 全角英数字 → 半角
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0))
    // カタカナ → ひらがな
    .replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60))
    // 長音符・ハイフン系除去
    .replace(/[ーｰ－\-~～]/g, '')
    // 空白・不可視文字除去
    .replace(/\s/g, '')
    .replace(/　/g, '') // 全角スペース
    // ASCII記号除去
    .replace(/[!-\/:-@[-`{-~]/g, '')
    // 全角記号除去
    .replace(/[！-／：-＠「-｀｛-～。、・]/g, '')
    // 絵文字・特殊記号除去（Unicode範囲）
    .replace(/[ -⁯✀-➿⬀-⯿]/g, '')

  // leetspeak: 数字→英字
  r = r
    .replace(/0/g, 'o')
    .replace(/1/g, 'i')
    .replace(/3/g, 'e')
    .replace(/4/g, 'a')
    .replace(/5/g, 's')
    .replace(/6/g, 'b')
    .replace(/7/g, 't')
    .replace(/8/g, 'b')
    .replace(/9/g, 'g')

  // 繰り返し文字を1文字に圧縮（「しねぇぇぇ」→「しね」）
  r = r.replace(/(.)\1+/g, '$1')

  return r
}

/** 禁句ワードが含まれていればそのワードを返す。なければnull */
export function detectBannedWord(name: string): string | null {
  const norm = normalize(name)
  for (const w of BANNED_WORDS) {
    if (norm.includes(normalize(w))) return w
  }
  return null
}
