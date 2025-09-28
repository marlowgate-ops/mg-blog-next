import Image from "next/image";
import LegalPage from "@/components/LegalPage";
import EditorialBlock from "@/components/EditorialBlock";

export const metadata = {
  title: "運営者情報｜Marlow Gate",
  description: "Marlow Gate の運営者情報とサイトの目的をご案内します。"
};

export default function Page() {
  return (
    <LegalPage title="運営者情報（About）">
      <p>Marlow Gate は、FX/CFD に関する「比較・レビュー・口座開設ガイド・実務ツール」を提供し、利用者が安全にブローカーを選び、ムダな損失を防ぐための意思決定を支援します。</p>
      
      <EditorialBlock showPolicyLink={false} />
      
      <h2>運営者</h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <Image 
          src="/images/marlow-gate.png" 
          alt="Marlow Gate ロゴ" 
          width={36} 
          height={36} 
          className="rounded-full" 
        />
        <div>
          <p style={{ margin: 0, fontWeight: '600' }}>名称：Marlow Gate</p>
          <p style={{ margin: 0 }}>連絡先：<a href="mailto:support@marlowgate.com">support@marlowgate.com</a></p>
        </div>
      </div>
      <h2 id="policy">編集方針</h2>
      <ul>
        <li>比較・ランキングは編集基準に基づき作成し、広告の有無のみで順位を決定しません。</li>
        <li>価格や条件は変動するため、最新情報は各公式サイトをご確認ください。</li>
        <li>実取引・ヒアリング・ドキュメントレビューで初心者にも分かりやすい基準を採用。</li>
        <li>検証手順：ブローカーサポートへの問い合わせ、デモ口座での操作確認、公式資料の精査。</li>
      </ul>
      <h2>免責事項</h2>
      <ul>
        <li>投資判断は自己責任で行い、必要に応じて専門家にご相談ください。</li>
        <li>当サイトの情報によって生じた損失について責任を負いかねます。</li>
      </ul>
      <p><small>最終更新日：2025-09-15</small></p>
    </LegalPage>
  );
}
