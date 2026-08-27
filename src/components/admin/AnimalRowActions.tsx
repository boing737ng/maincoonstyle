"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { deleteAnimalAction } from "@/app/admin/actions";

export function AnimalRowActions({
  animalId,
}: {
  animalId: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [state, formAction, pending] = useActionState(deleteAnimalAction, {
    ok: false,
  });

  if (confirming) {
    return (
      <div className="flex items-center gap-2 text-xs">
        <span className="text-muted">Удалить?</span>
        <form action={formAction}>
          <input type="hidden" name="id" value={animalId} />
          <button
            type="submit"
            disabled={pending}
            className="rounded border border-red-600/40 bg-red-600/10 px-2 py-0.5 text-red-400 hover:bg-red-600/20"
          >
            Да
          </button>
        </form>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="rounded border border-border px-2 py-0.5 text-muted hover:text-foreground"
        >
          Нет
        </button>
        {state.error ? <span className="text-red-400">{state.error}</span> : null}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 text-xs">
      <Link
        href={`/admin/animals/${animalId}/edit`}
        className="text-accent hover:text-accent-hover"
      >
        Изменить
      </Link>
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="text-muted hover:text-red-400"
      >
        Удалить
      </button>
    </div>
  );
}
