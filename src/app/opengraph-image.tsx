import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "ฐานพัฒน์ จิรุตม์ผะดาทร (Thanaphat North) - Engineering Manager & Software Developer | Freelance พัฒนาระบบ";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          backgroundImage:
            "radial-gradient(circle at 25% 25%, #1a1a2e 0%, transparent 50%), radial-gradient(circle at 75% 75%, #16213e 0%, transparent 50%)",
        }}
      >
        {/* Border accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #3b82f6)",
          }}
        />

        {/* Content container */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px",
          }}
        >
          {/* Logo/Initials */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100px",
              height: "100px",
              borderRadius: "20px",
              backgroundColor: "#1a1a1a",
              border: "3px solid #3b82f6",
              marginBottom: "40px",
            }}
          >
            <span
              style={{
                fontSize: "42px",
                fontWeight: "bold",
                color: "#fafafa",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              TN
            </span>
          </div>

          {/* Name */}
          <h1
            style={{
              fontSize: "56px",
              fontWeight: "bold",
              color: "#fafafa",
              margin: "0 0 8px 0",
              fontFamily: "system-ui, sans-serif",
              textAlign: "center",
            }}
          >
            Thanaphat Chirutpadathorn
          </h1>

          {/* Nickname */}
          <p
            style={{
              fontSize: "28px",
              color: "#71717a",
              margin: "0 0 20px 0",
              fontFamily: "system-ui, sans-serif",
              textAlign: "center",
            }}
          >
            (North)
          </p>

          {/* Title */}
          <p
            style={{
              fontSize: "32px",
              color: "#3b82f6",
              margin: "0 0 24px 0",
              fontFamily: "system-ui, sans-serif",
              textAlign: "center",
            }}
          >
            Engineering Manager & Software Developer
          </p>

          {/* Description */}
          <p
            style={{
              fontSize: "22px",
              color: "#a1a1aa",
              margin: 0,
              fontFamily: "system-ui, sans-serif",
              textAlign: "center",
              maxWidth: "800px",
              lineHeight: 1.5,
            }}
          >
            8+ years in Software Development • Agile Expert • Freelance Available
          </p>
        </div>

        {/* URL at bottom */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span
            style={{
              fontSize: "20px",
              color: "#71717a",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            thanaphat-north.com
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
