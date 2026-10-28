import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Ponto de autoria da assinatura, na paleta oficial.
export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0c0f0e",
      }}
    >
      <svg width="22" height="22" viewBox="0 0 12 12">
        <circle cx="6" cy="6" r="3" fill="#ff9a6b" />
      </svg>
    </div>,
    size,
  );
}
