export const SITE_CONFIG = {
  name: "Diário dos Sonhos — Escala CEC",
  shortName: "Diário dos Sonhos",
  description:
    "Plataforma gratuita e mobile-first para registrar sonhos com a Escala CEC (Clareza, Emoção e Confirmação), inspirada no livro Sonhos e Mediunidade na Umbanda, de Rodrigo Queiroz.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://diariodossonhosumbanda.vercel.app",
  locale: "pt_BR",
  brand: {
    name: "Camis GameDev",
    url: "http://cmbelem.vercel.app/",
  },
  book: {
    title: "Sonhos e Mediunidade na Umbanda",
    author: "Rodrigo Queiroz",
    affiliateUrl:
      process.env.NEXT_PUBLIC_BOOK_AFFILIATE_URL ||
      "https://amzn.to/SEU-LINK-DE-AFILIADO-AQUI",
    ctaLabel: "Adquirir o livro oficial",
    disclaimer:
      "Plataforma gratuita, independente e sem fins lucrativos inspirada nos estudos do livro Sonhos e Mediunidade na Umbanda, de Rodrigo Queiroz. Este projeto não reproduz nem substitui a obra original.",
  },
  pix: {
    key: process.env.NEXT_PUBLIC_PIX_KEY || "sua-chave-pix@email.com",
    recipient: process.env.NEXT_PUBLIC_PIX_RECIPIENT || "Camis GameDev",
    message:
      "Esta ferramenta é 100% gratuita, aberta e sem anúncios invasivos. Se ela apoia sua jornada de autoconhecimento e estudo, contribua voluntariamente com qualquer valor via Pix.",
  },
} as const;

export function isPlaceholderValue(value: string): boolean {
  return (
    value.includes("SEU-LINK-DE-AFILIADO") ||
    value.includes("sua-chave-pix@")
  );
}
