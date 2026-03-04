/* ============================================
   原価計算アカデミー - データ定義
   ============================================ */

/**
 * CRO職種データ
 * - id: 職種識別子
 * - name: 職種名
 * - nameEn: 英語名
 * - category: カテゴリキー
 * - description: 概要
 * - skills: 必要スキル
 * - qualifications: 関連資格
 * - experienceLevels: 経験年数別データ
 * - demandScore: 市場需要スコア（100点満点）
 * - costRatio: 平均原価率（%）
 * - dailySchedule: 1日のスケジュール
 */
const ROLE_DATA = [
  {
    id: "cra",
    name: "CRA（臨床開発モニター）",
    nameEn: "Clinical Research Associate",
    category: "clinical",
    description: "治験実施医療機関を訪問し、治験がGCP（医薬品の臨床試験の実施に関する基準）に準拠して適切に実施されているかをモニタリングする。CROの中核職種。",
    skills: ["GCP知識", "医学・薬学知識", "英語力（読み書き）", "コミュニケーション力", "データ確認力", "スケジュール管理"],
    qualifications: ["薬剤師", "看護師", "臨床検査技師", "MR経験"],
    experienceLevels: [
      { years: "1-3年", monthlyCost: 50, monthlyRate: 100, annualSalary: 450 },
      { years: "4-6年", monthlyCost: 65, monthlyRate: 135, annualSalary: 580 },
      { years: "7-10年", monthlyCost: 80, monthlyRate: 160, annualSalary: 700 },
      { years: "10年以上", monthlyCost: 95, monthlyRate: 185, annualSalary: 830 }
    ],
    demandScore: 95,
    costRatio: 48,
    dailySchedule: [
      { time: "08:30", task: "メールチェック・訪問準備" },
      { time: "10:00", task: "医療機関訪問（SDV: 原資料との照合）" },
      { time: "12:00", task: "昼食" },
      { time: "13:00", task: "治験責任医師との面談・クエリ確認" },
      { time: "15:00", task: "モニタリングレポート作成" },
      { time: "17:00", task: "社内報告・翌日準備" }
    ]
  },
  {
    id: "dm",
    name: "DM（データマネジメント）",
    nameEn: "Data Manager",
    category: "data",
    description: "治験で収集される臨床データの品質管理を担う。EDC（電子データ収集システム）の構築、データクリーニング、データベースロックまでのプロセスを管理する。",
    skills: ["EDCシステム操作", "SQL/SAS基礎", "医学用語知識", "論理的思考力", "品質管理意識"],
    qualifications: ["情報処理技術者", "SAS認定"],
    experienceLevels: [
      { years: "1-3年", monthlyCost: 45, monthlyRate: 90, annualSalary: 400 },
      { years: "4-6年", monthlyCost: 58, monthlyRate: 120, annualSalary: 520 },
      { years: "7-10年", monthlyCost: 72, monthlyRate: 145, annualSalary: 640 },
      { years: "10年以上", monthlyCost: 82, monthlyRate: 165, annualSalary: 720 }
    ],
    demandScore: 85,
    costRatio: 50,
    dailySchedule: [
      { time: "09:00", task: "メールチェック・タスク確認" },
      { time: "09:30", task: "EDCシステムのクエリ対応" },
      { time: "11:00", task: "CRF設計・バリデーションプログラミング" },
      { time: "12:00", task: "昼食" },
      { time: "13:00", task: "データクリーニング・ロジカルチェック" },
      { time: "15:00", task: "チーム内ミーティング" },
      { time: "16:00", task: "データレビュー・SOP確認" }
    ]
  },
  {
    id: "stat",
    name: "生物統計（統計解析）",
    nameEn: "Biostatistician",
    category: "data",
    description: "治験の統計解析計画書（SAP）の作成、解析プログラミング、解析結果の報告を担当する。医薬品の有効性・安全性を統計学的に証明するCROの頭脳。",
    skills: ["SAS/R", "統計学（検定・推定）", "臨床試験デザイン", "SAP作成", "英語論文読解"],
    qualifications: ["統計検定1級", "SAS認定", "博士号（望ましい）"],
    experienceLevels: [
      { years: "1-3年", monthlyCost: 55, monthlyRate: 115, annualSalary: 500 },
      { years: "4-6年", monthlyCost: 72, monthlyRate: 150, annualSalary: 650 },
      { years: "7-10年", monthlyCost: 90, monthlyRate: 185, annualSalary: 800 },
      { years: "10年以上", monthlyCost: 105, monthlyRate: 210, annualSalary: 920 }
    ],
    demandScore: 92,
    costRatio: 46,
    dailySchedule: [
      { time: "09:00", task: "メール確認・進捗整理" },
      { time: "09:30", task: "SASプログラミング（解析データセット作成）" },
      { time: "12:00", task: "昼食" },
      { time: "13:00", task: "統計解析計画書（SAP）レビュー" },
      { time: "15:00", task: "解析結果の検証・QC" },
      { time: "16:30", task: "クライアントとの打ち合わせ" }
    ]
  },
  {
    id: "mw",
    name: "MW（メディカルライティング）",
    nameEn: "Medical Writer",
    category: "medical",
    description: "治験に関する各種文書（治験総括報告書、CTD、プロトコル等）を作成する。科学的な正確性と規制要件への準拠が求められる専門職。",
    skills: ["医学・薬学知識", "英語ライティング", "ICH-GCPガイドライン", "CTD構成知識", "論理的文章力"],
    qualifications: ["薬剤師", "医学博士", "AMWA認定"],
    experienceLevels: [
      { years: "1-3年", monthlyCost: 50, monthlyRate: 100, annualSalary: 450 },
      { years: "4-6年", monthlyCost: 63, monthlyRate: 130, annualSalary: 570 },
      { years: "7-10年", monthlyCost: 78, monthlyRate: 155, annualSalary: 690 },
      { years: "10年以上", monthlyCost: 88, monthlyRate: 175, annualSalary: 770 }
    ],
    demandScore: 80,
    costRatio: 49,
    dailySchedule: [
      { time: "09:00", task: "メール確認・スケジュール調整" },
      { time: "09:30", task: "治験総括報告書（CSR）ドラフト作成" },
      { time: "12:00", task: "昼食" },
      { time: "13:00", task: "統計解析結果の文書化" },
      { time: "15:00", task: "メディカルチームとの内容確認会議" },
      { time: "16:00", task: "文献レビュー・参考資料整理" }
    ]
  },
  {
    id: "pv",
    name: "PV（安全性情報管理）",
    nameEn: "Pharmacovigilance Specialist",
    category: "medical",
    description: "治験中および市販後の安全性情報（有害事象・副作用）を収集・評価・報告する。規制当局への報告期限は厳格で、迅速かつ正確な対応が求められる。",
    skills: ["MedDRAコーディング", "安全性評価", "規制報告（E2B）", "医学用語", "期限管理"],
    qualifications: ["薬剤師", "看護師", "MedDRA認定"],
    experienceLevels: [
      { years: "1-3年", monthlyCost: 45, monthlyRate: 90, annualSalary: 400 },
      { years: "4-6年", monthlyCost: 58, monthlyRate: 118, annualSalary: 520 },
      { years: "7-10年", monthlyCost: 72, monthlyRate: 145, annualSalary: 640 },
      { years: "10年以上", monthlyCost: 85, monthlyRate: 170, annualSalary: 740 }
    ],
    demandScore: 88,
    costRatio: 50,
    dailySchedule: [
      { time: "09:00", task: "SAEレポート確認・トリアージ" },
      { time: "10:00", task: "有害事象の因果関係評価" },
      { time: "12:00", task: "昼食" },
      { time: "13:00", task: "規制当局向け報告書（CIOMS/E2B）作成" },
      { time: "15:00", task: "安全性データベース入力・更新" },
      { time: "16:30", task: "DSUR/PBRER等の定期報告準備" }
    ]
  },
  {
    id: "qa",
    name: "QC/QA（品質管理/品質保証）",
    nameEn: "Quality Control / Quality Assurance",
    category: "management",
    description: "治験の品質を保証するために、SOP遵守の監査、プロセス改善、CAPAの実施を行う。GCP監査やFDA査察対応も重要な業務。",
    skills: ["GCP/GLP/GMP知識", "監査技術", "CAPA管理", "リスクマネジメント", "文書管理"],
    qualifications: ["薬剤師", "QMS審査員", "内部監査員"],
    experienceLevels: [
      { years: "1-3年", monthlyCost: 45, monthlyRate: 90, annualSalary: 400 },
      { years: "4-6年", monthlyCost: 55, monthlyRate: 112, annualSalary: 490 },
      { years: "7-10年", monthlyCost: 68, monthlyRate: 138, annualSalary: 600 },
      { years: "10年以上", monthlyCost: 80, monthlyRate: 160, annualSalary: 700 }
    ],
    demandScore: 72,
    costRatio: 50,
    dailySchedule: [
      { time: "09:00", task: "監査計画の確認・準備" },
      { time: "10:00", task: "内部監査（SOP遵守確認）" },
      { time: "12:00", task: "昼食" },
      { time: "13:00", task: "監査所見のまとめ・CAPA起案" },
      { time: "15:00", task: "SOP改訂レビュー" },
      { time: "16:30", task: "トレーニング記録確認・報告" }
    ]
  },
  {
    id: "pm",
    name: "PM（プロジェクトマネージャー）",
    nameEn: "Project Manager",
    category: "management",
    description: "治験プロジェクト全体の計画・進捗・予算・リソースを統括管理する。クライアント（製薬企業）との窓口としてプロジェクトの成功に責任を持つ。",
    skills: ["プロジェクト管理", "予算管理", "リーダーシップ", "ステークホルダー管理", "リスク管理", "英語（ビジネス）"],
    qualifications: ["PMP", "臨床開発経験10年以上"],
    experienceLevels: [
      { years: "1-3年", monthlyCost: 60, monthlyRate: 120, annualSalary: 530 },
      { years: "4-6年", monthlyCost: 78, monthlyRate: 158, annualSalary: 690 },
      { years: "7-10年", monthlyCost: 95, monthlyRate: 192, annualSalary: 840 },
      { years: "10年以上", monthlyCost: 115, monthlyRate: 230, annualSalary: 1010 }
    ],
    demandScore: 90,
    costRatio: 47,
    dailySchedule: [
      { time: "08:30", task: "メール確認・当日のアジェンダ整理" },
      { time: "09:00", task: "クライアント週次ミーティング" },
      { time: "10:30", task: "内部チームミーティング（進捗確認）" },
      { time: "12:00", task: "昼食" },
      { time: "13:00", task: "予算・リソース管理（EAC更新）" },
      { time: "15:00", task: "リスク管理・課題対応" },
      { time: "17:00", task: "報告資料作成・翌日準備" }
    ]
  },
  {
    id: "reg",
    name: "薬事（レギュラトリー）",
    nameEn: "Regulatory Affairs Specialist",
    category: "clinical",
    description: "治験届、承認申請、CTD作成等の規制対応を担当する。PMDA（医薬品医療機器総合機構）との対面助言や照会事項対応を行う。",
    skills: ["薬機法知識", "CTD作成", "PMDA対応", "ICH-GCPガイドライン", "英語（規制文書）"],
    qualifications: ["薬剤師", "RAC認定"],
    experienceLevels: [
      { years: "1-3年", monthlyCost: 52, monthlyRate: 105, annualSalary: 470 },
      { years: "4-6年", monthlyCost: 68, monthlyRate: 140, annualSalary: 610 },
      { years: "7-10年", monthlyCost: 85, monthlyRate: 172, annualSalary: 750 },
      { years: "10年以上", monthlyCost: 100, monthlyRate: 200, annualSalary: 880 }
    ],
    demandScore: 82,
    costRatio: 48,
    dailySchedule: [
      { time: "09:00", task: "規制動向のチェック・メール確認" },
      { time: "09:30", task: "CTDモジュール作成・更新" },
      { time: "12:00", task: "昼食" },
      { time: "13:00", task: "PMDA照会事項への回答作成" },
      { time: "15:00", task: "承認申請書類レビュー" },
      { time: "16:30", task: "部門内勉強会・ガイドライン読み合わせ" }
    ]
  }
];

