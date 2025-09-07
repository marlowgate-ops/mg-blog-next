export type CTA = {
  title: string
  desc: string
  benefits: string[]
  label: string
  href: string
}

export type CopySet = {
  hero: CTA
  post: CTA
}

/** Variant A — ストレート＆即時メリット */
export const COPY_A: CopySet = {
  hero: {
    title: '今すぐ使えるテンプレ＆カレンダー',
    desc: '運用の立ち上げを最短化。無料リソースを配布中。',
    benefits: ['週次テンプレ', '主要指標ICS（時差補正）', '検証ノート雛形'],
    label: '無料で受け取る',
    href: '/'
  },
  post: {
    title: '次の一歩へ',
    desc: '運用を加速するリソース・テンプレート・カレンダーをご用意しています。',
    benefits: ['実務テンプレの配布', '主要指標ICS', '検証ノート雛形'],
    label: '詳細を見る',
    href: '/'
  }
}

/** Variant B — 成果訴求＆社会的証明テイスト */
export const COPY_B: CopySet = {
  hero: {
    title: '成果に直結する実務キット',
    desc: '最短で成果を出すためのテンプレ＆運用カレンダー。初回セットを今だけ公開。',
    benefits: ['初動でつまずかない手順', '失敗を避けるICSチェック', 'そのまま使える雛形'],
    label: '無料で試す',
    href: '/'
  },
  post: {
    title: '実務を前に進める',
    desc: 'チェックリスト／ICS／検証ノートで、明日からの運用を滑らかに。',
    benefits: ['すぐ使える雛形', '時差補正済みICS', '改善ループ化のヒント'],
    label: '詳しく見る',
    href: '/'
  }
}

/** 環境変数 NEXT_PUBLIC_COPY_VARIANT=A|B で切替（デフォルトA） */
export function getCopy(): CopySet {
  const v = (process.env.NEXT_PUBLIC_COPY_VARIANT || 'A').toUpperCase()
  return v === 'B' ? COPY_B : COPY_A
}
