"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { CustomSelect, type SelectOption } from "@/components/CustomSelect";

const STATUS_OPTIONS: SelectOption[] = [
  { value: "", label: "Любой статус" },
  { value: "AVAILABLE", label: "Свободен" },
  { value: "RESERVED", label: "Резерв" },
  { value: "SOLD", label: "Продан" },
];

const SORT_OPTIONS: SelectOption[] = [
  { value: "sortOrder", label: "По порядку" },
  { value: "price-asc", label: "Сначала дешевле" },
  { value: "price-desc", label: "Сначала дороже" },
  { value: "newest", label: "Сначала новорождённые" },
];

function FilterSelect({
  label,
  value,
  options,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  options: SelectOption[];
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <span className="mb-2 block text-sm font-medium text-muted">
        {label}
      </span>
      <CustomSelect
        value={value}
        onChange={onChange}
        options={options}
        placeholder={placeholder}
        ariaLabel={label}
      />
    </div>
  );
}

export function KittenFilters({
  sexes,
  colors,
}: {
  sexes: string[];
  colors: string[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const sexOptions: SelectOption[] = [
    { value: "", label: "Любой пол" },
    ...sexes.map((s) => ({ value: s, label: s })),
  ];
  const colorOptions: SelectOption[] = [
    { value: "", label: "Любой окрас" },
    ...colors.map((c) => ({ value: c, label: c })),
  ];

  const hasFilters =
    searchParams.get("sex") ||
    searchParams.get("color") ||
    searchParams.get("status") ||
    searchParams.get("sort");

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      startTransition(() => {
        router.push(`/kittens?${params.toString()}`, { scroll: false });
      });
    },
    [router, searchParams]
  );

  const reset = useCallback(() => {
    startTransition(() => {
      router.push("/kittens", { scroll: false });
    });
  }, [router]);

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <FilterSelect
          label="Пол"
          value={searchParams.get("sex") ?? ""}
          options={sexOptions}
          placeholder="Любой пол"
          onChange={(v) => update("sex", v)}
        />
        <FilterSelect
          label="Окрас"
          value={searchParams.get("color") ?? ""}
          options={colorOptions}
          placeholder="Любой окрас"
          onChange={(v) => update("color", v)}
        />
        <FilterSelect
          label="Статус"
          value={searchParams.get("status") ?? ""}
          options={STATUS_OPTIONS}
          placeholder="Любой статус"
          onChange={(v) => update("status", v)}
        />
        <FilterSelect
          label="Сортировка"
          value={searchParams.get("sort") ?? "sortOrder"}
          options={SORT_OPTIONS}
          placeholder="По порядку"
          onChange={(v) => update("sort", v)}
        />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <button
          type="button"
          onClick={reset}
          disabled={!hasFilters}
          className="text-sm text-muted transition-colors hover:text-amber-soft disabled:cursor-not-allowed disabled:opacity-40"
        >
          Сбросить фильтры
        </button>
        {isPending && (
          <span className="text-sm text-muted" aria-live="polite">
            Обновление…
          </span>
        )}
      </div>
    </div>
  );
}
