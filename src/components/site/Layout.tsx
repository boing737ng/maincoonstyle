"use client";

import { useState } from "react";
import Link from "next/link";

export const NAV_LINKS = [
  { href: "/", label: "Главная" },
  { href: "/kittens", label: "Котята" },
  { href: "/breed", label: "О породе" },
  { href: "/furniture", label: "Лежанки и мебель" },
  { href: "/about", label: "О нас" },
  { href: "/contacts", label: "Контакты" },
];

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

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <div className="container-site flex h-16 items-center justify-between gap-4">
        <Link href="/" className="text-lg font-bold tracking-tight text-foreground">
          {siteName}
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted transition-colors hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <a
          href={`tel:${phoneTel}`}
          className="hidden whitespace-nowrap text-sm font-semibold text-accent sm:block"
        >
          {phoneDisplay}
        </a>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={open}
          className="flex h-10 w-10 items-center justify-center rounded-md border border-border text-foreground lg:hidden"
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
        className={`lg:hidden ${
          open ? "block" : "hidden"
        } border-t border-border bg-background/95 backdrop-blur`}
      >
        <nav className="container-site flex flex-col py-3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-3 text-sm text-muted transition-colors hover:bg-card hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={`tel:${phoneTel}`}
            className="mt-2 rounded-md px-3 py-3 text-sm font-semibold text-accent hover:bg-card"
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
      className="fixed inset-x-0 bottom-0 z-50 flex h-14 items-center justify-center gap-2 bg-accent text-base font-semibold text-accent-foreground transition-colors hover:bg-accent-hover sm:hidden"
    >
      Позвонить · {phoneDisplay}
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
  return (
    <footer className="border-t border-border bg-card/40">
      <div className="container-site flex flex-col items-center gap-3 py-10 text-center text-sm text-muted">
        <span className="text-base font-semibold text-foreground">
          {siteName}
        </span>
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-accent">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-6">
          <a href={`tel:${phoneTel}`} className="hover:text-accent">
            {phoneDisplay}
          </a>
          <a href={`mailto:${email}`} className="hover:text-accent">
            {email}
          </a>
        </div>
        <span>
          © {year} {siteName}. Все права защищены.
        </span>
      </div>
    </footer>
  );
}
