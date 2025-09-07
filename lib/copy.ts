export type CTA = {
  title: string
  desc: string
  benefits: string[]
  label: string
  href: string
}

export const COPY = {
  hero: {
    title: '今すぐ使えるテンプレ＆カレンダー',
    desc: '運用の立ち上げを最短化。無料リソースを配布中。',
    benefits: ['週次テンプレ', '主要指標ICS（時差補正）', '検証ノート雛形'],
    label: '無料で受け取る',
    href: '/'
  } as CTA,
  post: {
    title: '次の一歩へ',
    desc: '運用を加速するリソース・テンプレート・カレンダーをご用意しています。',
    benefits: ['実務テンプレの配布', '主要指標ICS', '検証ノート雛形'],
    label: '詳細を見る',
    href: '/'
  } as CTA
}
