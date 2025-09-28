import Image from "next/image";
import LegalPage from "@/components/LegalPage";

export const metadata = {
  title: "運営者情報｜Marlow Gate",
  description: "Marlow Gate の運営者情報とサイトの目的をご案内します。"
};

export default function Page() {
  return (
    <LegalPage title="運営者情報（About）">
      <p>Marlow Gate は、金融・投資・保険・家計最適化 に関する「比較・レビュー・口座開設ガイド・実務ツール」を提供し、利用者が安全かつ合理的にサービスを選べるよう意思決定を支援します。</p>
      
      <h2>運営者</h2>
      <div style={{ 
        background: 'var(--surface-weak)', 
        borderRadius: 'var(--radius-lg)', 
        padding: 'var(--space-lg)',
        marginBottom: '24px',
        display: 'flex', 
        alignItems: 'flex-start', 
        gap: '12px'
      }}>
        <Image 
          src="/images/marlow-gate.png" 
          alt="Marlow Gate ロゴ" 
          width={36} 
          height={36} 
          className="rounded-full" 
        />
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: 0, marginBottom: '8px', fontWeight: '600' }}>Marlow Gate 編集部</h3>
          <p style={{ margin: 0, marginBottom: '12px', lineHeight: '1.6' }}>
            金融・投資・保険・家計最適化などに関する「比較・レビュー・口座開設ガイド・実務ツール」を専門に制作する編集チーム。実取引・ヒアリング・ドキュメントレビューに基づく、初心者にも分かりやすい基準を採用します。
          </p>
          <p style={{ margin: 0 }}>
            連絡先：<a href="mailto:support@marlowgate.com">support@marlowgate.com</a>
          </p>
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
