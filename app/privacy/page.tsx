import LegalPage from "@/components/LegalPage";

export const metadata = {
  title: "プライバシーポリシー｜Marlow Gate",
  description: "個人情報・Cookie・アクセス解析・広告リンクの取扱いについて。"
};

export default function Page() {
  return (
    <LegalPage title="プライバシーポリシー">
      <h2>1. 適用範囲</h2>
      <p>本ポリシーは、<strong>blog.marlowgate.com</strong>（以下「当サイト」）で提供するコンテンツ・機能に適用されます。</p>
      <h2>2. 取得する情報</h2>
      <ul>
        <li>アクセス解析のためのトラッキング情報（例：Google Analytics 4）。</li>
        <li>お問い合わせ時に取得するメールアドレス等の連絡情報。</li>
        <li>アフィリエイト計測のための識別子（ASP/公式IBのパラメータ）。</li>
      </ul>
      <h2>3. Cookie 等の使用</h2>
      <p>当サイトは、閲覧体験の改善、アクセス解析、アフィリエイト計測の目的で Cookie を使用する場合があります。多くのブラウザは Cookie の受け入れ可否を設定できます。</p>
      <h2>4. 第三者提供</h2>
      <p>法律に基づく場合を除き、本人の同意なく個人情報を第三者に提供しません。アクセス解析や広告計測は各提供者のプライバシーポリシーに従います。</p>
      <h2>5. 免責</h2>
      <p>掲載内容の正確性には努めますが、その完全性・最新性・有用性を保証しません。外部サイトの利用は各自の責任で行ってください。</p>
      <h2>6. 改定</h2>
      <p>本ポリシーは予告なく改定する場合があります。重要な変更は本ページで告知します。</p>
      <h2>7. 連絡先</h2>
      <p>本ポリシーに関するお問い合わせ：<a href="mailto:support@marlowgate.com">support@marlowgate.com</a></p>
      <p><small>最終更新日：2025-09-15</small></p>
    </LegalPage>
  );
}
