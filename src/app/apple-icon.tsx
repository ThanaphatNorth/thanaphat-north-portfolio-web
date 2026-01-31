import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 72,
          background: "linear-gradient(135deg, #0a0a0a 0%, #171717 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 40,
          border: "4px solid #3b82f6",
        }}
      >
        <span
          style={{
            color: "#fafafa",
            fontWeight: "bold",
            fontFamily: "system-ui, sans-serif",
            letterSpacing: "-2px",
          }}
        >
          TN
        </span>
      </div>
    ),
    {
      ...size,
    }
  );
}
