import { ImageResponse } from "next/og";

export const runtime = "edge";

// Standard Apple touch icon dimensions
export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        fontSize: 110,
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#ffffff",
        borderRadius: "40px",
        fontWeight: 800,
        fontFamily: "sans-serif",
      }}
    >
      R
    </div>,
    {
      ...size,
    },
  );
}
