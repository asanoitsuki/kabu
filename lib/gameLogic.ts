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
