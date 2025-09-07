export type TagMeta = {
  title: string
  description: string
  aliases?: string[]
}

export const TAG_META: Record<string, TagMeta> = {
  "EA運用": {
    title: "EA運用",
    description: "自動売買の実運用設計。稼働条件、保守、ログ基準、トラブル時の復旧手順まで。"
  },
  "リスク管理": {
    title: "リスク管理",
    description: "ドローダウン耐性、ロット調整、損失回避ルールなど、勝ち残るための設計。",
    aliases: ["リスク", "資金管理"]
  },
  "KPI": {
    title: "KPI",
    description: "PF、期待値、勝率に依存しない評価法。ログ→施策→検証の打ち手循環。"
  },
  "ニュース除外": {
    title: "ニュース除外",
    description: "FOMCやCPIなど高ボラ時を避け、歪みを出さないための運用ガード。",
    aliases: ["イベント除外"]
  },
  "運用フロー": {
    title: "運用フロー",
    description: "日次/週次の手順、チェックリスト、タスク分担。"
  },
  "安定化": {
    title: "安定化",
    description: "障害に強い構成、バージョン固定、監視と再配信。"
  },
  "スプレッド": {
    title: "スプレッド",
    description: "コストの見える化。ATR比で“入らない日”を作る。"
  },
  "ボラティリティ": {
    title: "ボラティリティ",
    description: "ATR/レンジ特性の把握と活用。"
  },
  "フィルター": {
    title: "フィルター",
    description: "条件で勝つためのエントリー制御。"
  },
  "トレーリング": {
    title: "トレーリング",
    description: "建値ストップ、利確の最適化。やりすぎ回避の条件。"
  },
  "実務": {
    title: "実務",
    description: "理論から運用へ。手順化・自動化・監査。"
  },
  "資金管理": {
    title: "資金管理",
    description: "資金曲線の安定化、破綻回避の設計。"
  },
  "ICS": {
    title: "ICS",
    description: "経済カレンダー製品の設計・品質・再配信。"
  },
  "プロダクト運用": {
    title: "プロダクト運用",
    description: "Gumroad/LP、販売体制、KYCや返金対策。"
  },
  "品質管理": {
    title: "品質管理",
    description: "チェック、モニタリング、アラート、改善ループ。"
  },
  "ふりかえり": {
    title: "ふりかえり",
    description: "学びをKPI→施策→検証に落とし込む公開レトロ。"
  },
  "運用改善": {
    title: "運用改善",
    description: "小さな改善を積み上げるための枠組みと指標。"
  },
  "ナレッジ": {
    title: "ナレッジ",
    description: "運用知識の体系化と共有。"
  }
}

export function lookupTag(raw: string): { key: string, meta: TagMeta | null } {
  const tag = decodeURIComponent(raw || '').trim()
  if (!tag) return { key: '', meta: null }
  if (TAG_META[tag]) return { key: tag, meta: TAG_META[tag] }
  // alias search
  for (const [k, v] of Object.entries(TAG_META)) {
    if (v.aliases?.includes(tag)) return { key: k, meta: v }
  }
  return { key: tag, meta: null }
}
