import { ImageResponse } from "next/og";
import { brand } from "@/content/brand";

export const alt = `${brand.name}, design, development and AI`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#121517",
          color: "white",
          padding: "72px",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 4 }}>{brand.name.toUpperCase()}</div>
        <div style={{ display: "flex", fontSize: 84, letterSpacing: -3, lineHeight: 1 }}>
          Design. Build. Grow
          <span style={{ color: "#ef233c" }}>.</span>
        </div>
      </div>
    ),
    size,
  );
}
