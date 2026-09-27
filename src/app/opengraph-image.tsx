import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { getDefaultExperienceYears } from "@/lib/experience";

export const alt =
  "Thanaphat Chirutpadathorn (North) — Senior Engineering Manager & Technical Consultant";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  const experience = getDefaultExperienceYears();
  const skyline = await readFile(path.join(process.cwd(), "public/media/og-skyline.jpg"));
  const bg = `data:image/jpeg;base64,${skyline.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", backgroundColor: "#07090d" }}>
        <img src={bg} alt="" width={1200} height={630} style={{ position: "absolute", inset: 0, objectFit: "cover" }} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background: "linear-gradient(90deg, rgba(7,9,13,0.95) 0%, rgba(7,9,13,0.75) 45%, rgba(7,9,13,0.1) 100%)",
          }}
        />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 72px", width: "100%" }}>
          <div style={{ display: "flex", fontSize: 20, letterSpacing: 4, color: "#ff5a1f", textTransform: "uppercase" }}>
            Senior Engineering Manager · Healthcare Tech
          </div>
          <div style={{ display: "flex", fontSize: 128, fontWeight: 800, color: "#ede6d9", letterSpacing: -4, lineHeight: 1, marginTop: 16 }}>
            NORTH<span style={{ color: "#ff5a1f" }}>.</span>
          </div>
          <div style={{ display: "flex", fontSize: 40, color: "#ede6d9", marginTop: 20, maxWidth: 680, lineHeight: 1.2 }}>
            I turn software blueprints into systems that ship.
          </div>
          <div style={{ display: "flex", fontSize: 24, color: "#9a9384", marginTop: 28 }}>
            {`Thanaphat Chirutpadathorn · ${experience.totalYearsDisplay} yrs in software · 30+ engineers led`}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
