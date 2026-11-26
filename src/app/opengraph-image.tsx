import { ImageResponse } from "next/og";

export const alt =
  "Diário dos Sonhos — Escala CEC (Clareza, Emoção e Confirmação)";
export const size = {
  width: 1200,
  height: 630,
};
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
          padding: "64px",
          background:
            "linear-gradient(135deg, #0F172A 0%, #005F87 55%, #00A1E0 100%)",
          color: "#F8FAFC",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            background: "rgba(255, 163, 0, 0.16)",
            border: "1px solid rgba(255, 163, 0, 0.55)",
            borderRadius: "9999px",
            padding: "10px 22px",
            fontSize: "24px",
            color: "#FFD180",
            alignSelf: "flex-start",
          }}
        >
          Escala CEC • Clareza • Emoção • Confirmação
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div
            style={{
              fontSize: "68px",
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
            }}
          >
            Diário dos Sonhos
          </div>
          <div
            style={{
              fontSize: "30px",
              color: "#E2E8F0",
              maxWidth: "900px",
              lineHeight: 1.35,
            }}
          >
            Plataforma gratuita e privada inspirada em Sonhos e Mediunidade na
            Umbanda, de Rodrigo Queiroz.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(255, 255, 255, 0.22)",
            paddingTop: "24px",
            fontSize: "22px",
            color: "#BAE6FD",
          }}
        >
          <span>100% Gratuito • Banco Local no Dispositivo</span>
          <span style={{ color: "#FFA300", fontWeight: 700 }}>
            Desenvolvido por Camis GameDev
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
