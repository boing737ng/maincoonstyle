"use client";

import type { Animal, AnimalPhoto } from "@prisma/client";
import { useRef, useState, useTransition } from "react";
import {
  createAnimalAction,
  updateAnimalAction,
  type ActionResult,
} from "@/app/admin/actions";
import { CancelLink, ErrorMessage, Field, inputClass } from "@/components/admin/fields";
import { ALLOWED_PHOTO_TYPES, MAX_PHOTOS_PER_ANIMAL } from "@/lib/shared";

const CATEGORIES = [
  { value: "KITTEN", label: "Котята" },
  { value: "MALE", label: "Коты" },
  { value: "FEMALE", label: "Кошки" },
] as const;

const STATUSES = [
  { value: "AVAILABLE", label: "Свободен" },
  { value: "RESERVED", label: "Резерв" },
  { value: "SOLD", label: "Продан" },
] as const;

const SEXES = [
  { value: "", label: "Не указан" },
  { value: "Кот", label: "Кот" },
  { value: "Кошка", label: "Кошка" },
] as const;

type AnimalWithPhotos = Animal & { photos: AnimalPhoto[] };

function toDateInput(date: Date | null): string {
  if (!date) return "";
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function AnimalForm({ animal }: { animal?: AnimalWithPhotos }) {
  const isEdit = Boolean(animal);
  const serverAction = isEdit ? updateAnimalAction : createAnimalAction;

  const [files, setFiles] = useState<File[]>([]);
  const [coverIndex, setCoverIndex] = useState(0);
  const [photoError, setPhotoError] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [pending, startTransition] = useTransition();

  const formRef = useRef<HTMLFormElement>(null);

  function handleFiles(list: FileList | null) {
    setPhotoError(undefined);
    if (!list) return;
    const incoming = Array.from(list);
    if (files.length + incoming.length > MAX_PHOTOS_PER_ANIMAL) {
      setPhotoError(`Не более ${MAX_PHOTOS_PER_ANIMAL} фото`);
      return;
    }
    for (const f of incoming) {
      if (!ALLOWED_PHOTO_TYPES.includes(f.type)) {
        setPhotoError("Недопустимый тип файла");
        return;
      }
      if (f.size > 10 * 1024 * 1024) {
        setPhotoError("Файл больше 10 МБ");
        return;
      }
    }
    setFiles((prev) => [...prev, ...incoming]);
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    if (coverIndex >= files.length - 1) {
      setCoverIndex(0);
    }
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(undefined);

    const form = e.currentTarget;
    const formData = new FormData(form);

    files.forEach((file) => {
      formData.append("photos", file);
    });

    if (files.length > 0) {
      formData.append("coverIndex", String(coverIndex));
    } else {
      formData.append("coverIndex", "0");
    }

    if (files.length === 0) {
      formData.append("coverIndex", "0");
    }

    startTransition(async () => {
      const result = (await serverAction(
        { ok: false },
        formData
      )) as ActionResult;
      if (!result.ok && result.error) {
        setError(result.error);
      }
    });
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="space-y-6">
      {isEdit ? <input type="hidden" name="id" value={animal!.id} /> : null}
      <ErrorMessage message={error ?? photoError} />

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Категория">
          <select name="category" defaultValue={animal?.category ?? "KITTEN"} className={inputClass}>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Кличка">
          <input name="name" required defaultValue={animal?.name ?? ""} className={inputClass} />
        </Field>

        <Field label="Дата рождения">
          <input
            type="date"
            name="birthDate"
            defaultValue={toDateInput(animal?.birthDate ?? null)}
            className={inputClass}
          />
        </Field>

        <Field label="Пол">
          <select
            name="sex"
            defaultValue={animal?.sex ?? ""}
            className={inputClass}
          >
            {SEXES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Окрас">
          <input name="color" defaultValue={animal?.color ?? ""} className={inputClass} />
        </Field>

        <Field label="Цена (₽)">
          <input
            type="number"
            name="price"
            min={0}
            defaultValue={animal?.price ?? ""}
            className={inputClass}
          />
        </Field>

        <Field label="Статус">
          <select name="status" defaultValue={animal?.status ?? "AVAILABLE"} className={inputClass}>
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Родители">
        <input name="parents" defaultValue={animal?.parents ?? ""} className={inputClass} />
      </Field>

      <Field label="Характер">
        <textarea
          name="personality"
          rows={4}
          defaultValue={animal?.personality ?? ""}
          className={inputClass}
        />
      </Field>

      <div className="rounded-lg border-2 border-accent/40 bg-accent/5 p-4">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            name="published"
            defaultChecked={animal?.published ?? true}
            className="mt-0.5 h-5 w-5 rounded border-border bg-card accent-[var(--accent)]"
          />
          <span>
            <span className="block font-medium text-foreground">
              Опубликовать на сайте
            </span>
            <span className="mt-0.5 block text-sm text-muted">
              Если отключено — животное не будет видно посетителям.
            </span>
          </span>
        </label>
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <p className="mb-2 text-sm font-medium">Фото (до {MAX_PHOTOS_PER_ANIMAL})</p>
        {photoError ? (
          <p className="mb-2 text-xs text-red-400">{photoError}</p>
        ) : null}
        <input
          type="file"
          accept={ALLOWED_PHOTO_TYPES.join(",")}
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="block text-sm text-muted file:mr-3 file:rounded-md file:border-0 file:bg-accent file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-accent-foreground hover:file:bg-accent-hover"
        />
        {files.length > 0 ? (
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {files.map((file, i) => (
              <li key={`${file.name}-${i}`} className="overflow-hidden rounded-md border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="h-24 w-full object-cover"
                />
                <div className="flex items-center justify-between px-2 py-1 text-xs">
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="coverIndex"
                      value={i}
                      checked={coverIndex === i}
                      onChange={() => setCoverIndex(i)}
                      className="accent-[var(--accent)]"
                    />
                    Обложка
                  </label>
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="text-red-400 hover:text-red-300"
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-xs text-muted">Фото ещё не выбраны</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover disabled:opacity-50"
        >
          {pending ? "Сохранение..." : "Сохранить"}
        </button>
        <CancelLink />
      </div>
    </form>
  );
}