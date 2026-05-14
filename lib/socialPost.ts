const GAME_URL = 'https://kabu-three.vercel.app'
const OG_IMAGE_URL = 'https://kabu-three.vercel.app/og'

const TEMPLATES = [
  `💀 地獄難易度、1ターン目で資金ショートした\nなんでこんな難しいんだよ笑\n\n仮想会社を経営して株価を上げる無料ゲーム👇\n${GAME_URL}`,

  `📈 IT業界でSランク達成！株価+480%\nコツは最初の3ターンで研究開発に全振りすること\n\n同じ戦略試してみて👇\n${GAME_URL}`,

  `🍜 飲食業界が一番難しい説\n客単価上げようとすると客数が減るジレンマ\n誰か飲食でSランク取った人いる？\n\n${GAME_URL}`,

  `🏆 このゲーム、経営の勉強になりすぎる\nPER・EPS・時価総額が体感でわかるようになった\n無料で遊べます👇\n${GAME_URL}`,

  `😂 友達4人で同じ会社名で対戦\n→ 全員Fランクで爆笑\n地獄難易度は人を壊す\n\n${GAME_URL}`,

  `🎮 登録不要・完全無料で遊べる経営シミュゲーム\n自分の会社を20ターンで上場させよう\nIT/製造/飲食/金融/エンタメの5業種から選択\n\n${GAME_URL}`,

  `💰 金融業界を攻略できた人は天才\nリスク管理コストで利益が吹き飛ぶ😭\n\n5業種の中で最難関だと思う\n${GAME_URL}`,

  `🏭 製造業でコツコツ設備投資\n→ 最終ターンで株価3倍になった\n地道な戦略が一番強い説\n\n${GAME_URL}`,

  `🎲 イベントが100種類あって全部ランダム\n「競合他社が不祥事」引いて株価爆上がりした😂\n運ゲー要素も面白い\n\n${GAME_URL}`,

  `🚀 エンタメ業界でIPO株価の10倍達成！\nヒット作連発のイベントが重なった奇跡\n再現性ほぼ0だけど\n\n${GAME_URL}`,

  `📊 会社経営って難しいんだなと実感するゲーム\n売上あっても利益が出なくて株価下がる現実\n無料なので試してみて👇\n${GAME_URL}`,

  `😇 研究開発に全予算ぶっこんだら\n2ターン目に現金がゼロになった\nバランスって大事\n\n${GAME_URL}`,

  `🔥 普通難易度クリアしたら次は難しいに挑戦して\nさらに地獄に挑戦して...\nやめ時がわからんゲーム\n\n${GAME_URL}`,

  `💡 知ってた？このゲームで学べること\n・PERの意味\n・株価の決まり方\n・キャッシュフローの重要性\n全部体感できる\n\n${GAME_URL}`,

  `😤 Sランクの条件が鬼すぎる\nIPO価格の5倍以上の株価が必要\n達成した人ほんとに凄い\n\n${GAME_URL}`,

  `🏢 仮想の自分の会社を持てるゲーム\n社名・業種・カラーを自分でカスタマイズ\n登録不要で今すぐ始められる👇\n${GAME_URL}`,

  `📉 20ターンで上場を目指すゲームなんだけど\n18ターン目で倒産した話をしていいですか\n\n${GAME_URL}`,

  `⚡ 毎ターン予算を4つの部門に配分する\n営業・開発・マーケ・管理\nどこに投資するかが株価を左右する\n\n${GAME_URL}`,

  `🎯 今日の挑戦：飲食業界・地獄難易度でSランク\n誰か一緒に挑戦する人いない？\n\n無料でできます👇\n${GAME_URL}`,

  `😱 「自然災害で工場停止」のイベント引いて\n一瞬で経営危機になった\n100種類のランダムイベント怖すぎ\n\n${GAME_URL}`,

  `💼 就活生・ビジネスマン必見\n株価の仕組みをゲームで楽しく理解できる\n教科書より100倍わかりやすい\n\n${GAME_URL}`,

  `🌟 全5業種クリア済みの猛者いる？\nIT→製造→飲食→金融→エンタメ全制覇\n全部難しさが違いすぎる\n\n${GAME_URL}`,

  `🤑 「株式公開」「時価総額」「EPS」\nこの言葉の意味、このゲームやったら全部わかった\n無料で遊べます👇\n${GAME_URL}`,

  `😆 ノーマル→普通→難しい→地獄の4段階\n地獄にした途端に別ゲーになる\nノーマルは練習用だと思ってる\n\n${GAME_URL}`,

  `🏅 プレイ後のS〜Fランク評価が正直すぎる\nFランク取ったとき経営センスなさすぎて凹んだ\n\n${GAME_URL}`,

  `📱 スマホでもPCでも遊べる\n登録不要・完全無料の経営シミュゲーム\n暇なときにどうぞ👇\n${GAME_URL}`,

  `🔄 同じ業種でも毎回違う展開になる\nランダムイベントのおかげで何度でも楽しめる\n\n${GAME_URL}`,

  `💸 広告費をケチったら売上が伸びなくて\n逆に広告に全振りしたら利益が出なくて\n経営のバランス感覚が鍛えられるゲーム\n\n${GAME_URL}`,

  `🎉 このゲームで一番気持ちいい瞬間\n→ 最終ターンで株価が急上昇するとき\nそれだけのために何十回でもやり直せる\n\n${GAME_URL}`,

  `🧠 経営を「頭でわかる」から「体でわかる」にするゲーム\n5分で始められる無料シミュレーター👇\n${GAME_URL}`,
]

