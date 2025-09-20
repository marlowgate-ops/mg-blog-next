import RankingCard from "@/components/RankingCard";
import { brokers, Broker } from "@/data/brokers";

type Mode = "cost" | "app" | "execution" | "total";

export default function RankingList({ mode = "total", limit = 10 }: { mode?: Mode; limit?: number }) {
  const list = [...brokers].filter(b => b.state !== "preparing");
  const sorted = list.sort((a, b) => {
    if (mode === "total") return (b.score ?? 0) - (a.score ?? 0);
    return (b.subs?.[mode] ?? 0) - (a.subs?.[mode] ?? 0);
  }).slice(0, limit);
  return (
    <div style={{display:"grid", gap: 12}}>
      {sorted.map((b, idx) => (
        <RankingCard key={b.id} index={idx+1} broker={b} />
      ))}
    </div>
  );
}
