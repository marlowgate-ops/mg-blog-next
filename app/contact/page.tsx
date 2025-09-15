import LegalPage from "@/components/LegalPage";

export const metadata = {
  title: "お問い合わせ｜Marlow Gate",
  description: "お問い合わせ窓口（メール）"
};

export default function Page() {
  return (
    <LegalPage title="お問い合わせ">
      <p>ご意見・ご要望・掲載依頼・表現修正のご連絡は、以下のメールアドレスまでお願いします。</p>
      <p><strong><a href="mailto:support@marlowgate.com">support@marlowgate.com</a></strong></p>
      <p>※ アフィリエイトの規約に関わる表現修正のご要請には、原則24–72時間以内に対応します。</p>
    </LegalPage>
  );
}
