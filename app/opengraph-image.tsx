export const runtime = "edge";
import { ImageResponse } from "next/og";

export const alt = "Marlow Gate Blog";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f5f7fb",
          backgroundImage: "linear-gradient(45deg, #f5f7fb 0%, #e2e8f0 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#ffffff",
            borderRadius: "24px",
            padding: "60px 80px",
            boxShadow: "0 20px 40px rgba(15, 23, 42, 0.1)",
            border: "1px solid rgba(15, 23, 42, 0.08)",
          }}
        >
          <div
            style={{
              fontSize: "72px",
              fontWeight: "800",
              color: "#0f172a",
              marginBottom: "24px",
              letterSpacing: "-0.02em",
            }}
          >
            Marlow Gate
          </div>
          <div
            style={{
              fontSize: "32px",
              color: "#475569",
              textAlign: "center",
              lineHeight: "1.4",
              maxWidth: "800px",
            }}
          >
            FX・投資情報ブログ
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "32px",
              fontSize: "20px",
              color: "#64748b",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                backgroundColor: "#06b6d4",
                borderRadius: "50%",
                marginRight: "12px",
              }}
            />
            信頼できる投資情報を提供
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
