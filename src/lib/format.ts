import type { AnimalStatus } from "@prisma/client";

export const STATUS_LABELS: Record<AnimalStatus, string> = {
  AVAILABLE: "Свободен",
  RESERVED: "Резерв",
  SOLD: "Продан",
};

export const STATUS_STYLES: Record<AnimalStatus, string> = {
  AVAILABLE: "border-emerald-300/40 bg-[#23301c]/85 text-[#b1d598]",
  RESERVED: "border-amber-200/40 bg-[#332815]/85 text-[#e8c084]",
  SOLD: "border-stone-300/30 bg-[#3a332b]/85 text-stone-300",
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
