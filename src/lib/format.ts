import type { AnimalStatus } from "@prisma/client";

export const STATUS_LABELS: Record<AnimalStatus, string> = {
  AVAILABLE: "Свободен",
  RESERVED: "Резерв",
  SOLD: "Продан",
};

export const STATUS_STYLES: Record<AnimalStatus, string> = {
  AVAILABLE: "bg-green-600/15 text-green-400 border-green-600/40",
  RESERVED: "bg-amber-600/15 text-amber-400 border-amber-600/40",
  SOLD: "bg-zinc-600/15 text-zinc-400 border-zinc-600/40",
};

export const CATEGORY_LABELS: Record<string, string> = {
  KITTEN: "Котята",
  MALE: "Коты",
  FEMALE: "Кошки",
};

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ru-RU").format(price) + " ₽";
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}
