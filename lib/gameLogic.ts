import { Allocation, Company, Difficulty, Financials, GameEvent, GameState, Industry, TurnReport } from './types'

export const INDUSTRY_STATS: GameState['industryStats'] = {
  IT:       { per: 28, growth: 1.10 },
  製造:     { per: 13, growth: 1.03 },
  飲食:     { per: 18, growth: 1.05 },
  金融:     { per: 11, growth: 1.02 },
  エンタメ: { per: 22, growth: 1.07 },
}

export const INDUSTRY_COLORS: Record<Industry, string> = {
  IT:       '#6366f1',
  製造:     '#f59e0b',
  飲食:     '#ef4444',
  金融:     '#10b981',
  エンタメ: '#ec4899',
}

export interface DifficultyConfig {
  label: string
  emoji: string
  desc: string
  color: string
  eventRate: number
  costGrowth: number
  negBias: number
  revNoiseMult: number
  sRank: number
  aRank: number
  bRank: number
  cRank: number
  dRank: number
}

export const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyConfig> = {
  easy: {
    label: 'ゆるゆる', emoji: '😊', color: '#10b981',
    desc: 'イベント少なめ・コスト安定。はじめての経営体験',
    eventRate: 0.40, costGrowth: 1.03, negBias: 0.5, revNoiseMult: 0.05,
    sRank: 1.8, aRank: 1.0, bRank: 0.5, cRank: 0.05, dRank: -0.2,
  },
  normal: {
    label: 'ノーマル', emoji: '😐', color: '#f59e0b',
    desc: 'バランスの取れた標準難易度',
    eventRate: 0.60, costGrowth: 1.06, negBias: 1.0, revNoiseMult: 0.09,
    sRank: 3.5, aRank: 2.0, bRank: 1.0, cRank: 0.2, dRank: -0.2,
  },
  hard: {
    label: 'ハード', emoji: '😤', color: '#ef4444',
    desc: '厳しいイベント連発・コスト高騰。熟練者向け',
    eventRate: 0.75, costGrowth: 1.09, negBias: 1.8, revNoiseMult: 0.13,
    sRank: 5.0, aRank: 2.5, bRank: 1.2, cRank: 0.3, dRank: -0.15,
  },
  hell: {
    label: '地獄', emoji: '💀', color: '#a855f7',
    desc: 'ほぼ毎ターン死ぬ。Sランクは伝説の領域',
    eventRate: 0.88, costGrowth: 1.13, negBias: 3.0, revNoiseMult: 0.18,
    sRank: 8.0, aRank: 4.0, bRank: 2.0, cRank: 0.5, dRank: -0.1,
  },
}

type AllocCondition = {
  minRd?: number; maxRd?: number
  minMarketing?: number; maxMarketing?: number
  minHiring?: number; maxHiring?: number
  minCapex?: number; maxCapex?: number
  industries?: Industry[]
}

type EventEntry = GameEvent & {
  weight: number
  isNegative: boolean
  condition?: AllocCondition
}

