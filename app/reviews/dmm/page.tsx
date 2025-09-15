
import ReviewDMM from "@/components/ReviewDMM"

export const metadata = {
  title: "DMM.com証券の評価と口座開設ガイド｜Marlow Gate",
  description: "DMM.com証券の特徴、良い点/注意点、口座開設までの流れを簡潔に。"
}

export default function Page() {
  return (
    <main>
      <h1>DMM.com証券の評価と口座開設ガイド</h1>
      <p>初心者でも扱いやすいUIとサポート体制、国内大手としての安心感が特徴です。スプレッド・約定・入出金などの運用条件は時期により変わるため、最新情報は公式で確認してください。</p>
      <ReviewDMM />
    </main>
  )
}
