import "server-only";
import { prisma } from "@/lib/prisma";

export type OrderItem = { productId: string; label: string };

export function parseOrderItems(itemsJson: string): OrderItem[] {
  try {
    const parsed: unknown = JSON.parse(itemsJson);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is OrderItem =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as OrderItem).productId === "string" &&
        typeof (item as OrderItem).label === "string"
    );
  } catch {
    return [];
  }
}

export function getOrders() {
  return prisma.order.findMany({ orderBy: { createdAt: "desc" } });
}