const EVENTS: EventEntry[] = [
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // POSITIVE (50)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ── R&D投資が高いときに発生しやすいポジティブ ──
  {
    id: 'rd_breakthrough', title: 'R&D投資が実を結んだ！', icon: '💡', weight: 1.0, isNegative: false,
    condition: { minRd: 25 },
    description: '研究開発費を積み上げた成果で新製品が完成。競合が追いつくのに3年かかる先進技術。売上・株価ともに急上昇。',
    effect: { revenueMultiplier: 1.28, stockSentiment: 0.20 },
  },
  {
    id: 'patent_granted', title: '画期的な特許を取得', icon: '📜', weight: 0.8, isNegative: false,
    condition: { minRd: 20 },
    description: 'R&D投資が実り、業界初の特許を取得。この技術を使わなければ製品が作れないため、ライセンス収益が発生。',
    effect: { revenueMultiplier: 1.18, stockSentiment: 0.18 },
  },
  {
    id: 'attract_scientists', title: '優秀な研究者が応募殺到', icon: '🔬', weight: 0.7, isNegative: false,
    condition: { minRd: 30 },
    description: 'R&D重視の姿勢が評判を呼び、優秀な研究者からの応募が殺到。技術力がさらに向上し長期的な競争力が確立。',
    effect: { revenueMultiplier: 1.12, expenseMultiplier: 0.95, stockSentiment: 0.14 },
  },
  {
    id: 'product_innovation', title: '次世代製品が大ヒット', icon: '🚀', weight: 0.6, isNegative: false,
    condition: { minRd: 35 },
    description: '研究開発費を惜しまなかった結果、次世代製品が市場を席巻。競合製品との差別化が明確になり価格競争から脱却。',
    effect: { revenueMultiplier: 1.32, stockSentiment: 0.22 },
  },

  // ── マーケティング投資が高いときに発生しやすいポジティブ ──
  {
    id: 'viral_campaign', title: 'SNSキャンペーンが爆発的拡散', icon: '🔥', weight: 1.0, isNegative: false,
    condition: { minMarketing: 25 },
    description: 'マーケティング費用をかけた広告キャンペーンがSNSで爆発的に拡散。広告費の10倍以上の宣伝効果が得られた。',
    effect: { revenueMultiplier: 1.25, stockSentiment: 0.15 },
  },
  {
    id: 'tv_feature', title: 'テレビで大特集！問い合わせ10倍', icon: '📺', weight: 0.7, isNegative: false,
    condition: { minMarketing: 20 },
    description: 'マーケ投資が功を奏し、テレビのゴールデンタイムで特集。翌日から問い合わせが10倍に急増し、在庫が即日完売。',
    effect: { revenueMultiplier: 1.22, stockSentiment: 0.14 },
  },
  {
    id: 'brand_recognition', title: 'ブランド認知度がトップに', icon: '⭐', weight: 0.6, isNegative: false,
    condition: { minMarketing: 30 },
    description: '継続的なマーケ投資が積み重なり、業界認知度調査でトップに。ブランド力は長期的な売上の土台になる。',
    effect: { revenueMultiplier: 1.18, stockSentiment: 0.16 },
  },
  {
    id: 'influencer_collab', title: '大物インフルエンサーとコラボ成功', icon: '🎯', weight: 0.8, isNegative: false,
    condition: { minMarketing: 15 },
    description: 'マーケ予算を使って大物インフルエンサーとのコラボを実現。フォロワー500万人への露出で新規顧客が急増。',
    effect: { revenueMultiplier: 1.20, stockSentiment: 0.12 },
  },

  // ── 採用投資が高いときに発生しやすいポジティブ ──
  {
    id: 'dream_team', title: '最高のチームが出来上がった', icon: '👥', weight: 1.0, isNegative: false,
    condition: { minHiring: 20 },
    description: '採用・育成に投資し続けた結果、各部門に優秀な人材が揃った。組織力が上がり業務効率が大幅に向上。',
    effect: { revenueMultiplier: 1.15, expenseMultiplier: 0.92, stockSentiment: 0.12 },
  },
  {
    id: 'star_executive', title: 'カリスマ経営幹部を採用', icon: '👔', weight: 0.5, isNegative: false,
    condition: { minHiring: 25 },
    description: '採用費を惜しまなかった結果、業界有名な経営幹部を引き抜きに成功。投資家からの注目度が一気に上昇。',
    effect: { revenueMultiplier: 1.10, stockSentiment: 0.25 },
  },
  {
    id: 'zero_turnover', title: '離職率ゼロ達成！生産性急上昇', icon: '💪', weight: 0.7, isNegative: false,
    condition: { minHiring: 30 },
    description: '待遇・環境への継続投資が報われ離職率がゼロに。人材の定着で経験値が蓄積し生産性が業界トップクラスに。',
    effect: { revenueMultiplier: 1.18, expenseMultiplier: 0.90, stockSentiment: 0.14 },
  },

  // ── 設備投資が高いときに発生しやすいポジティブ ──
  {
    id: 'capacity_boost', title: '新設備で生産能力が2倍に', icon: '🏗️', weight: 1.0, isNegative: false,
    condition: { minCapex: 20 },
    description: '設備投資が実り、新ラインが稼働開始。生産能力が倍増し、これまで断っていた大口注文を受けられるようになった。',
    effect: { revenueMultiplier: 1.25, stockSentiment: 0.14 },
  },
  {
    id: 'automation_success', title: '自動化で製造コストを激減', icon: '🤖', weight: 0.8, isNegative: false,
    condition: { minCapex: 25 },
    description: '設備投資による工場自動化が完成。人件費と製造コストが大幅に削減され、利益率が業界最高水準に。',
    effect: { expenseMultiplier: 0.82, stockSentiment: 0.16 },
  },
  {
    id: 'quality_up', title: '最新設備で品質が格段に向上', icon: '✅', weight: 0.7, isNegative: false,
    condition: { minCapex: 15 },
    description: '最新設備の導入で製品の品質が格段に向上。不良品率がほぼゼロになり、顧客満足度と口コミが急上昇。',
    effect: { revenueMultiplier: 1.16, stockSentiment: 0.12 },
  },

  // ── 文脈に依存しないポジティブイベント ──
  {
    id: 'boom', title: '景気好況', icon: '📈', weight: 1.0, isNegative: false,
    description: '市場全体が活況！消費者の財布の紐が緩み、どの業界も売上が増加。株式市場全体が上昇トレンドに。',
    effect: { revenueMultiplier: 1.25, stockSentiment: 0.12 },
  },
  {
    id: 'rival_bankrupt', title: '最大の競合が倒産！', icon: '🎯', weight: 0.4, isNegative: false,
    description: 'ライバル企業が資金難で突然倒産。取引先・顧客が一気にこちらへ流れてきた。競合がいなくなると値段を下げる必要がなくなり利益率も改善。',
    effect: { revenueMultiplier: 1.30, stockSentiment: 0.20 },
  },
  {
    id: 'rate_cut', title: '日銀が利下げ！借入コスト減少', icon: '📊', weight: 0.5, isNegative: false,
    description: '日銀が政策金利を引き下げ。借入コストが下がり企業の設備投資が活発化。株式は「金利が低い＝他の投資より株が有利」と判断され全体的に上昇。',
    effect: { expenseMultiplier: 0.90, stockSentiment: 0.15 },
  },
  {
    id: 'government_contract', title: '国家プロジェクトに採択', icon: '🏛️', weight: 0.4, isNegative: false,
    description: '政府の大型プロジェクトに採択。安定した長期収益が確保でき、「官公庁取引あり」の信頼感で株価も上昇。倒産リスクが低下したと市場が評価。',
    effect: { revenueMultiplier: 1.20, stockSentiment: 0.12 },
  },
  {
    id: 'subsidy', title: '政府補助金に採択', icon: '💰', weight: 0.6, isNegative: false,
    description: '国の産業振興補助金に採択。研究・設備コストの一部が国費で賄われる。コストが下がった分だけ利益が増え、EPS（1株利益）が改善し株価が上昇。',
    effect: { expenseMultiplier: 0.90, stockSentiment: 0.10 },
  },
  {
    id: 'partnership', title: '大企業との戦略提携が成立', icon: '🤝', weight: 0.5, isNegative: false,
    description: '業界大手との資本提携が成立。販路・技術・資金力が一気に強化。「大手が認めた会社」という信頼感が投資家にも伝わり株価が跳ね上がった。',
    effect: { revenueMultiplier: 1.20, stockSentiment: 0.15 },
  },
  {
    id: 'acquisition_offer', title: '大手から買収提案！', icon: '💎', weight: 0.3, isNegative: false,
    description: '業界トップ企業から買収オファー。プレミアム価格での買収提案は「今の株価より高い値段をつけた」ことを意味するため株価が急騰。',
    effect: { revenueMultiplier: 1.10, stockSentiment: 0.30 },
  },
  {
    id: 'consumer_trend', title: '消費トレンドがドンピシャ一致', icon: '📦', weight: 0.6, isNegative: false,
    description: '社会のトレンドが自社製品・サービスとピタリ一致。特に何もしていないのに需要が急増。売上増→利益増→EPS上昇→株価上昇の好循環が始まった。',
    effect: { revenueMultiplier: 1.28, stockSentiment: 0.16 },
  },
  {
    id: 'tax_break', title: '税制優遇措置が適用', icon: '📋', weight: 0.4, isNegative: false,
    description: '産業振興のための法人税優遇が適用。納める税金が減った分だけ純利益が増加。EPSが改善し、同じ業績でも「利益が増えた」と評価されて株価が上昇。',
    effect: { expenseMultiplier: 0.90, stockSentiment: 0.10 },
  },
  {
    id: 'yen_strong', title: '円高で輸入コスト激減', icon: '💹', weight: 0.4, isNegative: false,
    description: '円が急騰し輸入コストが大幅低下。特に海外から原材料を仕入れる業種では利益率が大幅に改善。コスト減→利益増→株価上昇のロジック。',
    effect: { expenseMultiplier: 0.88, stockSentiment: 0.08 },
  },
  {
    id: 'market_boom', title: '業界全体に追い風！', icon: '🌊', weight: 0.5, isNegative: false,
    description: '自社が属するセクター全体が好調。業界への資金流入が増え、個別銘柄も一緒に上昇する「セクターローテーション」が発生。乗るだけで株価が上がる。',
    effect: { revenueMultiplier: 1.15, stockSentiment: 0.20 },
  },
  {
    id: 'green_subsidy', title: '環境対応で補助金獲得', icon: '🌿', weight: 0.4, isNegative: false,
    description: 'CO2削減目標を達成し政府補助金を受領。環境対応企業はESG投資家からの注目が高まり、機関投資家が買いを入れて株価が上昇する傾向がある。',
    effect: { expenseMultiplier: 0.88, stockSentiment: 0.12 },
  },
  {
    id: 'lucky_quarter', title: '全てが噛み合った四半期', icon: '✨', weight: 0.3, isNegative: false,
    description: '運と実力が重なった奇跡の四半期。売上・コスト・市場環境の全てが好転。こういった「上振れ」が続くと市場は成長を織り込んで株価を一気に評価し直す。',
    effect: { revenueMultiplier: 1.30, expenseMultiplier: 0.90, stockSentiment: 0.18 },
  },
  {
    id: 'new_market', title: 'ブルーオーシャン市場を発見', icon: '🗺️', weight: 0.5, isNegative: false,
    description: '競合がいない未開拓市場を発見・開拓。競争がないため高い利益率で販売でき、新しい成長ストーリーが生まれて投資家の期待値（株価）が大きく上昇。',
    effect: { revenueMultiplier: 1.22, stockSentiment: 0.14 },
  },
  {
    id: 'global_expansion', title: '海外展開が軌道に乗った', icon: '🌏', weight: 0.4, isNegative: false,
    description: '海外市場への進出が成功し、グローバル売上が急拡大。国内市場だけでなく海外でも稼げると判断され、株価の成長期待（将来の利益）が大きく跳ね上がる。',
    effect: { revenueMultiplier: 1.25, stockSentiment: 0.18 },
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // NEGATIVE (50) — 予算配分と連動したリアルなネガティブイベント
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // ── 採用投資が低いと起こりやすいネガティブ ──
  {
    id: 'strike', title: '社員がストライキ！業務が完全停止', icon: '🪧', weight: 0.9, isNegative: true,
    condition: { maxHiring: 10 },
    description: '採用・待遇への投資を怠ったため人手不足と過重労働が深刻化。限界を超えた社員が一斉ストを決行。工場・オフィスが機能停止し売上がゼロに近づく。【学び：採用投資は人材の定着と士気に直結する】',
    effect: { revenueMultiplier: 0.72, expenseMultiplier: 1.15, stockSentiment: -0.28 },
  },
  {
    id: 'talent_exodus', title: '優秀な社員が次々と退職', icon: '🚪', weight: 0.8, isNegative: true,
    condition: { maxHiring: 15 },
    description: '待遇・成長機会への投資不足で優秀な人材が競合へ流出。特に幹部クラスの離職は組織の知見・人脈・ノウハウを一緒に持ち去られるため、回復に数年かかる。【学び：良い人材の確保には継続投資が必要】',
    effect: { revenueMultiplier: 0.82, expenseMultiplier: 1.12, stockSentiment: -0.22 },
  },
  {
    id: 'burnout_crisis', title: '過重労働で社員がバーンアウト', icon: '😮‍💨', weight: 0.7, isNegative: true,
    condition: { maxHiring: 20 },
    description: '人員不足を少人数でカバーし続けた結果、社員が燃え尽き症候群に。生産性が激減しミスが急増。「ブラック企業」の噂が広まり採用もさらに困難になる悪循環。',
    effect: { revenueMultiplier: 0.80, expenseMultiplier: 1.10, stockSentiment: -0.18 },
  },
  {
    id: 'labor_shortage', title: '人手不足で受注をこなせない', icon: '👷', weight: 0.8, isNegative: true,
    condition: { maxHiring: 10 },
    description: '採用投資を後回しにしてきたツケが回ってきた。需要はあるのに人員が足りず受注を断らざるを得ない状況に。売上機会の損失は数億円規模になる。',
    effect: { revenueMultiplier: 0.80, stockSentiment: -0.15 },
  },

  // ── R&D投資が低いと起こりやすいネガティブ ──
  {
    id: 'tech_obsolete', title: '自社製品が時代遅れに', icon: '💾', weight: 0.9, isNegative: true,
    condition: { maxRd: 10 },
    description: 'R&D投資を怠った結果、競合が次世代製品を発表。自社製品は「旧世代」扱いされ需要が消滅。技術は継続投資しないと陳腐化するため、追いつくのに数年かかる。【学び：R&Dは会社の未来への投資】',
    effect: { revenueMultiplier: 0.72, stockSentiment: -0.28 },
  },
  {
    id: 'copied_product', title: '技術を競合にコピーされた', icon: '📋', weight: 0.7, isNegative: true,
    condition: { maxRd: 15 },
    description: 'R&Dが少なく差別化が薄いため競合に簡単にコピーされてしまった。特許や独自技術がなければ価格競争に巻き込まれ利益率が激落ちする。【学び：研究投資が参入障壁を作る】',
    effect: { revenueMultiplier: 0.78, stockSentiment: -0.18 },
  },
  {
    id: 'quality_decline', title: '品質問題でクレーム多発', icon: '⚠️', weight: 0.7, isNegative: true,
    condition: { maxRd: 10 },
    description: 'R&D投資不足で製品改良が止まり品質が低下。顧客からのクレームが急増し返品・保証対応コストが膨らむ。口コミが悪化し新規顧客獲得も困難になる。',
    effect: { revenueMultiplier: 0.82, expenseMultiplier: 1.15, stockSentiment: -0.20 },
  },

  // ── 設備投資が低いと起こりやすいネガティブ ──
  {
    id: 'equipment_breakdown', title: '老朽設備が故障！生産停止', icon: '🔧', weight: 0.9, isNegative: true,
    condition: { maxCapex: 10 },
    description: '設備投資を怠ったため機械が老朽化し、ついに主要設備が完全故障。修理・代替調達に時間がかかり数週間の生産停止に。設備投資を「節約」した以上のコストが発生する。【学び：設備は定期的な投資が必要】',
    effect: { revenueMultiplier: 0.70, expenseMultiplier: 1.20, stockSentiment: -0.25 },
  },
  {
    id: 'production_accident', title: '設備老朽化で工場事故が発生', icon: '🏚️', weight: 0.6, isNegative: true,
    condition: { maxCapex: 10 },
    description: 'メンテナンスを怠った設備が引き金となり工場で事故が発生。負傷者が出て操業停止命令。賠償・補修・信頼回復に多大なコストがかかり株価にも直撃。',
    effect: { revenueMultiplier: 0.65, expenseMultiplier: 1.25, stockSentiment: -0.32 },
  },
  {
    id: 'capacity_bottleneck', title: '生産能力不足で商機を逃す', icon: '🏭', weight: 0.7, isNegative: true,
    condition: { maxCapex: 10 },
    description: '設備投資をしなかったため生産能力が限界に達し、急増した需要に対応できない。競合に顧客が流れ「信頼できないサプライヤー」のレッテルを貼られてしまう。',
    effect: { revenueMultiplier: 0.78, stockSentiment: -0.14 },
  },

  // ── マーケティング投資が低いと起こりやすいネガティブ ──
  {
    id: 'brand_erosion', title: '認知度低下で顧客が離れた', icon: '📢', weight: 0.8, isNegative: true,
    condition: { maxMarketing: 10 },
    description: 'マーケティング投資を怠ったため自社の存在が市場から忘れられつつある。新規顧客獲得ができず既存顧客も競合の宣伝に引き寄せられ離脱。売上が静かに減り続ける。【学び：見えないところでマーケ投資は顧客を守っている】',
    effect: { revenueMultiplier: 0.82, stockSentiment: -0.15 },
  },
  {
    id: 'market_share_loss', title: 'CM攻勢の競合にシェアを奪われた', icon: '📉', weight: 0.7, isNegative: true,
    condition: { maxMarketing: 10 },
    description: '競合が大規模な広告キャンペーンを展開。自社が沈黙している間にブランドイメージが逆転され、顧客が次々と競合へ流れた。マーケに投資しないと存在感が薄れる。',
    effect: { revenueMultiplier: 0.78, stockSentiment: -0.18 },
  },

  // ── 文脈に依存しないネガティブイベント（マクロ・外部要因）──
  {
    id: 'recession', title: '景気後退で消費が急減', icon: '📉', weight: 1.0, isNegative: true,
    description: 'GDP成長率がマイナスに転落し景気後退入り。消費者が財布を閉め売上が大幅減少。景気後退期は「今は買い時ではない」と投資家も判断し株価全体が下落する。',
    effect: { revenueMultiplier: 0.78, stockSentiment: -0.20 },
  },
  {
    id: 'rival_entry', title: '資金力のある新規参入者が登場', icon: '⚔️', weight: 1.0, isNegative: true,
    description: '大手企業が潤沢な資金で同業に参入。価格競争と顧客争奪戦が始まり市場シェアが減少。競合が増えると「1社あたりの利益」が減るため株価にも影響が出る。',
    effect: { revenueMultiplier: 0.82, stockSentiment: -0.12 },
  },
  {
    id: 'scandal', title: '内部告発で不祥事が発覚', icon: '💥', weight: 0.7, isNegative: true,
    description: '社員の内部告発により不正が明るみに。信頼の失墜は売上減少（顧客離れ）と費用増加（対応・賠償）のダブルパンチ。株価は「企業の信頼＝価値」なので急落する。',
    effect: { revenueMultiplier: 0.80, expenseMultiplier: 1.25, stockSentiment: -0.30 },
  },
  {
    id: 'cyber_attack', title: 'サイバー攻撃でシステムが停止', icon: '🔒', weight: 0.7, isNegative: true,
    description: 'ランサムウェアに感染しシステムが完全停止。身代金・復旧費・セキュリティ強化コストが急増。「情報管理が甘い会社」という印象が投資家・顧客の信頼を損なう。',
    effect: { expenseMultiplier: 1.20, stockSentiment: -0.18 },
  },
  {
    id: 'inflation', title: 'インフレで原価高騰・消費萎縮', icon: '🪙', weight: 0.8, isNegative: true,
    description: '物価高騰で原材料コストが上昇する一方、消費者は節約志向に。売上が減り費用が増える「挟み撃ち」状態。EPS（1株利益）が悪化し株価が下落する。',
    effect: { revenueMultiplier: 0.85, expenseMultiplier: 1.12, stockSentiment: -0.15 },
  },
  {
    id: 'rate_hike', title: '日銀が利上げ！借入コスト急増', icon: '🏦', weight: 0.6, isNegative: true,
    description: '政策金利の引き上げで借入コストが上昇。また「金利が高い＝預金や債券が有利」と判断され株式全体から資金が流出。特に成長株は「将来利益の割引率」が上がり株価が下落しやすい。',
    effect: { expenseMultiplier: 1.15, stockSentiment: -0.25 },
  },
  {
    id: 'yen_weak', title: '円安で輸入コストが急騰', icon: '💴', weight: 0.6, isNegative: true,
    description: '円が急落し輸入コストが激増。特に海外から原材料・部品を調達する業種では利益率が直撃を受ける。コスト増が利益を圧迫しEPSが悪化して株価が下落。',
    effect: { expenseMultiplier: 1.22, stockSentiment: -0.18 },
  },
  {
    id: 'sns_fire', title: 'SNS大炎上で不買運動に発展', icon: '🔥', weight: 0.6, isNegative: true,
    description: '社員の不適切発言や商品の問題がSNSで拡散。炎上→不買運動→売上急減のサイクルが発生。現代では炎上は数時間で世界中に広まりブランド価値を一瞬で破壊できる。',
    effect: { revenueMultiplier: 0.68, stockSentiment: -0.32 },
  },
  {
    id: 'supply_chain', title: 'サプライチェーン寸断で生産停止', icon: '⛓️', weight: 0.6, isNegative: true,
    description: '主要部品の供給元が災害・倒産で生産停止。代替調達が見つからず自社の生産ラインも停止。「在庫ゼロ・出荷不能」で顧客が競合に流れ売上が激減する。',
    effect: { revenueMultiplier: 0.70, expenseMultiplier: 1.15, stockSentiment: -0.22 },
  },
  {
    id: 'data_breach', title: '顧客情報が大量流出', icon: '🔓', weight: 0.5, isNegative: true,
    description: '顧客の個人情報が大規模流出。GDPR・個人情報保護法違反での巨額罰金に加え、顧客離れと風評被害が発生。「安心して使えない会社」の烙印を押され株価が急落。',
    effect: { expenseMultiplier: 1.25, stockSentiment: -0.30 },
  },
  {
    id: 'product_recall', title: '製品欠陥でリコール発令', icon: '🚨', weight: 0.5, isNegative: true,
    description: '主力製品に安全上の欠陥が発見され全品回収命令。回収・補償費用が膨大な上、「危険な製品を売った会社」というイメージが売上と株価の両方を直撃する。',
    effect: { revenueMultiplier: 0.78, expenseMultiplier: 1.20, stockSentiment: -0.28 },
  },
  {
    id: 'lawsuit', title: '集団訴訟で巨額賠償リスク', icon: '⚖️', weight: 0.5, isNegative: true,
    description: '消費者から集団訴訟が提起。賠償金・弁護士費用・和解金が業績を直撃し、訴訟係争中は事業の先行きが不透明になるため投資家が売りを入れ株価が下落する。',
    effect: { expenseMultiplier: 1.28, stockSentiment: -0.25 },
  },
  {
    id: 'regulation', title: '業界規制が強化された', icon: '📋', weight: 0.7, isNegative: true,
    description: '政府が業界への新規制を施行。コンプライアンス対応・設備改修・申請費用が急増。また規制により事業の自由度が低下するため「将来の成長余地が減った」と市場が評価して株価が下落。',
    effect: { expenseMultiplier: 1.18, stockSentiment: -0.15 },
  },
  {
    id: 'oil_shock', title: '原油価格急騰でコスト全面高', icon: '🛢️', weight: 0.5, isNegative: true,
    description: '中東情勢の緊迫で原油が急騰。輸送費・電力費・原材料費が連動して高騰し、あらゆる業種のコストが一気に膨らむ。1970年代のオイルショックと同じメカニズム。',
    effect: { expenseMultiplier: 1.22, stockSentiment: -0.20 },
  },
  {
    id: 'war', title: '地政学リスク勃発で輸出路遮断', icon: '💣', weight: 0.4, isNegative: true,
    description: '主要取引国での武力衝突で輸出・調達ルートが遮断。直接被害に加え、「先行きが読めない」不確実性が増すと投資家はリスク回避で株を売るため株価が大幅に下落する。',
    effect: { revenueMultiplier: 0.75, expenseMultiplier: 1.18, stockSentiment: -0.30 },
  },
  {
    id: 'pandemic', title: 'パンデミック発生', icon: '🦠', weight: 0.2, isNegative: true,
    description: '世界規模の感染症が拡大。移動制限・店舗閉鎖・サプライチェーン崩壊が同時に発生。2020年のコロナショックでも世界の株式市場は1ヶ月で30〜40%下落した。',
    effect: { revenueMultiplier: 0.58, expenseMultiplier: 1.28, stockSentiment: -0.40 },
  },
  {
    id: 'market_crash', title: '株式市場が全面暴落', icon: '📊', weight: 0.3, isNegative: true,
    description: 'リーマンショック級の金融危機が発生。業績に関係なく全株式が売られる「総悲観相場」に突入。「Cash is King（現金が王様）」となり投資家は株を一斉に手放す。',
    effect: { stockSentiment: -0.42 },
  },
  {
    id: 'ceo_scandal', title: 'CEO・役員スキャンダルが発覚', icon: '👮', weight: 0.4, isNegative: true,
    description: '経営トップの不正・不倫・横領が報道される。リーダーへの信頼は企業価値の根幹であり、トップが失墜すると「この会社は大丈夫か？」という疑念が広がり株価が急落する。',
    effect: { revenueMultiplier: 0.75, stockSentiment: -0.38 },
  },
  {
    id: 'energy_crisis', title: 'エネルギー危機で電力費が激増', icon: '⚡', weight: 0.5, isNegative: true,
    description: '電力・ガス料金が急騰。工場・サーバー・店舗などエネルギーを使う全ての事業コストが増加。特に製造業やITは電力コストが利益の大きな部分を占めるため打撃が大きい。',
    effect: { expenseMultiplier: 1.18, stockSentiment: -0.16 },
  },
  {
    id: 'deflation', title: 'デフレで値下げ競争に巻き込まれた', icon: '💲', weight: 0.4, isNegative: true,
    description: '物価下落が止まらないデフレ環境に突入。消費者は「待てばもっと安くなる」と購入を先延ばしにし需要が萎縮。値下げ競争で業界全体の利益率が壊滅的になる。',
    effect: { revenueMultiplier: 0.80, stockSentiment: -0.18 },
  },
  {
    id: 'short_attack', title: 'ショートセラーが不正疑惑レポートを公開', icon: '🐻', weight: 0.3, isNegative: true,
    description: '海外ヘッジファンドが「不正会計の疑い」レポートを公開。真偽に関わらず売りが殺到し株価が急落。疑惑否定のための調査・広報費用も発生し二重の打撃を受ける。',
    effect: { stockSentiment: -0.35 },
  },
  {
    id: 'competitor_innovation', title: '競合が革新的技術を発表', icon: '🌙', weight: 0.5, isNegative: true,
    description: '競合が自社の数年先を行く新技術を発表。「この会社は古い技術を使っている」と市場が判断し、乗り換えが起き始める。技術革新は常にどこかで起きているリスク。',
    effect: { revenueMultiplier: 0.80, stockSentiment: -0.25 },
  },
  {
    id: 'counterfeit', title: '偽造品が市場に氾濫', icon: '🎭', weight: 0.4, isNegative: true,
    description: '精巧な偽造品が大量に出回り正規品の売上が蒸発。特に高価格帯のブランド品は偽物が出ると値下げを余儀なくされ、ブランド価値ごと毀損されるリスクがある。',
    effect: { revenueMultiplier: 0.78, stockSentiment: -0.15 },
  },
  {
    id: 'regulatory_fine', title: '規制違反で巨額の行政処分', icon: '💸', weight: 0.4, isNegative: true,
    description: '独占禁止法・個人情報保護法違反で巨額の行政制裁金が課せられた。罰金の支払いで現金が激減するだけでなく「ルールを守らない会社」の印象が株価を長期間抑制する。',
    effect: { expenseMultiplier: 1.32, stockSentiment: -0.28 },
  },
  {
    id: 'natural_disaster', title: '大規模自然災害が直撃', icon: '🌪️', weight: 0.3, isNegative: true,
    description: '台風・洪水・地震などの自然災害が事業拠点を直撃。設備損壊・在庫喪失・操業停止が重なり、保険でカバーしきれない部分が損失として計上される。',
    effect: { revenueMultiplier: 0.68, expenseMultiplier: 1.22, stockSentiment: -0.30 },
  },
  {
    id: 'chip_shortage', title: '半導体不足で生産ラインが停止', icon: '🖥️', weight: 0.4, isNegative: true,
    description: '世界的な半導体不足が深刻化。車・家電・スマホなど多くの製品に使われる半導体が入手困難になり生産が停止。台湾有事や工場火災がきっかけになることが多い。',
    effect: { revenueMultiplier: 0.72, expenseMultiplier: 1.15, stockSentiment: -0.22 },
  },
  {
    id: 'antitrust', title: '独占禁止法調査が開始', icon: '🔍', weight: 0.3, isNegative: true,
    description: '公正取引委員会が独禁法違反疑いで強制調査開始。調査中は経営の自由度が制限される上、罰金・事業分割命令のリスクが顕在化し株価が大幅に下落する。',
    effect: { expenseMultiplier: 1.15, stockSentiment: -0.25 },
  },
  {
    id: 'black_swan', title: 'ブラックスワン：誰も予測できなかった事態', icon: '🦢', weight: 0.1, isNegative: true,
    description: '過去のデータや常識では予測不可能な事態が発生。リーマンショック・9.11・コロナのような「100年に一度」の出来事。どんな優れた経営者もリスクモデルが崩壊する。',
    effect: { revenueMultiplier: 0.62, expenseMultiplier: 1.25, stockSentiment: -0.45 },
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // IT業種 専用イベント
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  { id: 'it_ai_boom',       title: 'AI革命の波に乗った！',          icon: '🤖', weight: 1.2, isNegative: false, condition: { industries: ['IT'] },
    description: '生成AIブームが到来し、自社のAI製品に注文が殺到。ITセクター全体が見直され、株価が急騰した。',
    effect: { revenueMultiplier: 1.38, stockSentiment: 0.28 } },
  { id: 'it_app_viral',     title: 'アプリがApp Storeランキング1位', icon: '📱', weight: 0.9, isNegative: false, condition: { industries: ['IT'] },
    description: '新作アプリがランキング1位を獲得。口コミが拡散し広告費なしで数百万ダウンロードを突破した。',
    effect: { revenueMultiplier: 1.30, stockSentiment: 0.20 } },
  { id: 'it_cloud_deal',    title: '大手企業との大型クラウド契約', icon: '☁️', weight: 0.8, isNegative: false, condition: { industries: ['IT'] },
    description: '年間100億円規模のクラウド契約を締結。安定した収益基盤が確立され投資家の信頼が高まった。',
    effect: { revenueMultiplier: 1.25, stockSentiment: 0.18 } },
  { id: 'it_ipo_client',    title: '主要クライアントがIPO、株価急騰', icon: '🎯', weight: 0.6, isNegative: false, condition: { industries: ['IT'] },
    description: '主要取引先のIPOが成功。取引拡大が期待され関連株として自社株も連れ高した。',
    effect: { revenueMultiplier: 1.15, stockSentiment: 0.22 } },
  { id: 'it_opensrc_hit',   title: 'OSSが世界中のデベロッパーに採用', icon: '🌐', weight: 0.7, isNegative: false, condition: { industries: ['IT'] },
    description: '公開したOSSが世界中で採用され、エンジニアコミュニティで圧倒的な存在感を確立。採用力とブランド力が急上昇。',
    effect: { revenueMultiplier: 1.18, expenseMultiplier: 0.92, stockSentiment: 0.16 } },
  { id: 'it_security_award',title: 'セキュリティ分野で国際賞を受賞', icon: '🏆', weight: 0.5, isNegative: false, condition: { industries: ['IT'] },
    description: 'サイバーセキュリティの国際コンペで最優秀賞。官公庁・金融機関からの引き合いが急増した。',
    effect: { revenueMultiplier: 1.20, stockSentiment: 0.14 } },
  { id: 'it_data_center',   title: 'データセンター増設で処理能力3倍', icon: '🖧', weight: 0.6, isNegative: false, condition: { industries: ['IT'] },
    description: '新データセンターが稼働。処理能力が3倍になり、これまで断っていた大規模案件を受注できるようになった。',
    effect: { revenueMultiplier: 1.22, stockSentiment: 0.12 } },
  { id: 'it_remote_demand', title: 'テレワーク需要爆増でライセンス急増', icon: '🏠', weight: 0.7, isNegative: false, condition: { industries: ['IT'] },
    description: '働き方改革の加速でリモートワークツールの需要が爆増。法人ライセンスの大型契約が相次いだ。',
    effect: { revenueMultiplier: 1.28, stockSentiment: 0.16 } },
  { id: 'it_quantum',       title: '量子コンピューター研究で世界初の成果', icon: '⚛️', weight: 0.3, isNegative: false, condition: { industries: ['IT'] },
    description: '量子コンピューター研究で世界初の実用的成果。数十年後の市場を先取りする技術として株価が跳ね上がった。',
    effect: { revenueMultiplier: 1.12, stockSentiment: 0.35 } },
  { id: 'it_game_collab',   title: '人気ゲームとのコラボが大成功', icon: '🎮', weight: 0.6, isNegative: false, condition: { industries: ['IT'] },
    description: '大人気ゲームとのコラボ企画が大ヒット。新しい顧客層の開拓に成功し、売上が急伸した。',
    effect: { revenueMultiplier: 1.24, stockSentiment: 0.14 } },
  { id: 'it_bug_critical',  title: '重大なバグで主力サービスが停止', icon: '🐛', weight: 1.0, isNegative: true, condition: { industries: ['IT'] },
    description: '主力サービスに重大なバグが発見され24時間サービス停止。売上損失と信頼低下が重なりSNSで大炎上した。',
    effect: { revenueMultiplier: 0.72, stockSentiment: -0.30 } },
  { id: 'it_rival_gafa',    title: 'GAFAが同じ市場に参入を発表', icon: '🔱', weight: 0.8, isNegative: true, condition: { industries: ['IT'] },
    description: '巨大IT企業が自社の主力市場への参入を発表。資本力・ブランド力の差は圧倒的で、株価が急落した。',
    effect: { revenueMultiplier: 0.78, stockSentiment: -0.32 } },
  { id: 'it_talent_war',    title: 'エンジニア争奪戦で人件費が高騰', icon: '💸', weight: 0.8, isNegative: true, condition: { industries: ['IT'] },
    description: 'IT人材不足が深刻化し、エンジニアの給与相場が急上昇。採用・維持コストが急増し利益を圧迫した。',
    effect: { expenseMultiplier: 1.22, stockSentiment: -0.16 } },
  { id: 'it_infra_down',    title: 'クラウドインフラ障害で顧客離れ', icon: '🔴', weight: 0.7, isNegative: true, condition: { industries: ['IT'] },
    description: 'インフラ障害により企業顧客のシステムが停止。SLAを下回ったため違約金の支払いと解約が相次いだ。',
    effect: { revenueMultiplier: 0.76, expenseMultiplier: 1.18, stockSentiment: -0.25 } },
  { id: 'it_privacy_leak',  title: '個人情報1000万件が流出', icon: '🔓', weight: 0.6, isNegative: true, condition: { industries: ['IT'] },
    description: '不正アクセスにより1000万件の個人情報が流出。巨額の制裁金と集団訴訟リスクで株価が暴落した。',
    effect: { expenseMultiplier: 1.30, stockSentiment: -0.35 } },
  { id: 'it_patent_troll',  title: 'パテントトロールから特許訴訟', icon: '⚖️', weight: 0.5, isNegative: true, condition: { industries: ['IT'] },
    description: '特許管理会社から主力製品に対する特許侵害訴訟が提起。和解・ライセンス料・弁護士費用が業績を直撃した。',
    effect: { expenseMultiplier: 1.25, stockSentiment: -0.20 } },
  { id: 'it_regulation_ai', title: 'AI規制法が成立、開発制限に', icon: '🚫', weight: 0.5, isNegative: true, condition: { industries: ['IT'] },
    description: 'AI規制法が施行され、主力製品の機能制限と審査費用が発生。開発ロードマップの大幅な見直しを余儀なくされた。',
    effect: { revenueMultiplier: 0.82, expenseMultiplier: 1.20, stockSentiment: -0.22 } },
  { id: 'it_key_dev_quit',  title: 'CTO・スター開発者が突然退職', icon: '😱', weight: 0.5, isNegative: true, condition: { industries: ['IT'] },
    description: '技術の中核を担うCTOが突然退職を発表。後継者問題と技術力低下の懸念から株価が急落した。',
    effect: { stockSentiment: -0.28 } },
  { id: 'it_crypto_crash',  title: '暗号資産市場の暴落が影響', icon: '₿', weight: 0.4, isNegative: true, condition: { industries: ['IT'] },
    description: '暗号資産市場が90%暴落。Web3関連の収益が消滅し、ブロックチェーン事業が軒並み赤字転落した。',
    effect: { revenueMultiplier: 0.74, stockSentiment: -0.24 } },
  { id: 'it_subscription_churn', title: 'サブスク解約率が急増', icon: '📉', weight: 0.7, isNegative: true, condition: { industries: ['IT'] },
    description: '物価高の影響でサブスクリプションの解約が急増。月次収益が急減し成長性への懸念から株価が下落した。',
    effect: { revenueMultiplier: 0.80, stockSentiment: -0.18 } },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 製造業 専用イベント
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  { id: 'mfg_ev_surge',     title: 'EV需要爆増で部品受注が殺到', icon: '⚡', weight: 1.0, isNegative: false, condition: { industries: ['製造'] },
    description: 'EV市場の急拡大で自社部品への大型受注が殺到。既存の自動車メーカーから数百億円規模の長期契約を締結した。',
    effect: { revenueMultiplier: 1.32, stockSentiment: 0.22 } },
  { id: 'mfg_robot_factory', title: 'ロボット工場が稼働！コスト半減', icon: '🦾', weight: 0.8, isNegative: false, condition: { industries: ['製造'] },
    description: '全自動ロボット工場が完成。人件費が大幅削減され、生産コストが半分以下になった。利益率が業界トップに。',
    effect: { expenseMultiplier: 0.78, stockSentiment: 0.20 } },
  { id: 'mfg_export_win',   title: '輸出が急拡大、円安が追い風', icon: '🚢', weight: 0.9, isNegative: false, condition: { industries: ['製造'] },
    description: '円安が進行し輸出製品の価格競争力が急上昇。海外からの大型受注が相次ぎ、売上が過去最高を更新した。',
    effect: { revenueMultiplier: 1.28, stockSentiment: 0.18 } },
  { id: 'mfg_quality_award',title: 'デミング賞受賞！品質の頂点へ', icon: '🥇', weight: 0.5, isNegative: false, condition: { industries: ['製造'] },
    description: '品質管理の最高峰「デミング賞」を受賞。受賞を機に高価格帯へのシフトが加速し、利益率が大幅改善。',
    effect: { revenueMultiplier: 1.18, stockSentiment: 0.16 } },
  { id: 'mfg_green_cert',   title: 'CO2ゼロ認証で欧州市場に参入', icon: '🌿', weight: 0.6, isNegative: false, condition: { industries: ['製造'] },
    description: 'カーボンニュートラル認証を取得し、環境規制が厳しい欧州市場への参入が実現。新市場で売上が急増した。',
    effect: { revenueMultiplier: 1.22, stockSentiment: 0.14 } },
  { id: 'mfg_nasa_contract',title: 'NASA・防衛省との大型契約', icon: '🚀', weight: 0.4, isNegative: false, condition: { industries: ['製造'] },
    description: '高精度部品の実力が認められ、宇宙・防衛分野の超高単価契約を獲得。利益率が一気に改善した。',
    effect: { revenueMultiplier: 1.25, stockSentiment: 0.20 } },
  { id: 'mfg_3d_print',     title: '3Dプリント技術で試作期間を90%短縮', icon: '🖨️', weight: 0.6, isNegative: false, condition: { industries: ['製造'] },
    description: '金属3Dプリンターの活用で試作期間が大幅短縮。顧客の開発速度が上がり、引き合いが急増した。',
    effect: { revenueMultiplier: 1.16, expenseMultiplier: 0.90, stockSentiment: 0.12 } },
  { id: 'mfg_rare_earth',   title: 'レアアース代替材料を開発', icon: '💎', weight: 0.5, isNegative: false, condition: { industries: ['製造'] },
    description: '中国依存から脱却するレアアース代替材料の開発に成功。素材コストが大幅減少し、競争優位が確立された。',
    effect: { expenseMultiplier: 0.85, stockSentiment: 0.18 } },
  { id: 'mfg_infra_order',  title: '国家インフラ整備の大型受注', icon: '🏗️', weight: 0.6, isNegative: false, condition: { industries: ['製造'] },
    description: '国の大型インフラ整備計画に採択。数年にわたる安定した大型受注が確定し、業績見通しが大幅に上方修正された。',
    effect: { revenueMultiplier: 1.24, stockSentiment: 0.16 } },
  { id: 'mfg_medtech_hit',  title: '医療機器が薬事承認を取得', icon: '🏥', weight: 0.5, isNegative: false, condition: { industries: ['製造'] },
    description: '開発中の医療機器が薬事承認を取得。高価格・高利益率の医療分野への参入が実現し、事業の柱が一本増えた。',
    effect: { revenueMultiplier: 1.20, stockSentiment: 0.22 } },
  { id: 'mfg_factory_fire', title: '主力工場で火災が発生', icon: '🔥', weight: 0.7, isNegative: true, condition: { industries: ['製造'] },
    description: '主力工場で大規模火災が発生し生産ラインが全停止。復旧まで3ヶ月かかる見通しで、受注キャンセルが相次いだ。',
    effect: { revenueMultiplier: 0.55, expenseMultiplier: 1.30, stockSentiment: -0.40 } },
  { id: 'mfg_china_ban',    title: '中国からの輸入禁止措置', icon: '🚫', weight: 0.7, isNegative: true, condition: { industries: ['製造'] },
    description: '主要部材を輸入していた中国が禁輸措置を発動。代替調達に数ヶ月かかる見通しで生産が大幅に遅延した。',
    effect: { revenueMultiplier: 0.72, expenseMultiplier: 1.20, stockSentiment: -0.25 } },
  { id: 'mfg_recall_big',   title: '主力製品に安全欠陥、大規模リコール', icon: '🚨', weight: 0.6, isNegative: true, condition: { industries: ['製造'] },
    description: '出荷済み製品に安全上の重大欠陥が発見され全品回収命令。回収・補償費用と生産停止が重なり業績が急悪化。',
    effect: { revenueMultiplier: 0.65, expenseMultiplier: 1.35, stockSentiment: -0.38 } },
  { id: 'mfg_labor_strike', title: '工場労働者が全員ストライキ', icon: '🪧', weight: 0.7, isNegative: true, condition: { industries: ['製造'] },
    description: '待遇改善を求める工場労働者が無期限スト。生産が完全停止し、顧客への納期遅延で違約金が発生した。',
    effect: { revenueMultiplier: 0.60, expenseMultiplier: 1.25, stockSentiment: -0.30 } },
  { id: 'mfg_material_cost',title: '原材料費が50%高騰', icon: '📦', weight: 0.9, isNegative: true, condition: { industries: ['製造'] },
    description: '鉄・アルミ・銅などの原材料費が急騰。製造原価が大幅上昇し、価格転嫁できず利益が急減した。',
    effect: { expenseMultiplier: 1.28, stockSentiment: -0.18 } },
  { id: 'mfg_quality_issue',title: '品質不正が発覚、認定取り消し', icon: '⚠️', weight: 0.5, isNegative: true, condition: { industries: ['製造'] },
    description: '品質検査データの改ざんが発覚し、業界認定が取り消された。取引先の信頼が失墜し大口契約が相次いでキャンセルされた。',
    effect: { revenueMultiplier: 0.68, stockSentiment: -0.42 } },
  { id: 'mfg_automation_fail',title: '自動化投資が失敗、稼働率ゼロ', icon: '🤖', weight: 0.4, isNegative: true, condition: { industries: ['製造'] },
    description: '大規模な自動化ライン導入が技術的問題で完全失敗。設備費用が無駄になり、当初の生産能力にも戻れない状態に。',
    effect: { revenueMultiplier: 0.70, expenseMultiplier: 1.22, stockSentiment: -0.28 } },
  { id: 'mfg_env_penalty',  title: '環境規制違反で操業停止命令', icon: '🌍', weight: 0.4, isNegative: true, condition: { industries: ['製造'] },
    description: '工場の排水・排気基準違反が発覚し、行政から操業停止命令。設備改修が完了するまで生産できない状態が続く。',
    effect: { revenueMultiplier: 0.64, expenseMultiplier: 1.20, stockSentiment: -0.35 } },
  { id: 'mfg_competitor_cut', title: '中国メーカーが半値で参入', icon: '⚔️', weight: 0.8, isNegative: true, condition: { industries: ['製造'] },
    description: '中国メーカーが政府補助金を背景に半値での価格攻勢を開始。コスト競争力がなく、シェアが急速に奪われた。',
    effect: { revenueMultiplier: 0.76, stockSentiment: -0.20 } },
  { id: 'mfg_patent_expired', title: '主力製品の特許が切れ模倣品が氾濫', icon: '📋', weight: 0.6, isNegative: true, condition: { industries: ['製造'] },
    description: '主力製品の基幹特許が期限切れ。一斉に参入した模倣品メーカーとの価格競争で利益率が激落した。',
    effect: { revenueMultiplier: 0.80, stockSentiment: -0.15 } },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 飲食業 専用イベント
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  { id: 'food_michelin',    title: 'ミシュランの星を獲得！', icon: '⭐', weight: 0.5, isNegative: false, condition: { industries: ['飲食'] },
    description: 'ミシュランガイドで星を獲得。世界中からの予約が殺到し、メディア露出も急増。ブランド価値が一夜にして急上昇した。',
    effect: { revenueMultiplier: 1.40, stockSentiment: 0.24 } },
  { id: 'food_viral_dish',  title: 'TikTokでメニューが世界拡散', icon: '📱', weight: 0.9, isNegative: false, condition: { industries: ['飲食'] },
    description: '新メニューの動画がTikTokで世界拡散。行列が連日続き、フランチャイズ希望も急増。',
    effect: { revenueMultiplier: 1.30, stockSentiment: 0.18 } },
  { id: 'food_celeb_visit', title: '著名人が来店、SNSで話題沸騰', icon: '🌟', weight: 0.7, isNegative: false, condition: { industries: ['飲食'] },
    description: '有名人が自社店舗を訪れSNSに投稿。フォロワー数百万人への拡散で新規顧客が殺到した。',
    effect: { revenueMultiplier: 1.22, stockSentiment: 0.14 } },
  { id: 'food_fc_boom',     title: 'フランチャイズ契約が急増', icon: '🏪', weight: 0.8, isNegative: false, condition: { industries: ['飲食'] },
    description: 'ブランド力の高まりでFC加盟希望が殺到。ロイヤリティ収入が急増し、リスクなく店舗数が拡大した。',
    effect: { revenueMultiplier: 1.28, stockSentiment: 0.16 } },
  { id: 'food_export',      title: '海外展開が大成功、行列が絶えない', icon: '🌏', weight: 0.6, isNegative: false, condition: { industries: ['飲食'] },
    description: '海外出店した店舗で連日行列が発生。「日本食ブーム」の波に乗り、現地メディアにも多数取り上げられた。',
    effect: { revenueMultiplier: 1.25, stockSentiment: 0.18 } },
  { id: 'food_collab_hit',  title: '大手コンビニとのコラボが大ヒット', icon: '🏬', weight: 0.7, isNegative: false, condition: { industries: ['飲食'] },
    description: '大手コンビニとのコラボ商品が大ヒット。全国の棚に並んだことで認知度と売上が一気に拡大した。',
    effect: { revenueMultiplier: 1.24, stockSentiment: 0.14 } },
  { id: 'food_health_trend',title: 'ヘルシーブームで需要爆増', icon: '🥗', weight: 0.8, isNegative: false, condition: { industries: ['飲食'] },
    description: '健康志向ブームが到来し、自社のヘルシーメニューに注文が殺到。競合が追いつく前に一気にシェアを獲得した。',
    effect: { revenueMultiplier: 1.26, stockSentiment: 0.16 } },
  { id: 'food_delivery_win',title: 'デリバリー参入で売上が1.5倍', icon: '🛵', weight: 0.8, isNegative: false, condition: { industries: ['飲食'] },
    description: '大手デリバリーサービスへの参入が奏功。店内飲食と合わせて売上が1.5倍に拡大。',
    effect: { revenueMultiplier: 1.20, stockSentiment: 0.12 } },
  { id: 'food_premium_line',title: 'プレミアムライン発売、客単価が2倍', icon: '💎', weight: 0.6, isNegative: false, condition: { industries: ['飲食'] },
    description: '高単価プレミアムラインを投入。富裕層顧客の獲得に成功し、客単価と利益率が大幅に改善した。',
    effect: { revenueMultiplier: 1.22, expenseMultiplier: 0.95, stockSentiment: 0.14 } },
  { id: 'food_frozen_hit',  title: '冷凍食品の市販化が大ヒット', icon: '🧊', weight: 0.6, isNegative: false, condition: { industries: ['飲食'] },
    description: '人気メニューを冷凍食品化してスーパー展開。店舗に来られない潜在顧客を取り込み売上が大幅増加。',
    effect: { revenueMultiplier: 1.20, stockSentiment: 0.12 } },
  { id: 'food_poisoning',   title: '食中毒事件が発覚、全店閉鎖', icon: '🤢', weight: 0.8, isNegative: true, condition: { industries: ['飲食'] },
    description: '集団食中毒が発生し保健所から全店舗の営業停止命令。補償・改修・風評対策に巨額費用がかかった。',
    effect: { revenueMultiplier: 0.42, expenseMultiplier: 1.35, stockSentiment: -0.50 } },
  { id: 'food_ingredient_shortage', title: '主要食材が入手不能', icon: '🌾', weight: 0.8, isNegative: true, condition: { industries: ['飲食'] },
    description: '凶作・輸入規制で主要食材が入手不能に。代替食材で品質が低下し、顧客離れが発生した。',
    effect: { revenueMultiplier: 0.76, expenseMultiplier: 1.20, stockSentiment: -0.22 } },
  { id: 'food_cockroach',   title: '異物混入がSNSで拡散', icon: '😱', weight: 0.7, isNegative: true, condition: { industries: ['飲食'] },
    description: '飲食物への異物混入がSNSで拡散。謝罪会見を行ったが炎上は収まらず、既存顧客の大半が離脱した。',
    effect: { revenueMultiplier: 0.60, stockSentiment: -0.42 } },
  { id: 'food_price_hike',  title: '原材料費高騰で値上げを断行', icon: '💴', weight: 0.9, isNegative: true, condition: { industries: ['飲食'] },
    description: '食材費の高騰を受け大幅値上げを断行。来客数が急減し、特に客単価の低かったファミリー層が離脱した。',
    effect: { revenueMultiplier: 0.80, stockSentiment: -0.18 } },
  { id: 'food_competitor',  title: '大手チェーンが激安攻勢', icon: '⚔️', weight: 0.8, isNegative: true, condition: { industries: ['飲食'] },
    description: '大手チェーンが資本力を背景に激安キャンペーンを展開。価格競争に巻き込まれ収益が激減した。',
    effect: { revenueMultiplier: 0.78, stockSentiment: -0.20 } },
  { id: 'food_staff_short', title: 'アルバイト不足で店舗が開けられない', icon: '👷', weight: 0.8, isNegative: true, condition: { industries: ['飲食'] },
    description: '人手不足が深刻化し、複数店舗が閉店を余儀なくされた。時給を大幅引き上げたが採用が追いつかない状態。',
    effect: { revenueMultiplier: 0.72, expenseMultiplier: 1.15, stockSentiment: -0.20 } },
  { id: 'food_hygiene_fail',title: '衛生検査で不合格、営業許可取り消し', icon: '🚫', weight: 0.5, isNegative: true, condition: { industries: ['飲食'] },
    description: '保健所の衛生検査で複数店舗が不合格。営業許可取り消しとなり、大規模な設備改修を強いられた。',
    effect: { revenueMultiplier: 0.65, expenseMultiplier: 1.25, stockSentiment: -0.32 } },
  { id: 'food_bad_review',  title: 'グルメサイトで最低評価が拡散', icon: '⭐', weight: 0.6, isNegative: true, condition: { industries: ['飲食'] },
    description: '有名グルメサイトで低評価レビューが集中投稿。「不味い・サービスが最悪」の評判が広まり来客が急減した。',
    effect: { revenueMultiplier: 0.75, stockSentiment: -0.16 } },
  { id: 'food_lease_end',   title: '好立地の複数店舗で賃貸契約が終了', icon: '🏢', weight: 0.5, isNegative: true, condition: { industries: ['飲食'] },
    description: '好立地の旗艦店舗の賃貸契約が次々と終了。代替物件が見つからず売上の柱が一気に崩れた。',
    effect: { revenueMultiplier: 0.78, stockSentiment: -0.15 } },
  { id: 'food_no_show',     title: '大型予約がすべてドタキャン', icon: '📵', weight: 0.5, isNegative: true, condition: { industries: ['飲食'] },
    description: '年末繁忙期の大型予約が相次いでキャンセル。食材の廃棄ロスと売上損失で四半期業績が大幅悪化した。',
    effect: { revenueMultiplier: 0.76, expenseMultiplier: 1.12, stockSentiment: -0.14 } },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 金融業 専用イベント
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  { id: 'fin_rate_rise_win',title: '利上げで利ざやが大幅拡大', icon: '📈', weight: 1.0, isNegative: false, condition: { industries: ['金融'] },
    description: '日銀の利上げにより貸出金利と預金金利の差（利ざや）が拡大。銀行・消費者金融の収益が一気に改善した。',
    effect: { revenueMultiplier: 1.30, stockSentiment: 0.22 } },
  { id: 'fin_ipo_rush',     title: 'IPOラッシュで引受手数料が急増', icon: '🎊', weight: 0.8, isNegative: false, condition: { industries: ['金融'] },
    description: '株式市場の活況でIPO件数が急増。証券引受業務の手数料収入が過去最高を更新した。',
    effect: { revenueMultiplier: 1.28, stockSentiment: 0.18 } },
  { id: 'fin_m_and_a',      title: 'M&A仲介で大型手数料を獲得', icon: '🤝', weight: 0.7, isNegative: false, condition: { industries: ['金融'] },
    description: '数千億円規模のM&A案件の仲介に成功。一件で年間利益に匹敵する手数料収入を獲得した。',
    effect: { revenueMultiplier: 1.32, stockSentiment: 0.20 } },
  { id: 'fin_fintech_win',  title: 'フィンテック革新で顧客が急増', icon: '📲', weight: 0.8, isNegative: false, condition: { industries: ['金融'] },
    description: 'スマホ決済・アプリ投資サービスが大ヒット。若年層の新規顧客を大量獲得し、将来の収益基盤が急拡大した。',
    effect: { revenueMultiplier: 1.24, stockSentiment: 0.16 } },
  { id: 'fin_nisa_boom',    title: 'NISA拡充で口座開設が激増', icon: '💹', weight: 0.9, isNegative: false, condition: { industries: ['金融'] },
    description: 'NISA制度の拡充を受け口座開設数が急増。運用手数料と取引手数料の収益が大幅に拡大した。',
    effect: { revenueMultiplier: 1.26, stockSentiment: 0.18 } },
  { id: 'fin_overseas_win', title: '海外機関投資家からの大型運用委託', icon: '🌏', weight: 0.6, isNegative: false, condition: { industries: ['金融'] },
    description: '海外の大型年金基金・政府系ファンドから数千億円の運用を受託。安定した高収益が長期的に確保された。',
    effect: { revenueMultiplier: 1.22, stockSentiment: 0.20 } },
  { id: 'fin_crypto_adopt', title: '暗号資産サービスが爆発的ヒット', icon: '₿', weight: 0.6, isNegative: false, condition: { industries: ['金融'] },
    description: '暗号資産取引サービスを早期に立ち上げたことで、若年層を中心に顧客が爆増。手数料収入が急増した。',
    effect: { revenueMultiplier: 1.24, stockSentiment: 0.14 } },
  { id: 'fin_bancassurance', title: '保険との相互販売で収益が多様化', icon: '🛡️', weight: 0.5, isNegative: false, condition: { industries: ['金融'] },
    description: '保険会社との提携販売が軌道に乗り、手数料収入が急増。収益の柱が増え安定性が高まったと評価された。',
    effect: { revenueMultiplier: 1.18, stockSentiment: 0.12 } },
  { id: 'fin_ai_trading',   title: 'AI自動取引で運用成績がトップに', icon: '🤖', weight: 0.5, isNegative: false, condition: { industries: ['金融'] },
    description: '開発したAI自動取引システムが市場平均を大幅に上回る成績を達成。運用資産残高が急増した。',
    effect: { revenueMultiplier: 1.20, stockSentiment: 0.16 } },
  { id: 'fin_bond_rally',   title: '債券価格が急上昇、保有資産が膨張', icon: '📊', weight: 0.6, isNegative: false, condition: { industries: ['金融'] },
    description: '利下げ局面で保有債券の価格が急上昇。含み益が膨らみ、自己資本比率と株価が連動して上昇した。',
    effect: { revenueMultiplier: 1.18, stockSentiment: 0.20 } },
  { id: 'fin_bad_loans',    title: '不良債権が急増、引当金を積み増し', icon: '💸', weight: 0.9, isNegative: true, condition: { industries: ['金融'] },
    description: '景気悪化で融資先の倒産が急増し不良債権が膨張。引当金の積み増しで利益が急減し、投資家が懸念した。',
    effect: { revenueMultiplier: 0.72, expenseMultiplier: 1.25, stockSentiment: -0.30 } },
  { id: 'fin_crypto_crash', title: '暗号資産の暴落で多額の損失', icon: '📉', weight: 0.7, isNegative: true, condition: { industries: ['金融'] },
    description: '保有していた暗号資産が90%以上暴落。時価評価損が決算を直撃し、投資判断の甘さが批判された。',
    effect: { revenueMultiplier: 0.68, stockSentiment: -0.40 } },
  { id: 'fin_fraud',        title: '行員による横領・不正が発覚', icon: '👮', weight: 0.6, isNegative: true, condition: { industries: ['金融'] },
    description: '行員による数十億円の横領が発覚。金融機関の信頼は根幹であり、不正は顧客流出と株価暴落を引き起こす。',
    effect: { revenueMultiplier: 0.75, expenseMultiplier: 1.20, stockSentiment: -0.42 } },
  { id: 'fin_fsr_order',    title: '金融庁から業務停止命令', icon: '🚫', weight: 0.4, isNegative: true, condition: { industries: ['金融'] },
    description: '金融庁の検査で法令違反が指摘され、一部業務の停止命令を受けた。金融機関にとって最悪のリスクが顕在化。',
    effect: { revenueMultiplier: 0.60, expenseMultiplier: 1.25, stockSentiment: -0.45 } },
  { id: 'fin_cyber_heist',  title: 'サイバー攻撃で顧客資産が盗難', icon: '🔒', weight: 0.5, isNegative: true, condition: { industries: ['金融'] },
    description: 'ハッカーによるサイバー攻撃で顧客の金融資産が盗難。補償費用と信頼失墜で株価が急落した。',
    effect: { expenseMultiplier: 1.35, stockSentiment: -0.40 } },
  { id: 'fin_fintech_rival',title: 'ノーバンクが若者顧客を根こそぎ獲得', icon: '⚔️', weight: 0.7, isNegative: true, condition: { industries: ['金融'] },
    description: 'スマホ完結型の新興フィンテック企業が台頭。手数料無料・使いやすさで若年層顧客を根こそぎ奪われた。',
    effect: { revenueMultiplier: 0.80, stockSentiment: -0.22 } },
  { id: 'fin_margin_call',  title: 'レバレッジ投資家の連鎖破産', icon: '💣', weight: 0.5, isNegative: true, condition: { industries: ['金融'] },
    description: '相場急落でレバレッジ顧客の証拠金が不足し連鎖強制決済が発生。回収不能な損失が自社決算に飛び火した。',
    effect: { revenueMultiplier: 0.74, expenseMultiplier: 1.18, stockSentiment: -0.28 } },
  { id: 'fin_rate_down',    title: 'マイナス金利継続で利ざやが消滅', icon: '📊', weight: 0.8, isNegative: true, condition: { industries: ['金融'] },
    description: '超低金利政策が継続され、貸出金利と調達コストの差が消滅。銀行・保険の収益モデルが根底から崩れた。',
    effect: { revenueMultiplier: 0.78, stockSentiment: -0.25 } },
  { id: 'fin_lawsuit_class',title: '投資被害者から集団訴訟', icon: '⚖️', weight: 0.4, isNegative: true, condition: { industries: ['金融'] },
    description: '不適切な投資勧誘で損失を出した顧客が集団訴訟を提起。賠償額・風評被害ともに甚大で長期間業績を圧迫する。',
    effect: { expenseMultiplier: 1.30, stockSentiment: -0.32 } },
  { id: 'fin_rating_cut',   title: '格付け機関が信用格付けを引き下げ', icon: '🔻', weight: 0.5, isNegative: true, condition: { industries: ['金融'] },
    description: '大手格付け機関が財務悪化を理由に格付けを2段階引き下げ。調達コストが上昇し機関投資家が一斉に売却した。',
    effect: { expenseMultiplier: 1.15, stockSentiment: -0.35 } },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // エンタメ業 専用イベント
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  { id: 'ent_mega_hit',     title: '映画・ゲームが世界的大ヒット', icon: '🎬', weight: 0.9, isNegative: false, condition: { industries: ['エンタメ'] },
    description: '制作した作品が全世界でメガヒット。興行収入・ダウンロード数ともに歴代記録を更新し関連グッズも完売。',
    effect: { revenueMultiplier: 1.45, stockSentiment: 0.30 } },
  { id: 'ent_ip_collab',    title: '超人気IPとのコラボが実現', icon: '🤝', weight: 0.8, isNegative: false, condition: { industries: ['エンタメ'] },
    description: '世界的人気キャラクターIPとのコラボが成立。ファンダムへのリーチと関連商品の売上が爆増した。',
    effect: { revenueMultiplier: 1.32, stockSentiment: 0.22 } },
  { id: 'ent_streamer_deal',title: '大手動画配信と独占配信契約', icon: '▶️', weight: 0.8, isNegative: false, condition: { industries: ['エンタメ'] },
    description: 'Netflixクラスの大手プラットフォームと独占配信契約を締結。制作費回収に加え安定した権利収益が確保された。',
    effect: { revenueMultiplier: 1.28, stockSentiment: 0.18 } },
  { id: 'ent_idol_debut',   title: '新人アイドルがデビューで社会現象', icon: '🎤', weight: 0.7, isNegative: false, condition: { industries: ['エンタメ'] },
    description: '新人グループのデビューが社会現象レベルのヒット。グッズ・ライブチケット・配信が軒並み完売。',
    effect: { revenueMultiplier: 1.30, stockSentiment: 0.20 } },
  { id: 'ent_esports',      title: 'eスポーツ部門が世界大会で優勝', icon: '🏆', weight: 0.6, isNegative: false, condition: { industries: ['エンタメ'] },
    description: 'eスポーツチームが世界大会で優勝。スポンサー収入・視聴者数・グッズ売上が一気に急増した。',
    effect: { revenueMultiplier: 1.24, stockSentiment: 0.16 } },
  { id: 'ent_theme_park',   title: 'テーマパーク入場者数が過去最高', icon: '🎢', weight: 0.7, isNegative: false, condition: { industries: ['エンタメ'] },
    description: '新アトラクション投入が功を奏し入場者数が過去最高を更新。外国人観光客の増加も追い風となった。',
    effect: { revenueMultiplier: 1.26, stockSentiment: 0.16 } },
  { id: 'ent_award_sweep',  title: 'アカデミー・グラミーを受賞', icon: '🏅', weight: 0.5, isNegative: false, condition: { industries: ['エンタメ'] },
    description: '自社作品が国際的な権威ある賞を受賞。作品の価値が再評価され、バックカタログの収益も急増した。',
    effect: { revenueMultiplier: 1.22, stockSentiment: 0.18 } },
  { id: 'ent_merchandise',  title: 'キャラクター商品が爆発的ヒット', icon: '🧸', weight: 0.8, isNegative: false, condition: { industries: ['エンタメ'] },
    description: 'キャラクターグッズがSNSで話題となり、限定商品が転売プレミア価格に。ライセンス収入が大幅増加した。',
    effect: { revenueMultiplier: 1.24, stockSentiment: 0.14 } },
  { id: 'ent_live_comeback',title: 'コンサートツアーで100億円を達成', icon: '🎵', weight: 0.6, isNegative: false, condition: { industries: ['エンタメ'] },
    description: 'ライブ・コンサートツアーの収益が100億円を突破。グッズ・配信も好調で収益が多角化した。',
    effect: { revenueMultiplier: 1.28, stockSentiment: 0.18 } },
  { id: 'ent_game_gacha',   title: 'ソシャゲの新イベントが課金爆増', icon: '🎲', weight: 0.7, isNegative: false, condition: { industries: ['エンタメ'] },
    description: 'スマホゲームの新イベントが大好評で課金額が過去最高を更新。月次収益が急増し株価が上昇した。',
    effect: { revenueMultiplier: 1.30, stockSentiment: 0.16 } },
  { id: 'ent_flop',         title: '大作が大コケ、制作費が回収不能', icon: '💸', weight: 0.8, isNegative: true, condition: { industries: ['エンタメ'] },
    description: '数十億円をかけた大作が大失敗。投資の大半が回収不能となり、今後の制作計画も見直しを迫られた。',
    effect: { revenueMultiplier: 0.60, stockSentiment: -0.40 } },
  { id: 'ent_talent_scandal', title: 'トップタレントがスキャンダル', icon: '📰', weight: 0.8, isNegative: true, condition: { industries: ['エンタメ'] },
    description: '看板タレントのスキャンダルが発覚。スポンサーが全て降板し、関連CM・イベントが一斉にキャンセルされた。',
    effect: { revenueMultiplier: 0.62, expenseMultiplier: 1.15, stockSentiment: -0.45 } },
  { id: 'ent_piracy',       title: '海賊版が氾濫し売上が蒸発', icon: '🏴‍☠️', weight: 0.7, isNegative: true, condition: { industries: ['エンタメ'] },
    description: '主力コンテンツの海賊版が氾濫。違法ダウンロードが正規販売を大幅に上回り、収益が激減した。',
    effect: { revenueMultiplier: 0.70, stockSentiment: -0.25 } },
  { id: 'ent_streaming_war',title: '大手配信サービスとの争奪戦に敗北', icon: '⚔️', weight: 0.7, isNegative: true, condition: { industries: ['エンタメ'] },
    description: '大手プラットフォームとのコンテンツ争奪戦に完敗。独自プラットフォームの加入者が急減した。',
    effect: { revenueMultiplier: 0.76, stockSentiment: -0.28 } },
  { id: 'ent_copyright',    title: '著作権侵害訴訟で巨額の賠償命令', icon: '⚖️', weight: 0.5, isNegative: true, condition: { industries: ['エンタメ'] },
    description: '主力作品に著作権侵害が認定され、巨額の損害賠償を命じられた。作品の販売差し止めで収益が消滅した。',
    effect: { expenseMultiplier: 1.32, stockSentiment: -0.35 } },
  { id: 'ent_talent_quit',  title: '主力タレント・制作チームが独立', icon: '🚪', weight: 0.6, isNegative: true, condition: { industries: ['エンタメ'] },
    description: '人気タレントと有名クリエイターが独立。ファンも一緒に移動し、主要コンテンツの集客力が消滅した。',
    effect: { revenueMultiplier: 0.68, stockSentiment: -0.35 } },
  { id: 'ent_tone_deaf',    title: '炎上商法が逆効果で不買運動に', icon: '🔥', weight: 0.6, isNegative: true, condition: { industries: ['エンタメ'] },
    description: '話題作りを狙ったキャンペーンが時代錯誤と炎上。不買運動が組織化され、スポンサーも撤退した。',
    effect: { revenueMultiplier: 0.65, stockSentiment: -0.40 } },
  { id: 'ent_concert_cancel', title: '大規模ライブが直前で全公演中止', icon: '🎤', weight: 0.5, isNegative: true, condition: { industries: ['エンタメ'] },
    description: '主演アーティストの体調不良でツアー全公演が直前中止。払い戻し費用と逸失収益で多大な損失が発生した。',
    effect: { revenueMultiplier: 0.72, expenseMultiplier: 1.20, stockSentiment: -0.25 } },
  { id: 'ent_addiction_law',title: 'ゲーム依存規制法が施行', icon: '🚫', weight: 0.5, isNegative: true, condition: { industries: ['エンタメ'] },
    description: 'ゲーム依存防止法が施行されプレイ時間・課金額に上限が設定。ソシャゲ収益が大幅に減少した。',
    effect: { revenueMultiplier: 0.74, stockSentiment: -0.22 } },
  { id: 'ent_venue_closure',title: '主要ライブ会場が耐震問題で閉鎖', icon: '🏟️', weight: 0.4, isNegative: true, condition: { industries: ['エンタメ'] },
    description: '主要公演会場が耐震基準未達で突然閉鎖。予定していた公演が全てキャンセルとなり収益計画が崩壊した。',
    effect: { revenueMultiplier: 0.75, stockSentiment: -0.18 } },
]

export function createInitialFinancials(): Financials {
  return {
    revenue:  50_000_000,
    expenses: 42_000_000,
    profit:   8_000_000,
    cash:     80_000_000,
    assets:   160_000_000,
    shares:   1_000_000,
    eps:      8,
  }
}

export function calcStockPrice(
  financials: Financials,
  industry: Industry,
  sentiment: number,
): number {
  const { per } = INDUSTRY_STATS[industry]
  const base = Math.max(financials.eps * per, 100)
  const noise = 1 + (Math.random() - 0.5) * 0.12
  return Math.round(base * (1 + sentiment) * noise)
}

export function processTurn(
  state: GameState,
  allocation: Allocation,
): { newState: GameState; report: TurnReport } {
  const { company, financials, turn, marketSentiment, difficulty } = state
  if (!company) throw new Error('No company')

  const cfg = DIFFICULTY_CONFIG[difficulty]
  const { growth } = INDUSTRY_STATS[company.industry]
  const budget = allocation.rd + allocation.marketing + allocation.hiring + allocation.capex + allocation.dividend
  const event = pickEvent(difficulty, allocation, budget)
  const budgetRatio = Math.min(budget / financials.cash, 1)

  const rdBonus    = budget > 0 ? 1 + (allocation.rd        / budget) * 0.25 : 1
  const mktBonus   = budget > 0 ? 1 + (allocation.marketing / budget) * 0.30 : 1
  const hireBonus  = budget > 0 ? 1 + (allocation.hiring    / budget) * 0.12 : 1
  const capexBonus = budget > 0 ? 1 + (allocation.capex     / budget) * 0.15 : 1

  const baseCostGrowth = cfg.costGrowth + budgetRatio * 0.04

  let revenueMultiplier = growth * rdBonus * mktBonus * hireBonus * capexBonus
  let expenseMultiplier = baseCostGrowth

  if (event) {
    revenueMultiplier *= event.effect.revenueMultiplier ?? 1
    expenseMultiplier *= event.effect.expenseMultiplier ?? 1
  }

  const revNoise = (1 - cfg.revNoiseMult) + Math.random() * cfg.revNoiseMult * 2
  const newRevenue  = Math.round(financials.revenue  * revenueMultiplier * revNoise)
  const newExpenses = Math.round(financials.expenses * expenseMultiplier)
  const newProfit   = newRevenue - newExpenses
  const newCash     = financials.cash - budget + newProfit
  const newAssets   = financials.assets + newProfit + allocation.capex * 0.8
  const newEps      = Math.round(newProfit / financials.shares)

  const newFinancials: Financials = {
    revenue:  newRevenue,
    expenses: newExpenses,
    profit:   newProfit,
    cash:     Math.max(newCash, 0),
    assets:   newAssets,
    shares:   financials.shares,
    eps:      newEps,
  }

  const eventSentiment = event?.effect.stockSentiment ?? 0
  const decayRate = difficulty === 'easy' ? 0.70 : difficulty === 'normal' ? 0.60 : difficulty === 'hard' ? 0.50 : 0.40
  const negBias = difficulty === 'easy' ? 0.50 : difficulty === 'normal' ? 0.52 : difficulty === 'hard' ? 0.55 : 0.58
  const newSentiment = Math.max(-0.6, Math.min(0.5,
    marketSentiment * decayRate + eventSentiment + (Math.random() - negBias) * 0.08,
  ))
  const newStockPrice = calcStockPrice(newFinancials, company.industry, newSentiment)

  const label = `Q${((turn - 1) % 4) + 1} Y${Math.ceil(turn / 4)}`
  const newHistory = [...state.stockHistory, { turn, price: newStockPrice, label }]

  const report: TurnReport = { turn, financials: newFinancials, stockPrice: newStockPrice, event, allocation }

  const isBankrupt = newCash <= 0
  const isGameOver = isBankrupt || turn >= state.maxTurns

  const newState: GameState = {
    ...state,
    turn: turn + 1,
    financials: newFinancials,
    stockHistory: newHistory,
    currentAllocation: { rd: 0, marketing: 0, hiring: 0, capex: 0, dividend: 0 },
    reports: [...state.reports, report],
    pendingEvent: null,
    marketSentiment: newSentiment,
    phase: isGameOver ? 'gameover' : 'playing',
    bankrupted: isBankrupt,
  }

  return { newState, report }
}

function pickEvent(difficulty: Difficulty, allocation: Allocation, budget: number): GameEvent | null {
  const { eventRate, negBias } = DIFFICULTY_CONFIG[difficulty]
  if (Math.random() > eventRate) return null

  const pct = {
    rd:        budget > 0 ? (allocation.rd        / budget) * 100 : 0,
    marketing: budget > 0 ? (allocation.marketing / budget) * 100 : 0,
    hiring:    budget > 0 ? (allocation.hiring    / budget) * 100 : 0,
    capex:     budget > 0 ? (allocation.capex     / budget) * 100 : 0,
  }

  const eligible = EVENTS.filter(e => {
    const c = e.condition
    if (!c) return true
    if (c.minRd        !== undefined && pct.rd        < c.minRd)        return false
    if (c.maxRd        !== undefined && pct.rd        > c.maxRd)        return false
    if (c.minMarketing !== undefined && pct.marketing < c.minMarketing) return false
    if (c.maxMarketing !== undefined && pct.marketing > c.maxMarketing) return false
    if (c.minHiring    !== undefined && pct.hiring    < c.minHiring)    return false
    if (c.maxHiring    !== undefined && pct.hiring    > c.maxHiring)    return false
    if (c.minCapex     !== undefined && pct.capex     < c.minCapex)     return false
    if (c.maxCapex     !== undefined && pct.capex     > c.maxCapex)     return false
    return true
  })

  if (eligible.length === 0) return null

  const total = eligible.reduce((s, e) => s + (e.isNegative ? e.weight * negBias : e.weight), 0)
  let r = Math.random() * total
  for (const e of eligible) {
    r -= e.isNegative ? e.weight * negBias : e.weight
    if (r <= 0) return e
  }
  return eligible[eligible.length - 1]
}

export function formatMoney(n: number): string {
  if (Math.abs(n) >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B円`
  if (Math.abs(n) >= 1_000_000)     return `${(n / 1_000_000).toFixed(0)}M円`
  if (Math.abs(n) >= 1_000)         return `${(n / 1_000).toFixed(0)}K円`
  return `${n}円`
}

export function getRating(
  stockHistory: GameState['stockHistory'],
  difficulty: Difficulty,
  bankrupted?: boolean,
): { grade: string; message: string } {
  // 倒産した場合は強制Fランク
  if (bankrupted) return { grade: 'F', message: '倒産。資金が尽きて経営が続けられなかった…' }
  if (stockHistory.length < 2) return { grade: 'C', message: 'データ不足' }
  const first = stockHistory[0].price
  const last  = stockHistory[stockHistory.length - 1].price
  const growth = (last - first) / first
  const cfg = DIFFICULTY_CONFIG[difficulty]
  if (growth >= cfg.sRank)  return { grade: 'S', message: '神の采配。この難易度でSランクは伝説だ。' }
  if (growth >= cfg.aRank)  return { grade: 'A', message: '優秀な経営者！市場の嵐を乗り越えた。' }
  if (growth >= cfg.bRank)  return { grade: 'B', message: '堅実な経営。しっかり成長を達成！' }
  if (growth >= cfg.cRank)  return { grade: 'C', message: '現状維持。嵐を乗り越えたが伸び悩んだ。' }
  if (growth >= cfg.dRank)  return { grade: 'D', message: '業績悪化。逆風に負けてしまった。' }
  return { grade: 'F', message: '経営破綻寸前。難易度を下げて再挑戦しよう！' }
}

/** 配分割合から各投資の効果を計算して返す（表示用） */
export function calcAllocationEffect(allocation: { rd: number; marketing: number; hiring: number; capex: number }, budget: number): {
  rdEffect: number; mktEffect: number; hireEffect: number; capexEffect: number; totalRevEffect: number
} {
  if (budget <= 0) return { rdEffect: 0, mktEffect: 0, hireEffect: 0, capexEffect: 0, totalRevEffect: 0 }
  const rdPct    = allocation.rd        / budget
  const mktPct   = allocation.marketing / budget
  const hirePct  = allocation.hiring    / budget
  const capexPct = allocation.capex     / budget
  const rdEffect    = rdPct   * 25
  const mktEffect   = mktPct  * 30
  const hireEffect  = hirePct * 12
  const capexEffect = capexPct * 15
  const totalRevEffect = rdEffect + mktEffect + hireEffect + capexEffect
  return { rdEffect, mktEffect, hireEffect, capexEffect, totalRevEffect }
}