/**
 * 職種カテゴリ定義
 */
const CATEGORIES = {
  clinical: {
    name: "臨床開発系",
    color: "#e53e3e",
    icon: "🏥",
    description: "治験のモニタリング・規制対応を行う中核職種群",
    rateRange: "90万〜230万円/月",
    roles: ["cra", "reg"]
  },
  data: {
    name: "データ系",
    color: "#3182ce",
    icon: "📊",
    description: "治験データの収集・管理・統計解析を行う職種群",
    rateRange: "90万〜210万円/月",
    roles: ["dm", "stat"]
  },
  medical: {
    name: "メディカル系",
    color: "#38a169",
    icon: "📝",
    description: "医学文書作成・安全性情報管理を行う職種群",
    rateRange: "90万〜175万円/月",
    roles: ["mw", "pv"]
  },
  management: {
    name: "管理系",
    color: "#805ad5",
    icon: "📋",
    description: "プロジェクト管理・品質保証を行う職種群",
    rateRange: "90万〜230万円/月",
    roles: ["pm", "qa"]
  }
};

/**
 * 臨床試験フェーズデータ
 */
const PHASE_DATA = [
  {
    id: "phase1",
    name: "Phase I（第I相試験）",
    subtitle: "安全性・薬物動態の確認",
    description: "少数の健常人ボランティア（または患者）を対象に、薬の安全性、忍容性、薬物動態（ADME）を評価する最初のヒト試験。",
    subjects: "20〜80名",
    sites: "1〜5施設",
    duration: "6〜12ヶ月",
    totalCostBillion: "2〜5億円",
    costPerSubject: 500,
    successRate: "約70%",
    fteAllocation: { cra: 20, dm: 15, stat: 10, mw: 10, pv: 20, qa: 5, pm: 15, reg: 5 },
    keyActivities: ["初回投与量の決定", "用量漸増試験", "薬物動態測定", "安全性モニタリング"]
  },
  {
    id: "phase2",
    name: "Phase II（第II相試験）",
    subtitle: "有効性の探索・用量設定",
    description: "比較的少数の患者を対象に、有効性の初期評価、最適な用法用量の決定、副作用プロファイルの確認を行う。Phase IIa（概念実証）とPhase IIb（用量設定）に分かれることが多い。",
    subjects: "100〜300名",
    sites: "10〜30施設",
    duration: "12〜24ヶ月",
    totalCostBillion: "10〜30億円",
    costPerSubject: 800,
    successRate: "約33%",
    fteAllocation: { cra: 30, dm: 15, stat: 15, mw: 8, pv: 12, qa: 5, pm: 10, reg: 5 },
    keyActivities: ["二重盲検比較試験", "用量反応関係の評価", "有効性エンドポイント測定", "副作用プロファイル確認"]
  },
  {
    id: "phase3",
    name: "Phase III（第III相試験）",
    subtitle: "有効性・安全性の検証",
    description: "大規模な患者集団を対象に、有効性と安全性を検証する試験。承認申請に必要なエビデンスを得るための決定的な試験。多施設共同・国際共同試験が一般的。",
    subjects: "300〜3,000名以上",
    sites: "30〜200施設",
    duration: "24〜48ヶ月",
    totalCostBillion: "50〜200億円",
    costPerSubject: 1300,
    successRate: "約58%",
    fteAllocation: { cra: 35, dm: 15, stat: 12, mw: 8, pv: 10, qa: 5, pm: 10, reg: 5 },
    keyActivities: ["大規模ランダム化比較試験", "長期安全性データ収集", "承認申請用データパッケージ作成", "国際共同試験の調整"]
  },
  {
    id: "pms",
    name: "PMS（製造販売後調査）",
    subtitle: "市販後の安全性監視",
    description: "承認後に実臨床で使用される段階で、長期安全性や新たなリスクの検出を行う。使用成績調査、特定使用成績調査、副作用自発報告の収集等。",
    subjects: "数千〜数万名",
    sites: "50〜500施設",
    duration: "36〜96ヶ月",
    totalCostBillion: "5〜30億円",
    costPerSubject: 50,
    successRate: "—",
    fteAllocation: { cra: 15, dm: 20, stat: 10, mw: 10, pv: 25, qa: 5, pm: 10, reg: 5 },
    keyActivities: ["使用成績調査", "副作用の自発報告収集", "DSUR/PBRER作成", "リスク管理計画（RMP）運用"]
  }
];

