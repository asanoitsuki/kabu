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

type EventEntry = GameEvent & { weight: number; isNegative: boolean }

const EVENTS: EventEntry[] = [
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // POSITIVE (35)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 'boom', title: '景気好況', icon: '📈', weight: 1.0, isNegative: false,
    description: '市場全体が活況！消費が盛り上がり売上が増加。',
    effect: { revenueMultiplier: 1.25, stockSentiment: 0.12 },
  },
  {
    id: 'innovation', title: '技術革新', icon: '💡', weight: 1.0, isNegative: false,
    description: '自社の新技術が業界標準に。圧倒的な競争優位を獲得！',
    effect: { revenueMultiplier: 1.18, stockSentiment: 0.18 },
  },
  {
    id: 'award', title: '業界賞受賞', icon: '🏆', weight: 1.0, isNegative: false,
    description: '権威ある賞を受賞。ブランド力が急上昇！',
    effect: { revenueMultiplier: 1.12, stockSentiment: 0.15 },
  },
  {
    id: 'media', title: 'SNSバズり', icon: '🔥', weight: 1.0, isNegative: false,
    description: '自社サービスがSNSで爆発的に拡散。一夜にして知名度が急上昇！',
    effect: { revenueMultiplier: 1.20, stockSentiment: 0.10 },
  },
  {
    id: 'subsidy', title: '政府補助金採択', icon: '🏛️', weight: 0.6, isNegative: false,
    description: '国の補助金プログラムに採択。資金に余裕が生まれた。',
    effect: { revenueMultiplier: 1.08, expenseMultiplier: 0.92, stockSentiment: 0.10 },
  },
  {
    id: 'rival_bankrupt', title: '競合が倒産', icon: '🎯', weight: 0.4, isNegative: false,
    description: '最大のライバル企業が突然倒産！市場シェアが一気に拡大。',
    effect: { revenueMultiplier: 1.30, stockSentiment: 0.20 },
  },
  {
    id: 'celebrity', title: '著名人がPR', icon: '⭐', weight: 0.6, isNegative: false,
    description: '大物インフルエンサーが自社製品を絶賛投稿。爆発的な宣伝効果！',
    effect: { revenueMultiplier: 1.22, stockSentiment: 0.14 },
  },
  {
    id: 'ipo_boom', title: 'IPOブーム到来', icon: '🚀', weight: 0.5, isNegative: false,
    description: 'テック系IPOが相次ぎ市場が沸騰。投資家の注目が集まる。',
    effect: { stockSentiment: 0.22 },
  },
  {
    id: 'acquisition_offer', title: '大手から買収提案', icon: '💎', weight: 0.3, isNegative: false,
    description: '業界トップ企業から突然の買収提案！株主も大歓喜。',
    effect: { revenueMultiplier: 1.15, stockSentiment: 0.30 },
  },
  {
    id: 'partnership', title: '大企業と戦略提携', icon: '🤝', weight: 0.5, isNegative: false,
    description: '大手企業との資本提携が成立。一気に信用力が向上。',
    effect: { revenueMultiplier: 1.20, stockSentiment: 0.15 },
  },
  {
    id: 'export_boom', title: '輸出が急増', icon: '✈️', weight: 0.6, isNegative: false,
    description: '海外需要が爆発。輸出額が前年比50%増を記録。',
    effect: { revenueMultiplier: 1.18, stockSentiment: 0.12 },
  },
  {
    id: 'genius_hire', title: '天才エンジニア獲得', icon: '🧠', weight: 0.5, isNegative: false,
    description: 'シリコンバレー帰りの天才が入社。チームの実力が格段に向上。',
    effect: { revenueMultiplier: 1.10, expenseMultiplier: 0.95, stockSentiment: 0.12 },
  },
  {
    id: 'patent', title: '革新的特許を取得', icon: '📜', weight: 0.4, isNegative: false,
    description: '業界を変える革新的特許を取得。競合他社は5年間真似できない。',
    effect: { revenueMultiplier: 1.15, stockSentiment: 0.18 },
  },
  {
    id: 'new_market', title: '新市場開拓成功', icon: '🗺️', weight: 0.5, isNegative: false,
    description: '誰も手をつけていなかった市場を発見・開拓。ブルーオーシャン！',
    effect: { revenueMultiplier: 1.22, stockSentiment: 0.14 },
  },
  {
    id: 'cost_optimize', title: '業務効率化で大幅コスト削減', icon: '⚙️', weight: 0.6, isNegative: false,
    description: 'DX推進でオペレーションを抜本改革。費用が劇的に圧縮。',
    effect: { expenseMultiplier: 0.85, stockSentiment: 0.10 },
  },
  {
    id: 'rate_cut', title: '金利引き下げ', icon: '📊', weight: 0.5, isNegative: false,
    description: '日銀が大規模利下げを断行。借入コストが激減し資金繰りが楽に。',
    effect: { expenseMultiplier: 0.90, stockSentiment: 0.15 },
  },
  {
    id: 'yen_strong', title: '円高メリット享受', icon: '💹', weight: 0.4, isNegative: false,
    description: '円が急騰。輸入コストが大幅低下し利益率が改善。',
    effect: { expenseMultiplier: 0.88, stockSentiment: 0.08 },
  },
  {
    id: 'tax_break', title: '税制優遇措置が適用', icon: '💰', weight: 0.4, isNegative: false,
    description: '政府の産業振興税制が適用。実効税率が大幅に低下。',
    effect: { expenseMultiplier: 0.90, stockSentiment: 0.10 },
  },
  {
    id: 'viral_hit', title: '商品が世界的にバイラル', icon: '🌍', weight: 0.3, isNegative: false,
    description: '自社商品が海外でも爆バズり。世界中から注文が殺到！',
    effect: { revenueMultiplier: 1.35, stockSentiment: 0.20 },
  },
  {
    id: 'global_expansion', title: '海外市場進出成功', icon: '🌏', weight: 0.4, isNegative: false,
    description: '海外展開が軌道に乗り、グローバル売上が急拡大。',
    effect: { revenueMultiplier: 1.25, stockSentiment: 0.18 },
  },
  {
    id: 'ai_productivity', title: 'AI活用で生産性爆上がり', icon: '🤖', weight: 0.5, isNegative: false,
    description: '生成AIをフル活用。人員半分で2倍の成果を達成！',
    effect: { revenueMultiplier: 1.15, expenseMultiplier: 0.88, stockSentiment: 0.15 },
  },
  {
    id: 'government_contract', title: '官公庁の大型受注', icon: '🏗️', weight: 0.4, isNegative: false,
    description: '国家プロジェクトの主幹企業に選ばれた。安定収益を確保。',
    effect: { revenueMultiplier: 1.20, stockSentiment: 0.12 },
  },
  {
    id: 'tv_feature', title: 'テレビ全国放送で特集', icon: '📺', weight: 0.5, isNegative: false,
    description: 'ゴールデンタイムに大特集。翌日から問い合わせが10倍に！',
    effect: { revenueMultiplier: 1.18, stockSentiment: 0.15 },
  },
  {
    id: 'brand_collab', title: '超人気ブランドとコラボ', icon: '🎨', weight: 0.4, isNegative: false,
    description: '国民的人気ブランドとのコラボ商品が発売初日完売。',
    effect: { revenueMultiplier: 1.22, stockSentiment: 0.14 },
  },
  {
    id: 'new_ceo', title: 'カリスマ経営者が就任', icon: '👔', weight: 0.3, isNegative: false,
    description: '連続起業家の伝説的CEOが就任。市場の期待が一気に高まる。',
    effect: { revenueMultiplier: 1.10, stockSentiment: 0.25 },
  },
  {
    id: 'subsidiary_ipo', title: '子会社IPO大成功', icon: '🎊', weight: 0.3, isNegative: false,
    description: '子会社が市場に上場。時価総額が親会社を超える大型IPOに。',
    effect: { stockSentiment: 0.25 },
  },
  {
    id: 'loyalty_success', title: 'ロイヤリティプログラム大成功', icon: '🎁', weight: 0.5, isNegative: false,
    description: '会員プログラムがヒット。リピート率が急上昇し安定収益を確保。',
    effect: { revenueMultiplier: 1.14, stockSentiment: 0.10 },
  },
  {
    id: 'demand_surge', title: '予想外の需要急増', icon: '📦', weight: 0.4, isNegative: false,
    description: 'トレンドが急変し、自社製品への需要が爆発的に増加。',
    effect: { revenueMultiplier: 1.28, stockSentiment: 0.16 },
  },
  {
    id: 'green_subsidy', title: '環境対応で補助金獲得', icon: '🌿', weight: 0.4, isNegative: false,
    description: 'CO2削減目標を達成。政府から多額のグリーン補助金を受領。',
    effect: { expenseMultiplier: 0.88, stockSentiment: 0.12 },
  },
  {
    id: 'research_breakthrough', title: '研究開発でブレイクスルー', icon: '🔬', weight: 0.3, isNegative: false,
    description: 'R&D部門が業界初の革新技術を開発。次世代製品への道が拓けた。',
    effect: { revenueMultiplier: 1.25, stockSentiment: 0.20 },
  },
  {
    id: 'price_hike_success', title: '値上げが好評を博す', icon: '💲', weight: 0.5, isNegative: false,
    description: '大幅値上げにも関わらずブランド力で顧客が離れず。利益率が改善。',
    effect: { revenueMultiplier: 1.18, stockSentiment: 0.08 },
  },
  {
    id: 'employee_award', title: '社員がノーベル賞受賞', icon: '🎖️', weight: 0.2, isNegative: false,
    description: '自社研究員がノーベル賞受賞！株価と知名度が世界規模で急騰。',
    effect: { revenueMultiplier: 1.08, stockSentiment: 0.28 },
  },
  {
    id: 'market_boom', title: 'セクター全体が急騰', icon: '📊', weight: 0.5, isNegative: false,
    description: '業界全体への追い風が吹く。セクターETFが過去最高値を更新。',
    effect: { revenueMultiplier: 1.15, stockSentiment: 0.20 },
  },
  {
    id: 'debt_free', title: '無借金経営達成', icon: '💯', weight: 0.4, isNegative: false,
    description: '全債務を完済。格付けがAAA+に引き上げられ資金調達コストがゼロに。',
    effect: { expenseMultiplier: 0.92, stockSentiment: 0.18 },
  },
  {
    id: 'lucky_quarter', title: '幸運の四半期！', icon: '✨', weight: 0.3, isNegative: false,
    description: '全てが噛み合った奇跡の四半期。運も実力のうち！',
    effect: { revenueMultiplier: 1.30, expenseMultiplier: 0.90, stockSentiment: 0.18 },
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // NEGATIVE (65)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 'recession', title: '景気後退', icon: '📉', weight: 1.0, isNegative: true,
    description: '消費が急速に冷え込み、売上が大幅に落ち込んだ。',
    effect: { revenueMultiplier: 0.78, stockSentiment: -0.20 },
  },
  {
    id: 'rival', title: '強力な競合参入', icon: '⚔️', weight: 1.0, isNegative: true,
    description: '資金力のある新規参入者が市場を席巻し始めた。',
    effect: { revenueMultiplier: 0.82, stockSentiment: -0.12 },
  },
  {
    id: 'scandal', title: '不祥事発覚', icon: '💥', weight: 0.8, isNegative: true,
    description: '内部告発により不正が発覚。株価と信頼が暴落。',
    effect: { revenueMultiplier: 0.80, expenseMultiplier: 1.25, stockSentiment: -0.30 },
  },
  {
    id: 'cyber', title: 'サイバー攻撃', icon: '🔒', weight: 0.8, isNegative: true,
    description: 'ランサムウェアに感染。システム復旧に多大なコストが発生。',
    effect: { expenseMultiplier: 1.20, stockSentiment: -0.15 },
  },
  {
    id: 'trump_tariff', title: 'トランプ関税発動🇺🇸', icon: '🦅', weight: 0.5, isNegative: true,
    description: '米国が突然の高関税を発動。輸出コストが急騰し業績に直撃。',
    effect: { revenueMultiplier: 0.72, expenseMultiplier: 1.18, stockSentiment: -0.28 },
  },
  {
    id: 'pandemic', title: 'パンデミック発生', icon: '🦠', weight: 0.25, isNegative: true,
    description: '世界規模の感染症が拡大。サプライチェーンが完全に崩壊。',
    effect: { revenueMultiplier: 0.55, expenseMultiplier: 1.30, stockSentiment: -0.40 },
  },
  {
    id: 'yen_crash', title: '急激な円安ショック', icon: '💴', weight: 0.5, isNegative: true,
    description: '円が急落。輸入コストが激増し、仕入れ費用が跳ね上がった。',
    effect: { expenseMultiplier: 1.22, stockSentiment: -0.18 },
  },
  {
    id: 'rate_hike', title: '金利急騰', icon: '🏦', weight: 0.5, isNegative: true,
    description: '日銀が予想外の大幅利上げを断行。借入コストと株式市場が急変動。',
    effect: { expenseMultiplier: 1.15, stockSentiment: -0.25 },
  },
  {
    id: 'sns_fire', title: 'SNS大炎上', icon: '🔥', weight: 0.4, isNegative: true,
    description: '社員の不適切投稿が拡散。不買運動が起き売上が急減。',
    effect: { revenueMultiplier: 0.65, stockSentiment: -0.35 },
  },
  {
    id: 'talent_exodus', title: '幹部が大量離職', icon: '🚪', weight: 0.5, isNegative: true,
    description: 'キーパーソンが競合に引き抜かれ、組織が混乱状態に。',
    effect: { revenueMultiplier: 0.85, expenseMultiplier: 1.12, stockSentiment: -0.20 },
  },
  {
    id: 'disaster', title: '自然災害', icon: '🌪️', weight: 0.3, isNegative: true,
    description: '大規模な自然災害が直撃。設備と供給網に甚大な被害。',
    effect: { revenueMultiplier: 0.68, expenseMultiplier: 1.25, stockSentiment: -0.32 },
  },
  {
    id: 'regulation', title: '規制強化', icon: '📋', weight: 0.6, isNegative: true,
    description: '業界への新規制が施行。コンプライアンス対応で費用が急増。',
    effect: { expenseMultiplier: 1.18, stockSentiment: -0.15 },
  },
  {
    id: 'ai_bubble', title: 'AIバブル崩壊', icon: '🤖', weight: 0.25, isNegative: true,
    description: 'テック株が全面暴落。市場全体のバリュエーションが急収縮。',
    effect: { stockSentiment: -0.38 },
  },
  {
    id: 'supply_chain', title: 'サプライチェーン危機', icon: '⛓️', weight: 0.4, isNegative: true,
    description: '主要部品の供給が停止。生産ラインが止まり売上が蒸発。',
    effect: { revenueMultiplier: 0.70, expenseMultiplier: 1.15, stockSentiment: -0.22 },
  },
  {
    id: 'lawsuit', title: '大型集団訴訟', icon: '⚖️', weight: 0.4, isNegative: true,
    description: '消費者から数百億円の集団訴訟が提起。弁護士費用と賠償が重くのしかかる。',
    effect: { expenseMultiplier: 1.30, stockSentiment: -0.25 },
  },
  {
    id: 'product_recall', title: '製品リコール発令', icon: '🚨', weight: 0.4, isNegative: true,
    description: '主力製品に重大な欠陥が判明。全品回収で売上と評判が同時に損傷。',
    effect: { revenueMultiplier: 0.78, expenseMultiplier: 1.20, stockSentiment: -0.28 },
  },
  {
    id: 'data_breach', title: '顧客情報100万件流出', icon: '🔓', weight: 0.35, isNegative: true,
    description: '大規模な個人情報漏洩が発生。賠償・対応費と信頼失墜が同時に直撃。',
    effect: { expenseMultiplier: 1.25, stockSentiment: -0.32 },
  },
  {
    id: 'energy_crisis', title: 'エネルギー危機', icon: '⚡', weight: 0.5, isNegative: true,
    description: '電力・燃料コストが急騰。全工場・データセンターの運営費が激増。',
    effect: { expenseMultiplier: 1.20, stockSentiment: -0.18 },
  },
  {
    id: 'inflation', title: 'インフレ加速で消費萎縮', icon: '🪙', weight: 0.6, isNegative: true,
    description: '物価高騰で消費者が節約モードに。売上減と原材料高のダブルパンチ。',
    effect: { revenueMultiplier: 0.85, expenseMultiplier: 1.12, stockSentiment: -0.15 },
  },
  {
    id: 'strike', title: '全社員がストライキ', icon: '🪧', weight: 0.3, isNegative: true,
    description: '待遇改善を求めて社員が一斉ストライキ。工場・業務が完全停止。',
    effect: { revenueMultiplier: 0.72, expenseMultiplier: 1.15, stockSentiment: -0.25 },
  },
  {
    id: 'earthquake', title: '大地震で工場壊滅', icon: '🏚️', weight: 0.2, isNegative: true,
    description: '震度7の直下型地震が主要工場を直撃。設備の再建に数百億が必要。',
    effect: { revenueMultiplier: 0.60, expenseMultiplier: 1.30, stockSentiment: -0.35 },
  },
  {
    id: 'war', title: '地政学リスク勃発', icon: '💣', weight: 0.3, isNegative: true,
    description: '主要取引国で武力衝突が勃発。輸出路が遮断され業績に直撃。',
    effect: { revenueMultiplier: 0.75, expenseMultiplier: 1.18, stockSentiment: -0.30 },
  },
  {
    id: 'oil_shock', title: '原油価格が3倍に急騰', icon: '🛢️', weight: 0.4, isNegative: true,
    description: '中東情勢の緊迫化で原油が高騰。物流・生産コストが爆発的に増加。',
    effect: { expenseMultiplier: 1.25, stockSentiment: -0.22 },
  },
  {
    id: 'ceo_arrest', title: 'CEOが脱税で逮捕', icon: '👮', weight: 0.2, isNegative: true,
    description: '創業者CEOが脱税・横領で突然逮捕。会社の信頼が一夜にして崩壊。',
    effect: { revenueMultiplier: 0.70, stockSentiment: -0.40 },
  },
  {
    id: 'market_crash', title: '株式市場が30%暴落', icon: '📊', weight: 0.25, isNegative: true,
    description: '世界同時株安が発生。投資家のリスク回避で全セクターが急落。',
    effect: { stockSentiment: -0.42 },
  },
  {
    id: 'counterfeit', title: '偽物が市場に氾濫', icon: '🎭', weight: 0.4, isNegative: true,
    description: '海外で高精度の偽造品が大量出回り。正規品の売上が蒸発。',
    effect: { revenueMultiplier: 0.78, stockSentiment: -0.15 },
  },
  {
    id: 'labor_shortage', title: '深刻な人手不足', icon: '👷', weight: 0.6, isNegative: true,
    description: '少子化と離職率上昇で採用が困難に。残業代急増で利益が圧迫。',
    effect: { revenueMultiplier: 0.82, expenseMultiplier: 1.15, stockSentiment: -0.12 },
  },
  {
    id: 'consumer_boycott', title: '大規模な不買運動', icon: '🛒', weight: 0.3, isNegative: true,
    description: '企業姿勢への批判がSNSで燃え上がり、全国的な不買運動に発展。',
    effect: { revenueMultiplier: 0.68, stockSentiment: -0.28 },
  },
  {
    id: 'regulatory_fine', title: '規制当局から巨額罰金', icon: '💸', weight: 0.3, isNegative: true,
    description: '独禁法・個人情報保護法違反で数百億円の行政制裁。',
    effect: { expenseMultiplier: 1.35, stockSentiment: -0.30 },
  },
  {
    id: 'patent_dispute', title: '特許侵害で巨額賠償命令', icon: '📄', weight: 0.35, isNegative: true,
    description: '競合から特許侵害で訴えられ、裁判所から100億超の賠償命令。',
    effect: { expenseMultiplier: 1.28, stockSentiment: -0.22 },
  },
  {
    id: 'crypto_crash', title: '暗号資産市場が崩壊', icon: '📉', weight: 0.3, isNegative: true,
    description: '暗号資産バブルが崩壊。デジタル資産を多く保有していた自社も打撃。',
    effect: { stockSentiment: -0.25 },
  },
  {
    id: 'factory_fire', title: '主力工場が全焼', icon: '🔥', weight: 0.2, isNegative: true,
    description: '原因不明の火災で主力工場が全焼。生産能力が一夜にしてゼロに。',
    effect: { revenueMultiplier: 0.65, expenseMultiplier: 1.20, stockSentiment: -0.30 },
  },
  {
    id: 'currency_war', title: '通貨戦争勃発', icon: '💱', weight: 0.4, isNegative: true,
    description: '各国が競争的に通貨安誘導。為替が乱高下し業績予測が不可能に。',
    effect: { revenueMultiplier: 0.82, expenseMultiplier: 1.12, stockSentiment: -0.18 },
  },
  {
    id: 'cloud_outage', title: '全クラウドが同時大規模障害', icon: '☁️', weight: 0.35, isNegative: true,
    description: 'AWSを含む主要クラウドが同時障害。全サービスが72時間停止。',
    effect: { revenueMultiplier: 0.75, expenseMultiplier: 1.10, stockSentiment: -0.20 },
  },
  {
    id: 'antitrust', title: '独占禁止法調査開始', icon: '🔍', weight: 0.3, isNegative: true,
    description: '公正取引委員会が独禁法違反疑いで強制調査を開始。事業に支障。',
    effect: { expenseMultiplier: 1.15, stockSentiment: -0.22 },
  },
  {
    id: 'tech_obsolete', title: '自社技術が一夜にして陳腐化', icon: '💾', weight: 0.3, isNegative: true,
    description: '競合が次世代技術を発表。自社製品がレガシー扱いされ需要が消滅。',
    effect: { revenueMultiplier: 0.72, stockSentiment: -0.28 },
  },
  {
    id: 'algorithm_change', title: 'SNSアルゴリズム変更', icon: '📱', weight: 0.5, isNegative: true,
    description: 'Instagramのアルゴリズム大改変。自社コンテンツのリーチが90%減。',
    effect: { revenueMultiplier: 0.80, stockSentiment: -0.15 },
  },
  {
    id: 'executive_misconduct', title: '役員スキャンダル発覚', icon: '😱', weight: 0.35, isNegative: true,
    description: '取締役が不倫・横領・パワハラの三重発覚。メディアが連日報道。',
    effect: { revenueMultiplier: 0.82, stockSentiment: -0.28 },
  },
  {
    id: 'product_death', title: '主力製品に致命的欠陥', icon: '☠️', weight: 0.25, isNegative: true,
    description: '主力製品が使用中に発火・爆発。死傷者が出て販売停止命令。',
    effect: { revenueMultiplier: 0.62, expenseMultiplier: 1.22, stockSentiment: -0.35 },
  },
  {
    id: 'merger_fail', title: '大型合併交渉が決裂', icon: '💔', weight: 0.4, isNegative: true,
    description: '期待されていた合併がドタキャン。仲介費用と機会損失が重なる。',
    effect: { stockSentiment: -0.20 },
  },
  {
    id: 'rating_downgrade', title: '格付け機関が格下げ', icon: '📰', weight: 0.35, isNegative: true,
    description: '大手格付け機関が業績悪化を理由に格付けを2段階引き下げ。',
    effect: { stockSentiment: -0.25 },
  },
  {
    id: 'short_attack', title: 'ショートセラーに狙われる', icon: '🐻', weight: 0.3, isNegative: true,
    description: '海外ヘッジファンドが「不正会計」疑惑のレポートを公開。株価が暴落。',
    effect: { revenueMultiplier: 0.80, stockSentiment: -0.35 },
  },
  {
    id: 'chip_shortage', title: '半導体不足で生産停止', icon: '🖥️', weight: 0.35, isNegative: true,
    description: '半導体の供給逼迫が深刻化。主要製品の生産ラインが完全停止。',
    effect: { revenueMultiplier: 0.72, expenseMultiplier: 1.15, stockSentiment: -0.22 },
  },
  {
    id: 'flooding', title: '物流センターが水没', icon: '🌊', weight: 0.3, isNegative: true,
    description: '記録的豪雨で主要物流センターが浸水。在庫が全滅し出荷不能に。',
    effect: { revenueMultiplier: 0.75, expenseMultiplier: 1.18, stockSentiment: -0.25 },
  },
  {
    id: 'heatwave', title: '酷暑45℃で操業停止', icon: '🌡️', weight: 0.4, isNegative: true,
    description: '観測史上最高気温45℃を記録。熱中症続出で労働基準監督署が操業停止命令。',
    effect: { revenueMultiplier: 0.80, expenseMultiplier: 1.12, stockSentiment: -0.15 },
  },
  {
    id: 'political_instability', title: '政権交代で業界政策が激変', icon: '🏛️', weight: 0.4, isNegative: true,
    description: '総選挙で政権が交代。業界に不利な規制・増税が一気に導入。',
    effect: { revenueMultiplier: 0.82, expenseMultiplier: 1.10, stockSentiment: -0.18 },
  },
  {
    id: 'fake_news', title: '偽情報で株価暴落', icon: '📰', weight: 0.35, isNegative: true,
    description: '競合が流したデマが大拡散。「倒産秒読み」フェイクニュースで株価急落。',
    effect: { stockSentiment: -0.30 },
  },
  {
    id: 'brain_drain', title: '優秀人材が競合に流出', icon: '🧑‍💻', weight: 0.4, isNegative: true,
    description: '給与・待遇格差に嫌気した優秀人材が競合へ一斉移籍。技術力が急低下。',
    effect: { revenueMultiplier: 0.82, expenseMultiplier: 1.10, stockSentiment: -0.18 },
  },
  {
    id: 'logistics_crisis', title: '物流クライシス', icon: '🚚', weight: 0.4, isNegative: true,
    description: 'トラック運転手不足が深刻化。配送遅延が多発し顧客クレームが爆増。',
    effect: { revenueMultiplier: 0.75, expenseMultiplier: 1.12, stockSentiment: -0.20 },
  },
  {
    id: 'blackout', title: '大規模停電で全工場停止', icon: '💡', weight: 0.35, isNegative: true,
    description: '電力インフラ障害で48時間の停電。全工場・データセンターが機能停止。',
    effect: { revenueMultiplier: 0.78, expenseMultiplier: 1.10, stockSentiment: -0.18 },
  },
  {
    id: 'typhoon', title: '超大型台風が直撃', icon: '🌀', weight: 0.3, isNegative: true,
    description: '過去最大規模の台風が本社・工場のある地域を直撃。甚大な物的被害。',
    effect: { revenueMultiplier: 0.72, expenseMultiplier: 1.15, stockSentiment: -0.22 },
  },
  {
    id: 'bank_crisis', title: '取引銀行が経営危機', icon: '🏦', weight: 0.2, isNegative: true,
    description: '主要取引銀行が突然の経営危機。融資枠が凍結され資金繰りが逼迫。',
    effect: { expenseMultiplier: 1.20, stockSentiment: -0.30 },
  },
  {
    id: 'deflation', title: 'デフレスパイラル突入', icon: '💲', weight: 0.35, isNegative: true,
    description: '物価下落が止まらないデフレ地獄。値下げ競争で業界全体の利益が消滅。',
    effect: { revenueMultiplier: 0.82, stockSentiment: -0.18 },
  },
  {
    id: 'audit_fail', title: '会計監査で重大指摘', icon: '📑', weight: 0.35, isNegative: true,
    description: '監査法人が内部統制の重大欠陥を指摘。決算発表が延期され市場が不安視。',
    effect: { expenseMultiplier: 1.15, stockSentiment: -0.22 },
  },
  {
    id: 'embargo', title: '主要国が輸出禁止措置', icon: '🚫', weight: 0.25, isNegative: true,
    description: '安全保障上の理由から主要国が自社製品の輸出禁止を突然発動。',
    effect: { revenueMultiplier: 0.70, stockSentiment: -0.25 },
  },
  {
    id: 'raw_material_surge', title: '原材料費が2倍に高騰', icon: '⛏️', weight: 0.4, isNegative: true,
    description: '希少鉱物の産出国で紛争が勃発。主要原材料のコストが倍増。',
    effect: { expenseMultiplier: 1.25, stockSentiment: -0.18 },
  },
  {
    id: 'war_escalation', title: '戦争激化でグローバル市場崩壊', icon: '🌍', weight: 0.15, isNegative: true,
    description: '地域紛争が世界規模に拡大。グローバルサプライチェーンが崩壊寸前。',
    effect: { revenueMultiplier: 0.65, expenseMultiplier: 1.20, stockSentiment: -0.38 },
  },
  {
    id: 'nuclear_risk', title: '核リスクで市場パニック', icon: '☢️', weight: 0.1, isNegative: true,
    description: '原発事故・核兵器使用リスクが浮上。世界市場が制御不能なパニックに。',
    effect: { stockSentiment: -0.45 },
  },
  {
    id: 'black_swan', title: 'ブラックスワン発生', icon: '🦢', weight: 0.1, isNegative: true,
    description: '誰も予測しなかった事態が発生。リスクモデルが全て崩壊。助けを求めても無駄。',
    effect: { revenueMultiplier: 0.60, expenseMultiplier: 1.25, stockSentiment: -0.45 },
  },
  {
    id: 'social_credit', title: 'SNSに社内不満が大拡散', icon: '😤', weight: 0.5, isNegative: true,
    description: '匿名社員の内部告発がSNSで拡散。「ブラック企業」認定で採用もアウト。',
    effect: { revenueMultiplier: 0.85, stockSentiment: -0.18 },
  },
  {
    id: 'counterfeit_rumor', title: '競合の偽情報攻撃', icon: '🗣️', weight: 0.4, isNegative: true,
    description: '競合が意図的に流した偽情報が株式フォーラムで拡大。根も葉もない噂が蔓延。',
    effect: { revenueMultiplier: 0.82, stockSentiment: -0.22 },
  },
  {
    id: 'talent_revolt', title: '社員が経営陣不信任動議', icon: '✊', weight: 0.3, isNegative: true,
    description: '全社員の7割が経営陣刷新を求める署名。ガバナンス危機として報道される。',
    effect: { revenueMultiplier: 0.78, expenseMultiplier: 1.12, stockSentiment: -0.22 },
  },
  {
    id: 'subscription_cancel', title: 'サブスク解約率が急増', icon: '📤', weight: 0.5, isNegative: true,
    description: '競合の無料化攻勢でサブスク解約が急増。ストック型収益が崩壊。',
    effect: { revenueMultiplier: 0.78, stockSentiment: -0.15 },
  },
  {
    id: 'environment_penalty', title: '環境違反で操業停止命令', icon: '🌱', weight: 0.3, isNegative: true,
    description: 'CO2排出量が法定基準を大幅超過。環境庁から操業停止命令が発動。',
    effect: { revenueMultiplier: 0.72, expenseMultiplier: 1.18, stockSentiment: -0.28 },
  },
  {
    id: 'competitor_moonshot', title: '競合がMoonshot技術発表', icon: '🌙', weight: 0.3, isNegative: true,
    description: '競合が自社の5年分の開発を一気に飛び越える革命的技術を公開。',
    effect: { revenueMultiplier: 0.80, stockSentiment: -0.25 },
  },
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
  const event = pickEvent(difficulty)
  const { growth } = INDUSTRY_STATS[company.industry]
  const budget = allocation.rd + allocation.marketing + allocation.hiring + allocation.capex + allocation.dividend
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

  const isGameOver = newFinancials.cash <= 0 || turn >= state.maxTurns

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
  }

  return { newState, report }
}

function pickEvent(difficulty: Difficulty): GameEvent | null {
  const { eventRate, negBias } = DIFFICULTY_CONFIG[difficulty]
  if (Math.random() > eventRate) return null

  const total = EVENTS.reduce((s, e) => s + (e.isNegative ? e.weight * negBias : e.weight), 0)
  let r = Math.random() * total
  for (const e of EVENTS) {
    r -= e.isNegative ? e.weight * negBias : e.weight
    if (r <= 0) return e
  }
  return EVENTS[EVENTS.length - 1]
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
): { grade: string; message: string } {
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
