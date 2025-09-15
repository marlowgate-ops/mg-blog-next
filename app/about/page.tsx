import LegalPage from "@/components/LegalPage";

export const metadata = {
  title: "運営者情報｜Marlow Gate",
  description: "Marlow Gate の運営者情報とサイトの目的をご案内します。"
};

export default function Page() {
  return (
    <LegalPage title="運営者情報（About）">
      <p>Marlow Gate は、FX/CFD に関する「比較・レビュー・口座開設ガイド・実務ツール」を提供し、利用者が安全にブローカーを選び、ムダな損失を防ぐための意思決定を支援します。</p>
      <h2>運営者</h2>
      <p>名称：Marlow Gate（マーロウ・ゲート）</p>
      <p>連絡先：<a href="mailto:support@marlowgate.com">support@marlowgate.com</a></p>
      <p>所在地：オンラインでの情報提供（郵送が必要な場合はメールにてご相談ください）</p>
      <h2>編集方針</h2>
      <ul>
        <li>比較・ランキングは編集基準に基づき作成し、広告の有無のみで順位を決定しません。</li>
        <li>価格や条件は変動するため、最新情報は各公式サイトをご確認ください。</li>
        <li>広告リンクには <code>rel="sponsored noopener nofollow"</code> を付与します。</li>
      </ul>
      <p><small>最終更新日：2025-09-15</small></p>
    </LegalPage>
  );
}