/**
 * 原価計算の基礎用語
 */
const COST_TERMS = [
  {
    term: "人月（にんげつ）",
    definition: "1人が1ヶ月（約20営業日×8時間=160時間）フルタイムで稼働する作業量の単位。Man-Month（MM）とも呼ばれる。",
    example: "CRA 2名が3ヶ月 → 6人月",
    formula: "人月 = 人数 × 期間（月）"
  },
  {
    term: "FTE（エフティーイー）",
    definition: "Full-Time Equivalent（フルタイム当量）。1.0 FTE = フルタイム1名分。パートタイムは0.5 FTEなどと表現する。",
    example: "CRA 1.5 FTE × 6ヶ月 = 9人月",
    formula: "工数（人月）= FTE × 期間（月）"
  },
  {
    term: "直接費",
    definition: "特定のプロジェクトに直接紐付けられる費用。プロジェクト専任スタッフの人件費、出張交通費、治験薬関連費用等。",
    example: "CRA人件費、施設訪問交通費、EDCライセンス費",
    formula: "直接費 = Σ（各職種の単価 × 工数）+ 直接経費"
  },
  {
    term: "間接費（オーバーヘッド）",
    definition: "複数のプロジェクトで共有される費用。オフィス賃料、管理部門人件費、情報システム費、全社研修費等。配賦基準に基づいてプロジェクトに按分する。",
    example: "本社賃料、経理部門人件費、社内ITインフラ費",
    formula: "間接費 = 直接費 × 間接費率"
  },
  {
    term: "配賦（はいふ）",
    definition: "間接費をプロジェクトごとに按分すること。配賦基準には人数比、工数比、売上比、直接費比等があり、基準の選定が原価の精度を左右する。",
    example: "全社間接費1億円を10プロジェクトに工数比で配賦",
    formula: "配賦額 = 全社間接費 × （当プロジェクト工数 / 全社工数）"
  },
  {
    term: "原価率",
    definition: "売上高に対する原価の割合。CRO業界では人件費が原価の大部分を占め、原価率50-65%が一般的。",
    example: "売上1億円、原価5,500万円 → 原価率55%",
    formula: "原価率(%) = 総原価 / 売上 × 100"
  },
  {
    term: "チャージレート（請求単価）",
    definition: "クライアントに請求する1人月あたりの金額。原価に間接費と利益を上乗せした金額。原価の1.8〜2.2倍が目安。",
    example: "月額原価60万円 → 請求単価120万円（マークアップ率100%）",
    formula: "チャージレート = 月額原価 × (1 + マークアップ率)"
  },
  {
    term: "稼働率",
    definition: "スタッフの総労働時間に対する、プロジェクトに直接費として計上できる時間の割合。75-85%が健全な目安。",
    example: "月160時間中、プロジェクト業務128時間 → 稼働率80%",
    formula: "稼働率(%) = 直接作業時間 / 総労働時間 × 100"
  }
];

