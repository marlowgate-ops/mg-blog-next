import LegalPage from "@/components/LegalPage";

export const metadata = {
  title: "サイトポリシー（利用規約）｜Marlow Gate",
  description: "本サイトの利用条件、知的財産権、禁止事項、準拠法、広告方針など。"
};

export default function Page() {
  return (
    <LegalPage title="サイトポリシー（利用規約）">
      <h2>総則</h2>
      <p>本サイト（<strong>blog.marlowgate.com</strong>）を利用される皆さまは、本ポリシーに同意したものとみなされます。</p>
      <h2>知的財産権</h2>
      <p>当サイトに掲載する文章・画像・ロゴ等の権利は、当サイトまたは正当な権利者に帰属します。無断転載・複製を禁じます。</p>
      <h2>禁止事項</h2>
      <ul>
        <li>法令・公序良俗に反する行為、虚偽・誤認を招く表現。</li>
        <li>当サイト・第三者の権利を侵害する行為（著作権・商標等）。</li>
        <li>無断のスクレイピング・自動取得・リバースエンジニアリング。</li>
      </ul>
      <h2>広告・アフィリエイト</h2>
      <p>当サイトには広告（アフィリエイトリンク）が含まれます。掲載順位や推奨は編集基準に基づき、広告の有無のみで決定されません。</p>
      <h2>準拠法</h2>
      <p>本ポリシーは日本法に準拠します。</p>
      <p><small>最終更新日：2025-09-15</small></p>
    </LegalPage>
  );
}
