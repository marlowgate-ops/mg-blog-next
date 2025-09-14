import { ImageResponse } from "next/og";
import type { Metadata } from "next";

export const runtime = "edge";
export const alt = "Marlow Gate Blog";

export default async function Image() {
  const title = "記事タイトル（自動OG）";
  const sub = "Marlow Gate Blog";
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg,#f0f9ff,#e0f2fe)",
          fontSize: 48,
          fontWeight: 800,
          color: "#0f172a",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "60px 70px",
            width: "100%",
          }}
        >
          <div style={{ fontSize: 22, color: "#0ea5e9", marginBottom: 16 }}>
            {sub}
          </div>
          <div style={{ lineHeight: 1.15 }}>{title}</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
