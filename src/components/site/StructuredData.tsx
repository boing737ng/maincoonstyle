import type { SiteData } from "@/lib/constants";

export function StructuredData({ site }: { site: SiteData }) {
  const sameAs = [site.facebook, site.instagram].filter(Boolean);
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${site.siteUrl}#organization`,
        name: site.name,
        url: site.siteUrl,
        logo: `${site.siteUrl}/icon.svg`,
        telephone: site.phoneTel,
        email: site.email,
        ...(sameAs.length > 0 ? { sameAs } : {}),
      },
      {
        "@type": "WebSite",
        "@id": `${site.siteUrl}#website`,
        name: site.name,
        url: site.siteUrl,
        publisher: { "@id": `${site.siteUrl}#organization` },
        inLanguage: "ru-RU",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
