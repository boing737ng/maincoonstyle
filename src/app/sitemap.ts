import type { MetadataRoute } from "next";
import { getSiteData } from "@/lib/constants";
import { getPublishedAnimals } from "@/lib/animals";
import { publicUrl } from "@/lib/shared";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  const staticRoutes = routes.map((route) => ({
    url: `${base}${route}`,
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.7,
  }));

  const animals = await getPublishedAnimals();
  const animalRoutes = animals.map((animal) => ({
    url: `${base}/animals/${animal.id}`,
    lastModified: animal.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.6,
    images: animal.photos.map((photo) => publicUrl(photo.objectKey)),
  }));

  return [...staticRoutes, ...animalRoutes];
}
