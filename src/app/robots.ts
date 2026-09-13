import type { MetadataRoute } from "next";
import { getSiteData } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  const site = getSiteData();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin",
    },
    sitemap: `${site.siteUrl.replace(/\/$/, "")}/sitemap.xml`,
  };
}
