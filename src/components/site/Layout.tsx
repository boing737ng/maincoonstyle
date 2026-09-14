"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { CartButton } from "@/components/site/cart/CartButton";

export const NAV_LINKS = [
  { href: "/", label: "Главная" },
  { href: "/about", label: "О нас" },
  { href: "/breed", label: "О породе" },
  { href: "/kittens", label: "Котята" },
  { href: "/cats", label: "Коты" },
  { href: "/females", label: "Кошки" },
  { href: "/furniture", label: "Лежанки, Мебель" },
  { href: "/contacts", label: "Контакты" },
];

function SiteName({ siteName, className }: { siteName: string; className?: string }) {
  const [first, ...rest] = siteName.split(" ");
  return (
    <span className={cn("inline-flex items-baseline gap-2", className)}>
      <span className="font-hand text-[1.5em] leading-none text-accent">
        {first}
      </span>
      {rest.length > 0 ? (
        <span className="font-display text-[0.62em] uppercase tracking-[0.32em] text-foreground">
          {rest.join(" ")}
        </span>
      ) : null}
    </span>
  );
}

export function Header({
  siteName,
  phoneDisplay,
  phoneTel,
}: {
  siteName: string;
  phoneDisplay: string;
  phoneTel: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function onPointerDown(e: PointerEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <header
      ref={menuRef}
      className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur"
    >
      <div className="container-site flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="font-display text-xl tracking-[0.02em] text-foreground"
        >
          <SiteName siteName={siteName} />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={cn(
                "border-b pb-1 text-sm transition-colors",
                isActive(link.href)
                  ? "border-accent text-accent-hover"
                  : "border-transparent text-muted hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <a
          href={`tel:${phoneTel}`}
          className="hidden whitespace-nowrap text-sm font-semibold text-foreground sm:block"
        >
          {phoneDisplay}
        </a>

        <CartButton />

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={open}
          className="flex h-11 w-11 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:border-accent hover:text-accent-hover lg:hidden"
        >
          <span className="flex flex-col items-center justify-center gap-1.5">
            <span
              className={`block h-0.5 w-5 bg-current transition-transform ${
                open ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-current transition-opacity ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-current transition-transform ${
                open ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      <div
        className={cn(
          "border-t border-border bg-background/95 backdrop-blur lg:hidden",
          open ? "block" : "hidden"
        )}
      >
        <nav className="container-site flex flex-col py-3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={cn(
                "px-3 py-3 text-sm transition-colors hover:text-accent-hover",
                isActive(link.href) ? "text-accent-hover" : "text-muted"
              )}
            >
              {link.label}
            </Link>
          ))}
          <a
            href={`tel:${phoneTel}`}
            className="mt-2 px-3 py-3 text-sm font-semibold text-foreground hover:text-accent-hover"
          >
            {phoneDisplay}
          </a>
        </nav>
      </div>
    </header>
  );
}

export function CallBar({
  phoneDisplay,
  phoneTel,
}: {
  phoneDisplay: string;
  phoneTel: string;
}) {
  return (
    <a
      href={`tel:${phoneTel}`}
      className="fixed inset-x-3 bottom-3 z-50 flex h-14 items-center justify-center gap-2 rounded-lg border border-accent/50 bg-card text-base font-semibold text-foreground shadow-[0_12px_32px_rgb(0_0_0_/_0.35)] transition-colors hover:border-accent hover:text-accent-hover sm:hidden"
    >
      Позвонить: {phoneDisplay}
    </a>
  );
}

export function Footer({
  siteName,
  phoneDisplay,
  phoneTel,
  email,
}: {
  siteName: string;
  phoneDisplay: string;
  phoneTel: string;
  email: string;
}) {
  const year = new Date().getFullYear();
  const pathname = usePathname();
  return (
    <footer className="mt-10 border-t border-border">
      <div className="container-site flex flex-col items-center gap-3 py-10 text-center text-sm text-muted">
        <span className="font-display text-lg tracking-[0.02em] text-foreground">
          <SiteName siteName={siteName} />
        </span>
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "transition-colors hover:text-accent-hover",
                pathname === link.href ? "text-accent-hover" : ""
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-6">
          <a href={`tel:${phoneTel}`} className="hover:text-accent-hover">
            {phoneDisplay}
          </a>
          <a href={`mailto:${email}`} className="hover:text-accent-hover">
            {email}
          </a>
        </div>
        <p className="text-sm text-muted-strong">Домашний питомник мейн-кунов</p>
        <span className="text-xs text-muted-strong">
          © {year} {siteName}. Все права защищены.
        </span>
      </div>
    </footer>
  );
}
