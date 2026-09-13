"use client";

import { useActionState, useState } from "react";
import { deleteProductAction } from "@/app/admin/actions";

export function ProductDeleteButton({ productId }: { productId: string }) {
  const [confirming, setConfirming] = useState(false);
  const [state, action, pending] = useActionState(deleteProductAction, { ok: false });
  if (!confirming) return <button type="button" onClick={() => setConfirming(true)} className="text-sm text-red-400">Удалить товар</button>;
  return <div className="flex items-center gap-3 text-sm"><span className="text-muted">Удалить товар и все его фото?</span><form action={action}><input name="id" type="hidden" value={productId} /><button disabled={pending} className="text-red-400">Да, удалить</button></form><button type="button" onClick={() => setConfirming(false)} className="text-muted">Отмена</button>{state.error ? <span className="text-red-400">{state.error}</span> : null}</div>;
}
