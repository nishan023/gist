import { ImageResponse } from "next/og";
export const alt = "Nishan's Gists — Code snippets, ideas and notes.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 80,
        background: "#0d1117",
        color: "#e6edf3",
      }}
    >
      <div style={{ fontSize: 28, color: "#2f81f7", marginBottom: 45 }}>
        Nishan's Gists
      </div>
      <div style={{ fontSize: 64, letterSpacing: -2 }}>Nishan Dhakal</div>
      <div style={{ fontSize: 32, letterSpacing: -1, color: "#7d8590", marginTop: 16 }}>
        Code snippets, ideas and notes - all in one place.
      </div>
      <div style={{ fontSize: 23, marginTop: 50, color: "#7d8590" }}>
        gist.dhakalnishan.com.np
      </div>
    </div>,
    size,
  );
}
