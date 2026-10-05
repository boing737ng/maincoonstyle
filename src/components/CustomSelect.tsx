"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

export type SelectOption = { value: string; label: string };

export function CustomSelect({
  value,
  onChange,
  options,
  placeholder,
  className,
  buttonClassName,
  ariaLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  ariaLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={ariaLabel}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground transition-colors hover:border-accent/70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent",
          buttonClassName
        )}
      >
        <span className={cn("truncate", !selected && "text-muted")}>
          {selected ? selected.label : placeholder ?? "Выбрать"}
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className={cn(
            "shrink-0 text-muted transition-transform",
            open && "rotate-180"
          )}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <ul className="absolute z-50 mt-1 max-h-64 w-full overflow-auto rounded-md border border-border bg-card p-1 shadow-lg">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded px-3 py-2 text-left text-sm transition-colors",
                    isSelected
                      ? "bg-amber-soft/10 text-amber-soft"
                      : "text-foreground hover:bg-card-2"
                  )}
                >
                  <span>{option.label}</span>
                  {isSelected && (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
