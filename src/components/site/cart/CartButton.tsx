"use client";

import { useCart, openCart } from "./cart-store";

export function CartButton() {
  const items = useCart();

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={`Корзина, изделий: ${items.length}`}
      className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:border-accent hover:text-accent-hover"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className="h-5 w-5"
      >
        <path d="M4 7h16l-1.4 11.2a2 2 0 0 1-2 1.8H7.4a2 2 0 0 1-2-1.8L4 7Z" />
        <path d="M8.5 9.5V6.8a3.5 3.5 0 0 1 7 0v2.7" />
      </svg>
      {items.length > 0 ? (
        <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-bold text-accent-foreground">
          {items.length}
        </span>
      ) : null}
    </button>
  );
}
