import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f4f1e8",
        border: "2px solid #1a1a17",
        color: "#1a1a17",
        fontSize: 20,
        fontWeight: 700,
      }}
    >
      F
    </div>,
    size,
  );
}
