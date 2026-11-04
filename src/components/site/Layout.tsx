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
  { href: "/furniture", label: "Лежанки и мебель" },
  { href: "/contacts", label: "Контакты" },
];

function SiteName({ siteName, className }: { siteName: string; className?: string }) {
  const [first, ...rest] = siteName.split(" ");
  return (
    <span className={cn("inline-flex min-w-0 max-w-full items-baseline gap-1.5 sm:gap-2", className)}>
      <span className="shrink-0 font-hand text-[1.75rem] leading-none text-accent sm:text-[2rem]">
        {first}
      </span>
      {rest.length > 0 ? (
        <span className="hidden truncate font-display text-[0.56em] uppercase tracking-[0.18em] text-foreground min-[480px]:inline sm:text-[0.62em] sm:tracking-[0.32em]">
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
      className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur"
    >
      <div className="container-site flex h-16 items-center justify-between gap-3 sm:gap-5">
        <Link
          href="/"
          className="site-header-brand min-w-0 shrink-0 py-2 font-display text-xl tracking-[0.01em] text-foreground"
        >
          <SiteName siteName={siteName} />
        </Link>

        <nav className="hidden items-center gap-5 xl:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={cn(
                "whitespace-nowrap border-b pb-1 text-sm transition-colors",
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
          className="hidden whitespace-nowrap text-sm font-semibold text-foreground min-[1600px]:block"
        >
          {phoneDisplay}
        </a>

        <div className="flex shrink-0 items-center gap-2.5">
          <CartButton />

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={open}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:border-accent hover:text-accent-hover xl:hidden"
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
      </div>

      <div
        className={cn(
          "max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-border bg-background/95 backdrop-blur xl:hidden",
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      // Показывать плашку только когда пользователь проскроллил Hero
      setScrolled(window.scrollY > 280);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!scrolled) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 p-3 sm:hidden animate-in fade-in duration-200">
      <a
        href={`tel:${phoneTel}`}
        className="pointer-events-auto mx-auto flex h-11 w-fit items-center justify-center gap-2 rounded-full border border-accent/40 bg-background/95 px-5 text-xs font-semibold text-foreground shadow-[0_8px_20px_rgb(0_0_0_/_0.18)] backdrop-blur-md transition-colors hover:border-accent hover:text-accent-hover"
      >
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3 w-3"
            aria-hidden
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </span>
        <span>Позвонить: {phoneDisplay}</span>
      </a>
    </div>
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
