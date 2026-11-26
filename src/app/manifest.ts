import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Diário dos Sonhos — Escala CEC",
    short_name: "Diário CEC",
    description:
      "Registro diário de sonhos com Escala CEC (Clareza, Emoção e Confirmação) inspirado na obra de Rodrigo Queiroz.",
    start_url: "/",
    display: "standalone",
    background_color: "#F8FAFC",
    theme_color: "#00A1E0",
    lang: "pt-BR",
    icons: [
      {
        src: "/app-icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/app-icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
