"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Product, ProductPhoto } from "@prisma/client";
import { createProductAction, updateProductAction, type ActionResult } from "@/app/admin/actions";
import { ErrorMessage, Field, inputClass } from "@/components/admin/fields";
import { CustomSelect, type SelectOption } from "@/components/CustomSelect";

const PRODUCT_CATEGORIES: SelectOption[] = [
  { value: "BED", label: "Лежанка" },
  { value: "FURNITURE", label: "Мебель" },
];

export function ProductForm({ product }: { product?: Product & { photos: ProductPhoto[] } }) {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();
  const [category, setCategory] = useState<string>(product?.category ?? "BED");
  const action = product ? updateProductAction : createProductAction;
  return <form className="space-y-6" onSubmit={(event) => { event.preventDefault(); const data = new FormData(event.currentTarget); startTransition(async () => { const result = await action({ ok: false }, data) as ActionResult; if (result.ok) { router.push("/admin"); router.refresh(); } else setError(result.error); }); }}>
    <ErrorMessage message={error} />
    {product ? <input name="id" type="hidden" value={product.id} /> : null}
    <fieldset className="rounded-lg border border-border bg-card p-4"><div className="grid gap-4 sm:grid-cols-2"><Field label="Категория"><CustomSelect value={category} onChange={setCategory} options={PRODUCT_CATEGORIES} ariaLabel="Категория" /><input type="hidden" name="category" value={category} /></Field><Field label="Номер"><input name="number" required className={inputClass} defaultValue={product?.number} /></Field></div></fieldset>
    <fieldset className="rounded-lg border border-border bg-card p-4"><Field label="Фото"><input name="photos" type="file" multiple accept="image/jpeg,image/png,image/webp" className="block text-sm text-muted" /></Field></fieldset>
    <label className="flex gap-3 text-sm text-foreground"><input name="published" type="checkbox" defaultChecked={product?.published ?? true} className="mt-1" />Опубликовать на сайте</label>
    <button type="submit" disabled={pending} className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground disabled:opacity-50">{pending ? "Сохранение..." : "Сохранить"}</button>
  </form>;
}