export function getTodayTemplate(): string {
  const dayOfYear = Math.floor(Date.now() / (1000 * 60 * 60 * 24))
  return TEMPLATES[dayOfYear % TEMPLATES.length]
}

export async function generatePostContent(): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) return getTodayTemplate()

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        messages: [{
          role: 'user',
          content: `株式会社シミュレーター（${GAME_URL}）の宣伝投稿を1つ書いてください。

ゲーム概要: 仮想会社を経営して株価を上げる無料シミュレーションゲーム。IT/製造/飲食/金融/エンタメから業種選択。20ターン制。易しい/普通/難しい/地獄の4難易度。S〜Fの6段階評価。ランダムイベント100種類。

条件:
- 200文字以内
- 絵文字を2〜4個使う
- URLを含める: ${GAME_URL}
- ハッシュタグは不要
- 以下のどれか1パターンで書く（ランダムに選ぶ）:
  1. プレイヤーの体験談風（失敗/成功/驚き）
  2. ゲームの特徴を紹介（教育的・ビジネス学習）
  3. チャレンジ煽り（難易度/業種への挑戦）
  4. あるあるネタ（経営の難しさのあるある）
  5. 豆知識・ゲームの仕組み紹介
- 今日は ${new Date().toLocaleDateString('ja-JP')} です
- 読んだ人がやってみたくなるような内容に

投稿本文のみ出力してください。`,
        }],
      }),
    })
    const data = await res.json()
    return data.content?.[0]?.text?.trim() ?? getTodayTemplate()
  } catch {
    return getTodayTemplate()
  }
}

export async function postToX(text: string): Promise<{ success: boolean; id?: string; error?: string }> {
  const apiKey = process.env.TWITTER_API_KEY
  const apiSecret = process.env.TWITTER_API_SECRET
  const accessToken = process.env.TWITTER_ACCESS_TOKEN
  const accessSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET

  if (!apiKey || !apiSecret || !accessToken || !accessSecret) {
    return { success: false, error: 'X API keys not configured' }
  }

  try {
    const { TwitterApi } = await import('twitter-api-v2')
    const client = new TwitterApi({ appKey: apiKey, appSecret: apiSecret, accessToken, accessSecret })
    const { data } = await client.v2.tweet(text)
    return { success: true, id: data.id }
  } catch (e: any) {
    return { success: false, error: e?.message ?? String(e) }
  }
}