/**
 * クイズデータ
 */
const QUIZ_DATA = [
  {
    id: 1,
    question: "CRA 3名を6ヶ月間フルタイムで投入する場合、工数は何人月か？",
    choices: ["9人月", "12人月", "18人月", "24人月"],
    answer: 2,
    explanation: "工数 = 人数 × 期間 = 3名 × 6ヶ月 = 18人月。CRAの投入規模としては中規模のPhase II試験に相当します。"
  },
  {
    id: 2,
    question: "月額原価60万円のDMスタッフの請求単価が120万円の場合、マークアップ率は何%か？",
    choices: ["50%", "80%", "100%", "120%"],
    answer: 2,
    explanation: "マークアップ率 = (請求単価 - 原価) / 原価 × 100 = (120 - 60) / 60 × 100 = 100%。CRO業界では80-120%のマークアップ率が一般的です。"
  },
  {
    id: 3,
    question: "直接費が4,000万円、間接費率が25%の場合、プロジェクトの総原価はいくらか？",
    choices: ["4,500万円", "5,000万円", "5,500万円", "6,000万円"],
    answer: 1,
    explanation: "間接費 = 直接費 × 間接費率 = 4,000万円 × 25% = 1,000万円。総原価 = 直接費 + 間接費 = 4,000万円 + 1,000万円 = 5,000万円。"
  },
  {
    id: 4,
    question: "総原価6,000万円、目標利益率20%の場合、クライアントへの請求額（売上）はいくらか？",
    choices: ["7,200万円", "7,500万円", "8,000万円", "8,400万円"],
    answer: 1,
    explanation: "請求額 = 総原価 / (1 - 利益率) = 6,000万円 / (1 - 0.20) = 6,000万円 / 0.80 = 7,500万円。利益 = 7,500万 - 6,000万 = 1,500万円（利益率20%）。"
  },
  {
    id: 5,
    question: "CRA（月額単価150万円）2.0 FTEとDM（月額単価120万円）1.0 FTEを12ヶ月投入した場合の直接人件費は？",
    choices: ["3,960万円", "4,800万円", "5,040万円", "5,400万円"],
    answer: 2,
    explanation: "CRA: 150万円 × 2.0 FTE × 12ヶ月 = 3,600万円。DM: 120万円 × 1.0 FTE × 12ヶ月 = 1,440万円。合計 = 3,600 + 1,440 = 5,040万円。"
  },
  {
    id: 6,
    question: "月160時間の労働時間のうち、プロジェクト業務に120時間、社内業務に40時間を費やした場合の稼働率は？",
    choices: ["60%", "70%", "75%", "80%"],
    answer: 2,
    explanation: "稼働率 = プロジェクト業務時間 / 総労働時間 × 100 = 120 / 160 × 100 = 75%。CRO業界では75-85%が健全な稼働率とされています。"
  },
  {
    id: 7,
    question: "全社の年間間接費が3億円、全社の年間総工数が600人月の場合、工数配賦基準での1人月あたり間接費はいくらか？",
    choices: ["30万円", "40万円", "50万円", "60万円"],
    answer: 2,
    explanation: "1人月あたり間接費 = 全社間接費 / 全社総工数 = 3億円 / 600人月 = 50万円/人月。これがプロジェクト工数に応じて配賦されます。"
  },
  {
    id: 8,
    question: "Phase III試験で300症例、1症例あたりコスト1,300万円の場合、総費用の概算は？",
    choices: ["約20億円", "約30億円", "約39億円", "約50億円"],
    answer: 2,
    explanation: "総費用 = 症例数 × 1症例あたりコスト = 300症例 × 1,300万円 = 39億円。Phase III試験は最も費用がかかるフェーズで、数十億〜数百億円規模になります。"
  },
  {
    id: 9,
    question: "「FTE方式」と「タスク別方式」の見積もりで、一般的に初期見積額が低くなりやすいのはどちら？",
    choices: ["FTE方式", "タスク別方式", "どちらも同じ", "プロジェクトによる"],
    answer: 1,
    explanation: "タスク別方式は個々のタスク単価の積み上げのため初期見積額は低く見えがちですが、想定外のタスクが発生すると追加費用がかさみやすい傾向があります。FTE方式は期間×人数で算出するため、変動リスクが低い反面、初期見積額は高くなりがちです。"
  },
  {
    id: 10,
    question: "原価率55%のプロジェクトで売上が1.2億円の場合、粗利益はいくらか？",
    choices: ["4,800万円", "5,400万円", "6,000万円", "6,600万円"],
    answer: 1,
    explanation: "原価 = 売上 × 原価率 = 1.2億円 × 55% = 6,600万円。粗利益 = 売上 - 原価 = 1.2億円 - 6,600万円 = 5,400万円。粗利益率は45%です。"
  }
];

