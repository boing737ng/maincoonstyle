import type { MetadataRoute } from "next";
import { getSiteData } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteData().siteUrl.replace(/\/$/, "");
  const routes = [
    "",
    "/about",
    "/breed",
    "/kittens",
    "/cats",
    "/females",
    "/furniture",
    "/contacts",
  ];

  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
