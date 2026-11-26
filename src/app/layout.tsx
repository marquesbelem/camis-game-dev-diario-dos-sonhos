import type { Metadata, Viewport } from "next";
import { Bungee, Raleway, Ubuntu } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SITE_CONFIG } from "@/config/site";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const ubuntu = Ubuntu({
  variable: "--font-ubuntu",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const bungee = Bungee({
  variable: "--font-bungee",
  subsets: ["latin"],
  weight: ["400"],
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8FAFC" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: "Diário dos Sonhos — Escala CEC | Umbanda & Autoconhecimento",
    template: "%s | Diário dos Sonhos — Escala CEC",
  },
  description: SITE_CONFIG.description,
  keywords: [
    "diário dos sonhos",
    "escala CEC",
    "sonhos e mediunidade na umbanda",
    "Rodrigo Queiroz",
    "sonho mediúnico",
    "registro de sonhos",
    "clareza emoção confirmação",
    "umbanda",
    "autoconhecimento espiritual",
  ],
  authors: [{ name: SITE_CONFIG.brand.name, url: SITE_CONFIG.brand.url }],
  creator: SITE_CONFIG.brand.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: SITE_CONFIG.locale,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.shortName,
    title: "Diário dos Sonhos — Escala CEC (Clareza, Emoção e Confirmação)",
    description: SITE_CONFIG.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Diário dos Sonhos — Escala CEC",
    description: SITE_CONFIG.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${raleway.variable} ${ubuntu.variable} ${bungee.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
