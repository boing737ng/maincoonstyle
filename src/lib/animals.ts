import "server-only";
import { prisma } from "@/lib/prisma";
import type { AnimalCategory, AnimalStatus, Prisma } from "@prisma/client";

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
      father: { include: { photos: { orderBy: { sortOrder: "asc" } } } },
      mother: { include: { photos: { orderBy: { sortOrder: "asc" } } } },
    },
  });
}

export async function getPublishedAnimalById(id: string) {
  return prisma.animal.findFirst({
    where: { id, published: true },
    include: {
      photos: { orderBy: { sortOrder: "asc" } },
      father: { include: { photos: { orderBy: { sortOrder: "asc" } } } },
      mother: { include: { photos: { orderBy: { sortOrder: "asc" } } } },
    },
  });
}

export async function getParentOptions() {
  return prisma.animal.findMany({
    where: { category: { in: ["MALE", "FEMALE"] } },
    select: { id: true, name: true, category: true, published: true },
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });
}

export type KittenFilters = {
  sex?: string;
  color?: string;
  status?: AnimalStatus;
  sort?: "sortOrder" | "price-asc" | "price-desc" | "newest";
};

export async function getKittens(filters: KittenFilters = {}) {
  const where: Prisma.AnimalWhereInput = {
    category: "KITTEN",
    published: true,
    ...(filters.sex ? { sex: filters.sex } : {}),
    ...(filters.color ? { color: filters.color } : {}),
    ...(filters.status ? { status: filters.status } : {}),
  };

  const orderBy: Prisma.AnimalOrderByWithRelationInput[] = (() => {
    switch (filters.sort) {
      case "price-asc":
        return [{ price: "asc" }];
      case "price-desc":
        return [{ price: "desc" }];
      case "newest":
        return [{ birthDate: "desc" }];
      default:
        return [{ sortOrder: "asc" }, { createdAt: "desc" }];
    }
  })();

  return prisma.animal.findMany({
    where,
    orderBy,
    include: {
      photos: { orderBy: { sortOrder: "asc" } },
    },
  });
}

export async function getKittenFilterOptions() {
  const kittens = await prisma.animal.findMany({
    where: { category: "KITTEN", published: true },
    select: { sex: true, color: true },
  });

  const sexes = [...new Set(kittens.map((k) => k.sex).filter(Boolean))] as string[];
  const colors = [
    ...new Set(kittens.map((k) => k.color).filter(Boolean)),
  ] as string[];

  return { sexes, colors };
}