/**
 * クイズ結果の診断マップ
 */
const QUIZ_RESULTS = {
  master: {
    min: 9,
    title: "原価計算マスター 🏆",
    description: "CROの原価構造を完全に理解しています。見積もり査定やプライシング戦略の議論にも参加できるレベルです。",
    advice: "この知識を活かして、プロジェクトの収益性改善や見積もり精度の向上に貢献しましょう。"
  },
  advanced: {
    min: 7,
    title: "上級者 📈",
    description: "原価計算の基本をしっかり押さえています。実務での応用もスムーズにできるでしょう。",
    advice: "間接費の配賦方法や稼働率管理など、より実践的なテーマにも挑戦してみましょう。"
  },
  intermediate: {
    min: 5,
    title: "中級者 📊",
    description: "基本的な計算はできますが、応用問題でつまずく部分があります。",
    advice: "人月計算と原価率の関係をもう一度整理すると、理解が深まります。"
  },
  beginner: {
    min: 3,
    title: "初級者 📘",
    description: "原価計算の基礎概念は理解していますが、計算練習がもう少し必要です。",
    advice: "まずは「用語集」を見返して基礎を固めてから、再挑戦してみましょう。"
  },
  novice: {
    min: 0,
    title: "入門者 🌱",
    description: "原価計算はまだこれからです。でも大丈夫、基礎からしっかり学べます。",
    advice: "まずは「人月」「直接費」「間接費」の3つの概念から始めてみましょう。"
  }
};
