import { ImageResponse } from "next/og";

export const size = {
  width: 192,
  height: 192,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)",
          color: "#f8fafc",
          fontSize: 56,
          fontWeight: 700,
          letterSpacing: "-0.05em",
        }}
      >
        ROI
      </div>
    ),
    { ...size }
  );
}
