import { ImageResponse } from "next/og";

// Link preview image (Messenger, LinkedIn, Slack...). Text kept ASCII: the default OG font lacks Polish glyphs.
export const alt = "Marcel – Strony internetowe dla firm";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 96px",
          background: "#0a0a0a",
          color: "#ffffff",
        }}
      >
        <div style={{ fontSize: 40, color: "#a3a3a3" }}>Marcel</div>
        <div style={{ fontSize: 88, fontWeight: 700, lineHeight: 1.1, marginTop: 16 }}>
          Strony internetowe dla firm
        </div>
        <div style={{ fontSize: 36, color: "#a3a3a3", marginTop: 32 }}>
          Nowoczesne. Szybkie. Responsywne.
        </div>
        <div style={{ width: 120, height: 6, background: "#a16207", marginTop: 48, borderRadius: 3 }} />
      </div>
    ),
    size
  );
}