export async function postToBluesky(text: string): Promise<{ success: boolean; uri?: string; error?: string }> {
  const identifier = process.env.BLUESKY_HANDLE
  const password = process.env.BLUESKY_APP_PASSWORD
  if (!identifier || !password) return { success: false, error: 'Bluesky credentials not configured' }

  try {
    const authRes = await fetch('https://bsky.social/xrpc/com.atproto.server.createSession', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    })
    const { accessJwt, did, error: authErr } = await authRes.json()
    if (!accessJwt) return { success: false, error: authErr ?? 'Auth failed' }

    // URLをクリック可能にするfacets
    const facets: any[] = []
    const urlRegex = /https?:\/\/[^\s]+/g
    let match
    while ((match = urlRegex.exec(text)) !== null) {
      const byteStart = Buffer.from(text.slice(0, match.index), 'utf-8').length
      const byteEnd = byteStart + Buffer.from(match[0], 'utf-8').length
      facets.push({
        index: { byteStart, byteEnd },
        features: [{ $type: 'app.bsky.richtext.facet#link', uri: match[0] }],
      })
    }

    // OGP画像をblobとしてアップロード
    let embed: any = undefined
    try {
      const imgRes = await fetch(OG_IMAGE_URL)
      if (imgRes.ok) {
        const imgBuf = await imgRes.arrayBuffer()
        const contentType = imgRes.headers.get('content-type') ?? 'image/png'
        const blobRes = await fetch('https://bsky.social/xrpc/com.atproto.repo.uploadBlob', {
          method: 'POST',
          headers: { 'Content-Type': contentType, Authorization: `Bearer ${accessJwt}` },
          body: imgBuf,
        })
        const { blob } = await blobRes.json()
        if (blob) {
          embed = {
            $type: 'app.bsky.embed.images',
            images: [{ image: blob, alt: '株式会社シミュレーター - 仮想会社を経営して株価を上げるゲーム' }],
          }
        }
      }
    } catch { /* 画像添付失敗しても投稿は続行 */ }

    const postRes = await fetch('https://bsky.social/xrpc/com.atproto.repo.createRecord', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessJwt}` },
      body: JSON.stringify({
        repo: did,
        collection: 'app.bsky.feed.post',
        record: {
          $type: 'app.bsky.feed.post',
          text,
          createdAt: new Date().toISOString(),
          ...(facets.length > 0 && { facets }),
          ...(embed && { embed }),
        },
      }),
    })
    const { uri, error: postErr } = await postRes.json()
    if (uri) return { success: true, uri }
    return { success: false, error: postErr ?? 'Post failed' }
  } catch (e: any) {
    return { success: false, error: e?.message ?? String(e) }
  }
}

export async function postToDiscord(text: string): Promise<{ success: boolean; error?: string }> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL
  if (!webhookUrl) return { success: false, error: 'Discord webhook not configured' }

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: text,
        embeds: [{
          image: { url: OG_IMAGE_URL },
          color: 0x4f46e5,
        }],
      }),
    })
    if (res.ok) return { success: true }
    return { success: false, error: `HTTP ${res.status}` }
  } catch (e: any) {
    return { success: false, error: e?.message ?? String(e) }
  }
}

export async function postToInstagram(caption: string): Promise<{ success: boolean; id?: string; error?: string }> {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN
  const userId = process.env.INSTAGRAM_USER_ID
  const imageUrl = OG_IMAGE_URL

  if (!accessToken || !userId) {
    return { success: false, error: 'Instagram credentials not configured' }
  }

  try {
    const createRes = await fetch(
      `https://graph.instagram.com/v21.0/${userId}/media`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: imageUrl, caption, access_token: accessToken }),
      }
    )
    const { id: creationId, error: createErr } = await createRes.json()
    if (!creationId) return { success: false, error: createErr?.message ?? 'Failed to create media' }

    await new Promise(r => setTimeout(r, 5000))
    const publishRes = await fetch(
      `https://graph.instagram.com/v21.0/${userId}/media_publish`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creation_id: creationId, access_token: accessToken }),
      }
    )
    const { id, error: publishErr } = await publishRes.json()
    if (id) return { success: true, id }
    return { success: false, error: publishErr?.message ?? 'Failed to publish' }
  } catch (e: any) {
    return { success: false, error: e?.message ?? String(e) }
  }
}
