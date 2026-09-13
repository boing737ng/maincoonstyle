import "server-only";
import { prisma } from "@/lib/prisma";
import type { ProductCategory } from "@prisma/client";

export async function getPublishedProducts(category?: ProductCategory) {
  return prisma.product.findMany({
    where: { published: true, ...(category ? { category } : {}) },
    include: { photos: { orderBy: { sortOrder: "asc" } } },
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
  });
}

export async function getAllProducts() {
  return prisma.product.findMany({
    include: { photos: { orderBy: { sortOrder: "asc" } } },
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
  });
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: { photos: { orderBy: { sortOrder: "asc" } } },
  });
}
