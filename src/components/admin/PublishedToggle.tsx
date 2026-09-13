"use client";

import { useActionState } from "react";
import { togglePublishedAction } from "@/app/admin/actions";

export function PublishedToggle({
  animalId,
  published,
}: {
  animalId: string;
  published: boolean;
}) {
  const [state, formAction, pending] = useActionState(
    async (prev: { ok: boolean; error?: string }, formData: FormData) => {
      const result = await togglePublishedAction(prev, formData);
      return result;
    },
    { ok: true }
  );

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={animalId} />
      <button
        type="submit"
        disabled={pending}
        title={published ? "Скрыть с сайта" : "Опубликовать на сайте"}
        className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition-colors disabled:opacity-50 ${
          published
            ? "border-green-600/40 bg-green-600/10 text-green-400 hover:bg-green-600/20"
            : "border-zinc-500/40 bg-zinc-700/20 text-zinc-300 hover:bg-zinc-700/40"
        }`}
      >
        <span
          aria-hidden
          className={`h-1.5 w-1.5 rounded-full ${
            published ? "bg-green-400" : "bg-zinc-400"
          }`}
        />
        {pending ? "..." : published ? "Опубликовано" : "Скрыто"}
      </button>
      {state.error ? (
        <span className="mt-1 block text-xs text-red-400">{state.error}</span>
      ) : null}
    </form>
  );
}
