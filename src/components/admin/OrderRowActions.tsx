"use client";

import { useActionState } from "react";
import {
  deleteOrderAction,
  toggleOrderStatusAction,
} from "@/app/admin/actions";

type Status = "NEW" | "DONE";

export function OrderStatusButton({
  orderId,
  status,
}: {
  orderId: string;
  status: Status;
}) {
  const [, formAction, pending] = useActionState(toggleOrderStatusAction, {
    ok: true,
  });

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={orderId} />
      <button
        type="submit"
        disabled={pending}
        className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors disabled:opacity-50 ${
          status === "NEW"
            ? "border-accent/50 bg-accent/10 text-accent hover:bg-accent/20"
            : "border-green-600/40 bg-green-600/10 text-green-400 hover:bg-green-600/20"
        }`}
      >
        {pending ? "..." : status === "NEW" ? "Новая — обработать" : "Обработана"}
      </button>
    </form>
  );
}

export function OrderDeleteButton({ orderId }: { orderId: string }) {
  const [, formAction, pending] = useActionState(deleteOrderAction, {
    ok: true,
  });

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={orderId} />
      <button
        type="submit"
        disabled={pending}
        className="rounded-md border border-border px-3 py-1 text-xs text-muted transition-colors hover:border-red-500/50 hover:text-red-400 disabled:opacity-50"
      >
        {pending ? "..." : "Удалить"}
      </button>
    </form>
  );
}
