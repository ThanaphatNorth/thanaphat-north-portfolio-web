import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 14,
          background: "#0a0a0a",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 8,
          border: "2px solid #3b82f6",
        }}
      >
        <span
          style={{
            color: "#fafafa",
            fontWeight: "bold",
            fontFamily: "system-ui, sans-serif",
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
