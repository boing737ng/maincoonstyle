"use client";

import type { AnimalPhoto } from "@prisma/client";
import { useActionState } from "react";
import {
  deletePhotoAction,
  setCoverAction,
  movePhotoAction,
} from "@/app/admin/actions";
import { publicUrl } from "@/lib/shared";

function PhotoControls({ photo, animalId, index, total }: { photo: AnimalPhoto; animalId: string; index: number; total: number }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-1 px-2 py-1 text-xs">
      <div className="flex items-center gap-1">
        <MoveButton animalId={animalId} photoId={photo.id} direction="up" disabled={index === 0} label="↑" />
        <MoveButton animalId={animalId} photoId={photo.id} direction="down" disabled={index === total - 1} label="↓" />
      </div>
      <div className="flex items-center gap-1">
        <CoverButton animalId={animalId} photoId={photo.id} isCover={photo.isCover} />
        <DeleteButton animalId={animalId} photoId={photo.id} />
      </div>
    </div>
  );
}

function MoveButton({ animalId, photoId, direction, disabled, label }: { animalId: string; photoId: string; direction: "up" | "down"; disabled: boolean; label: string }) {
  const [state, formAction, pending] = useActionState(movePhotoAction, { ok: false });
  return (
    <form action={formAction}>
      <input type="hidden" name="animalId" value={animalId} />
      <input type="hidden" name="photoId" value={photoId} />
      <input type="hidden" name="direction" value={direction} />
      <button
        type="submit"
        disabled={disabled || pending}
        className="rounded border border-border px-1.5 py-0.5 text-muted hover:border-accent hover:text-foreground disabled:opacity-30"
        title={direction === "up" ? "Вверх" : "Вниз"}
      >
        {label}
      </button>
      {state.error ? <span className="text-red-400">{state.error}</span> : null}
    </form>
  );
}

function CoverButton({ animalId, photoId, isCover }: { animalId: string; photoId: string; isCover: boolean }) {
  const [state, formAction, pending] = useActionState(setCoverAction, { ok: false });
  return (
    <form action={formAction}>
      <input type="hidden" name="animalId" value={animalId} />
      <input type="hidden" name="photoId" value={photoId} />
      <button
        type="submit"
        disabled={pending}
        className={
          isCover
            ? "rounded border border-accent bg-accent px-1.5 py-0.5 text-accent-foreground"
            : "rounded border border-border px-1.5 py-0.5 text-muted hover:border-accent hover:text-foreground"
        }
        title="Сделать обложкой"
      >
        {isCover ? "Обложка" : "Сделать обложкой"}
      </button>
      {state.error ? <span className="text-red-400">{state.error}</span> : null}
    </form>
  );
}

function DeleteButton({ animalId, photoId }: { animalId: string; photoId: string }) {
  const [state, formAction, pending] = useActionState(deletePhotoAction, { ok: false });
  return (
    <form action={formAction}>
      <input type="hidden" name="animalId" value={animalId} />
      <input type="hidden" name="photoId" value={photoId} />
      <button
        type="submit"
        disabled={pending}
        className="rounded border border-border px-1.5 py-0.5 text-red-400 hover:border-red-600/40 hover:bg-red-600/10"
        title="Удалить фото"
      >
        ✕
      </button>
      {state.error ? <span className="text-red-400">{state.error}</span> : null}
    </form>
  );
}

export function PhotoManager({
  animalId,
  photos,
}: {
  animalId: string;
  photos: AnimalPhoto[];
}) {
  if (photos.length === 0) return null;

  return (
    <div className="mb-8 rounded-lg border border-border bg-card p-4">
      <p className="mb-3 text-sm font-medium">Существующие фото</p>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {photos.map((photo, i) => (
          <li key={photo.id} className="overflow-hidden rounded-md border border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={publicUrl(photo.objectKey)}
              alt={`фото ${i + 1}`}
              className="h-24 w-full object-cover"
            />
            <PhotoControls photo={photo} animalId={animalId} index={i} total={photos.length} />
          </li>
        ))}
      </ul>
    </div>
  );
}