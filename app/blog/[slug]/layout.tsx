import type { ReactNode } from "react";
import EndCTA from "../../components/EndCTA";

export default function BlogSlugLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      {/* 記事末尾固定CTA */}
      <EndCTA />
    </>
  );
}
