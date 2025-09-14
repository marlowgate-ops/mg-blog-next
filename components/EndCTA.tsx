import Link from "next/link";
import styles from "./endcta.module.css";

type Props = {
  variant?: string | null;
  href?: string;
  label?: string;
  benefits?: string[];
};

export default function EndCTA(props: Props) {
  const href =
    props.href ||
    process.env.NEXT_PUBLIC_CTA_URL ||
    "https://marlowgate.com/gumroad";
  const label = props.label || process.env.NEXT_PUBLIC_CTA_LABEL || "詳細を見る";
  const benefitsRaw =
    props.benefits ||
    (process.env.NEXT_PUBLIC_CTA_BENEFITS || "")
      .split("|")
      .map((s) => s.trim())
      .filter(Boolean);

  const variant =
    props.variant || process.env.NEXT_PUBLIC_COPY_VARIANT || "A";

  return (
    <section className={styles.wrap} data-variant={variant}>
      <div className={styles.body}>
        <div className={styles.text}>
          <h3 className={styles.title}>
            業務テンプレ｜ICS検証ノート
          </h3>
          <p className={styles.desc}>
            読者限定の実務ノウハウを凝縮。すぐ使える雛形と検証プロセスをセットで提供します。
          </p>
          {benefitsRaw.length > 0 && (
            <ul className={styles.list}>
              {benefitsRaw.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          )}
        </div>
        <div className={styles.actions}>
          <Link href={href} className={styles.btn}>
            {label}
          </Link>
          <Link href="/blog" className={styles.ghost}>
            記事一覧へ
          </Link>
        </div>
      </div>
    </section>
  );
}
