"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";

const orderSchema = z.object({
  customerName: z.string().trim().min(2, "Укажите имя").max(120),
  phone: z.string().trim().min(6, "Укажите телефон").max(40),
  comment: z.string().trim().max(2000).optional(),
  productIds: z
    .array(z.string().min(1))
    .min(1, "Корзина пуста")
    .max(20, "Слишком много изделий в одной заявке"),
});

export type PlaceOrderResult = { ok: true } | { ok: false; error: string };

export async function placeOrderAction(
  input: unknown
): Promise<PlaceOrderResult> {
  const parsed = orderSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Неверные данные",
    };
  }

  const { customerName, phone, comment, productIds } = parsed.data;
  const uniqueIds = [...new Set(productIds)];

  const products = await prisma.product.findMany({
    where: { id: { in: uniqueIds }, published: true },
    select: { id: true, category: true, number: true },
    orderBy: [{ category: "asc" }, { number: "asc" }],
  });

  if (products.length === 0) {
    return { ok: false, error: "Изделия не найдены. Обновите корзину." };
  }

  const items = products.map((product) => ({
    productId: product.id,
    label: `${product.category === "BED" ? "Лежанка" : "Мебель"} № ${product.number}`,
  }));

  try {
    await prisma.order.create({
      data: {
        customerName,
        phone,
        comment: comment || null,
        itemsJson: JSON.stringify(items),
      },
    });
  } catch (error) {
    console.error("placeOrderAction failed:", error);
    return {
      ok: false,
      error: "Не удалось отправить заявку. Попробуйте ещё раз.",
    };
  }

  return { ok: true };
}
