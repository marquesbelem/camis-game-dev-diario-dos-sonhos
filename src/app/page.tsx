import { DreamJournalApp } from "@/components/DreamJournalApp";
import { SITE_CONFIG } from "@/config/site";

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Web",
    inLanguage: "pt-BR",
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "BRL",
    },
    author: {
      "@type": "Organization",
      name: SITE_CONFIG.brand.name,
      url: SITE_CONFIG.brand.url,
    },
    citation: {
      "@type": "Book",
      name: SITE_CONFIG.book.title,
      author: {
        "@type": "Person",
        name: SITE_CONFIG.book.author,
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DreamJournalApp />
    </>
  );
}
