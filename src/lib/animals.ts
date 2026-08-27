import "server-only";
import { prisma } from "@/lib/prisma";
import type { AnimalCategory } from "@prisma/client";

export async function getPublishedAnimals(category?: AnimalCategory) {
  return prisma.animal.findMany({
    where: {
      published: true,
      ...(category ? { category } : {}),
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    include: {
      photos: { orderBy: { sortOrder: "asc" } },
    },
  });
}

export async function getAllAnimals() {
  return prisma.animal.findMany({
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
    include: {
      photos: { orderBy: { sortOrder: "asc" } },
    },
  });
}

export async function getAnimalById(id: string) {
  return prisma.animal.findUnique({
    where: { id },
    include: {
      photos: { orderBy: { sortOrder: "asc" } },
    },
  });
}
