"use client";

import { useSyncExternalStore } from "react";

export type CartItem = { productId: string; label: string };

const STORAGE_KEY = "largebrush-cart";
const CHANGE_EVENT = "largebrush-cart-change";
export const CART_OPEN_EVENT = "largebrush-cart-open";

export function openCart() {
  window.dispatchEvent(new CustomEvent(CART_OPEN_EVENT));
}

function writeCart(items: CartItem[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
}

export function addToCart(item: CartItem) {
  const items = readCart();
  if (items.some((existing) => existing.productId === item.productId)) return;
  writeCart([...items, item]);
}

export function removeFromCart(productId: string) {
  writeCart(readCart().filter((existing) => existing.productId !== productId));
}

export function clearCart() {
  writeCart([]);
}

function subscribe(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

/* useSyncExternalStore требует стабильные ссылки снапшотов, иначе — бесконечный цикл. */
const EMPTY: CartItem[] = [];
let snapshot: CartItem[] = EMPTY;

function sameItems(a: CartItem[], b: CartItem[]): boolean {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  return a.every(
    (item, index) =>
      item.productId === b[index].productId && item.label === b[index].label
  );
}

function parseCart(): CartItem[] {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return EMPTY;
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed)) return EMPTY;
  const items = parsed.filter(
    (item): item is CartItem =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as CartItem).productId === "string" &&
      typeof (item as CartItem).label === "string"
  );
  return items.length === 0 ? EMPTY : items;
}

export function readCart(): CartItem[] {
  if (typeof window === "undefined") return EMPTY;
  let items: CartItem[];
  try {
    items = parseCart();
  } catch {
    items = EMPTY;
  }
  if (sameItems(snapshot, items)) return snapshot;
  snapshot = items;
  return snapshot;
}

export function useCart(): CartItem[] {
  return useSyncExternalStore(subscribe, readCart, () => EMPTY);
}
