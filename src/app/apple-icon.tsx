import { ImageResponse } from "next/og";

export const runtime = "edge";

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
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          borderRadius: "36px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "160px",
            height: "160px",
            borderRadius: "32px",
            border: "4px solid #3b82f6",
          }}
        >
          <span
            style={{
              fontSize: "72px",
              fontWeight: "bold",
              color: "#fafafa",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            TN
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
