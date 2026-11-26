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
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #00B4F5 0%, #00A1E0 55%, #0077A8 100%)",
          borderRadius: "40px",
        }}
      >
        <svg width="144" height="144" viewBox="0 0 128 128" fill="none">
          <path
            d="M62 24C48.5 24 37.5 35 37.5 48.5C37.5 62 48.5 73 62 73C67.2 73 72 71.3 76 68.5C64.2 67.3 55 57.4 55 45.2C55 36.1 60.2 28.2 67.8 24.4C65.9 24.1 64 24 62 24Z"
            fill="#FFA300"
          />
          <path
            d="M92 25L95.5 34.5L105 38L95.5 41.5L92 51L88.5 41.5L79 38L88.5 34.5L92 25Z"
            fill="#FFFFFF"
          />
          <path
            d="M23 79C38 71.5 55 75 64 84C73 75 90 71.5 105 79V103C90 96.5 74 99 64 107C54 99 38 96.5 23 103V79Z"
            fill="#FFFFFF"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
