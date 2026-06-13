import { ImageResponse } from "next/og";

// Route segment config to optimize generation speed via edge execution
export const runtime = "edge";

// Image metadata specification (Standard browser favicon size)
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        fontSize: 20,
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#ffffff",
        borderRadius: "8px",
        fontWeight: 700,
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
