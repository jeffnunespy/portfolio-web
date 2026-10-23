import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Mesmo marco de trabalho implementado da legenda (components/project/ProjectMark.tsx),
// em laranja sobre o terreno noturno.
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
        <path
          d="M6 1 11 11H1Z"
          fill="none"
          stroke="#e8703f"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </div>,
    size,
  );
}
