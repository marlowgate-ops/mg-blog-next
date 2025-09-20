import RankingCard from "@/components/RankingCard";
import { brokers } from "@/data/brokers";

type Mode = "cost" | "app" | "execution" | "total";

export default function RankingList({ mode = "total", limit = 10 }: { mode?: Mode; limit?: number }) {
  // 基データをコピーして安全に扱う
  const list = [...brokers].filter(b => (b as any)?.state !== "preparing");

  // 並び替え（用途別 or 総合）
  const sorted = list.sort((a: any, b: any) => {
    if (mode === "total") return ((b as any)?.score ?? 0) - ((a as any)?.score ?? 0);
    const ax = ((a as any)?.subs?.[mode] ?? 0);
    const bx = ((b as any)?.subs?.[mode] ?? 0);
    return bx - ax;
  }).slice(0, limit);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {sorted.map((b: any, idx: number) => (
        <RankingCard
          key={b?.id ?? `${idx}`}
          rank={idx + 1}
          brand={b?.name ?? b?.brand ?? "-"}
          score={b?.score ?? 0}
          highlights={b?.pros ?? []}
          cautions={b?.cons ?? []}
          ctaHref={b?.site ?? "#"}
          state={b?.state}
          subs={b?.subs}
        />
      ))}
    </div>
  );
}
