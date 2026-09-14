"use client";

import { useEffect, useState, useTransition, type FormEvent } from "react";
import Link from "next/link";
import { placeOrderAction } from "@/app/(site)/furniture/actions";
import { clearCart, removeFromCart, useCart } from "./cart-store";

export function CartDrawer() {
  const items = useCart();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    function onOpen() {
      setOpen(true);
    }
    window.addEventListener("largebrush-cart-open", onOpen);
    return () => window.removeEventListener("largebrush-cart-open", onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  function close() {
    setOpen(false);
    if (sent) setSent(false);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await placeOrderAction({
        customerName: name,
        phone,
        comment: comment || undefined,
        productIds: items.map((item) => item.productId),
      });
      if (result.ok) {
        setSent(true);
        clearCart();
        setName("");
        setPhone("");
        setComment("");
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <div
      className={`fixed inset-0 z-[70] ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <div
        onClick={close}
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      <aside
        role="dialog"
        aria-label="Корзина"
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-border bg-background shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="font-display text-xl text-foreground">Корзина</h2>
          <button
            type="button"
            onClick={close}
            aria-label="Закрыть корзину"
            className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted transition-colors hover:border-accent hover:text-accent-hover"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden
              className="h-4 w-4"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>

        {sent ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-accent/50 bg-accent/10">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
                className="h-7 w-7 text-accent"
              >
                <path d="m5 12.5 4.5 4.5L19 7.5" />
              </svg>
            </span>
            <p className="font-display text-2xl text-foreground">
              Заявка отправлена!
            </p>
            <p className="leading-relaxed text-muted">
              Мы свяжемся с вами в ближайшее время, чтобы обсудить изделия и
              детали заказа.
            </p>
            <button type="button" onClick={close} className="btn btn-solid mt-2">
              Отлично
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <p className="leading-relaxed text-muted">
              Корзина пока пуста. Загляните в наш каталог изделий ручной работы!
            </p>
            <Link href="/furniture" onClick={close} className="btn btn-solid">
              Лежанки, Мебель
            </Link>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-1 flex-col overflow-hidden">
            <ul className="flex-1 divide-y divide-border overflow-y-auto px-6">
              {items.map((item) => (
                <li
                  key={item.productId}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <span className="font-display text-lg text-foreground">
                    {item.label}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.productId)}
                    aria-label={`Убрать ${item.label}`}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border text-muted transition-colors hover:border-accent hover:text-accent-hover"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      aria-hidden
                      className="h-3.5 w-3.5"
                    >
                      <path d="M6 6l12 12M18 6L6 18" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>

            <div className="space-y-3 border-t border-border px-6 py-5">
              <p className="text-sm leading-relaxed text-muted">
                Оставьте контакты — мы свяжемся с вами, чтобы подтвердить заказ.
              </p>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Ваше имя"
                required
                minLength={2}
                maxLength={120}
                className="h-11 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-strong focus:border-accent focus:outline-none"
              />
              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="Телефон"
                required
                minLength={6}
                maxLength={40}
                className="h-11 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-strong focus:border-accent focus:outline-none"
              />
              <textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Комментарий (необязательно)"
                rows={2}
                maxLength={2000}
                className="w-full resize-none rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-strong focus:border-accent focus:outline-none"
              />
              {error ? (
                <p className="text-sm text-red-400">{error}</p>
              ) : null}
              <button
                type="submit"
                disabled={pending}
                className="btn btn-solid w-full disabled:opacity-60"
              >
                {pending ? "Отправляем..." : "Отправить заявку"}
              </button>
            </div>
          </form>
        )}
      </aside>
    </div>
  );
}
