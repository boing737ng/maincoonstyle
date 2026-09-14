"use client";

import { addToCart, removeFromCart, useCart } from "./cart-store";

export function AddToCartButton({
  productId,
  label,
}: {
  productId: string;
  label: string;
}) {
  const items = useCart();
  const inCart = items.some((item) => item.productId === productId);

  if (inCart) {
    return (
      <button
        type="button"
        onClick={() => removeFromCart(productId)}
        className="btn btn-ghost mt-3 h-10 w-full"
      >
        В корзине — убрать
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => addToCart({ productId, label })}
      className="btn btn-solid mt-3 h-10 w-full"
    >
      В корзину
    </button>
  );
}
