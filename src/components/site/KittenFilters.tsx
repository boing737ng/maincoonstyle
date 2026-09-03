"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const STATUS_OPTIONS = [
  { value: "", label: "Любой статус" },
  { value: "AVAILABLE", label: "Свободен" },
  { value: "RESERVED", label: "Резерв" },
  { value: "SOLD", label: "Продан" },
];

const SORT_OPTIONS = [
  { value: "sortOrder", label: "По порядку" },
  { value: "price-asc", label: "Сначала дешевле" },
  { value: "price-desc", label: "Сначала дороже" },
  { value: "newest", label: "Сначала новорождённые" },
];

const inputClass =
  "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";

export function KittenFilters({
  sexes,
  colors,
}: {
  sexes: string[];
  colors: string[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/kittens?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <label className="block">
        <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">
          Пол
        </span>
        <select
          value={searchParams.get("sex") ?? ""}
          onChange={(e) => update("sex", e.target.value)}
          className={inputClass}
        >
          <option value="">Любой пол</option>
          {sexes.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">
          Окрас
        </span>
        <select
          value={searchParams.get("color") ?? ""}
          onChange={(e) => update("color", e.target.value)}
          className={inputClass}
        >
          <option value="">Любой окрас</option>
          {colors.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">
          Статус
        </span>
        <select
          value={searchParams.get("status") ?? ""}
          onChange={(e) => update("status", e.target.value)}
          className={inputClass}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">
          Сортировка
        </span>
        <select
          value={searchParams.get("sort") ?? "sortOrder"}
          onChange={(e) => update("sort", e.target.value)}
          className={inputClass}
        >
          {SORT_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
