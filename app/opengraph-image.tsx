import { ImageResponse } from "next/og";

export const alt =
  "Jeeni — We turn futurist research into measurable value";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",
          color: "#ffffff",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: "linear-gradient(135deg, #0369a1, #ca8a04)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              fontWeight: 800,
              color: "#04101a",
            }}
          >
            J
          </div>
          <div style={{ fontSize: 40, fontWeight: 700 }}>Jeeni</div>
        </div>

        <div
          style={{
            fontSize: 66,
            fontWeight: 800,
            lineHeight: 1.08,
            maxWidth: 940,
          }}
        >
          We turn futurist research into measurable value.
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 30, color: "#cbd5e1" }}>
          <span style={{ color: "#eab308", fontWeight: 700 }}>Measurable AI ROI</span>
          <span>· Revenue · Time Reclaimed · Cost Optimization</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
