"use client";

import type { Animal, AnimalPhoto, AnimalCategory } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import {
  createAnimalAction,
  updateAnimalAction,
  type ActionResult,
} from "@/app/admin/actions";
import { CancelLink, ErrorMessage, Field, inputClass } from "@/components/admin/fields";
import { CustomSelect, type SelectOption } from "@/components/CustomSelect";
import { ALLOWED_PHOTO_TYPES, MAX_PHOTOS_PER_ANIMAL, MAX_PHOTO_BYTES } from "@/lib/shared";

const CATEGORIES: SelectOption[] = [
  { value: "KITTEN", label: "Котята" },
  { value: "MALE", label: "Коты" },
  { value: "FEMALE", label: "Кошки" },
];

const STATUSES: SelectOption[] = [
  { value: "AVAILABLE", label: "Свободен" },
  { value: "RESERVED", label: "Резерв" },
  { value: "SOLD", label: "Продан" },
];

const SEXES: SelectOption[] = [
  { value: "", label: "Не указан" },
  { value: "Кот", label: "Кот" },
  { value: "Кошка", label: "Кошка" },
];

type ParentOption = { id: string; name: string; category: AnimalCategory; published: boolean };
type AnimalWithPhotos = Animal & { photos: AnimalPhoto[]; father?: Animal | null; mother?: Animal | null };

function toDateInput(date: Date | null): string {
  if (!date) return "";
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function AnimalForm({ animal, parentOptions = [] }: { animal?: AnimalWithPhotos; parentOptions?: ParentOption[] }) {
  const isEdit = Boolean(animal);
  const serverAction = isEdit ? updateAnimalAction : createAnimalAction;
  const router = useRouter();

  const [files, setFiles] = useState<File[]>([]);
  const [coverIndex, setCoverIndex] = useState(0);
  const [photoError, setPhotoError] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [pending, startTransition] = useTransition();
  const [category, setCategory] = useState<string>(animal?.category ?? "KITTEN");
  const [sex, setSex] = useState<string>(animal?.sex ?? "");
  const [status, setStatus] = useState<string>(animal?.status ?? "AVAILABLE");
  const fathers = parentOptions.filter(
    (parent) => parent.category === "MALE" && parent.id !== animal?.id
  );
  const mothers = parentOptions.filter(
    (parent) => parent.category === "FEMALE" && parent.id !== animal?.id
  );

  const previews = useMemo(
    () => files.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [files]
  );
  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [previews]);

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
      if (f.size > MAX_PHOTO_BYTES) {
        setPhotoError(`Файл больше ${Math.round(MAX_PHOTO_BYTES / (1024 * 1024))} МБ`);
        return;
      }
    }
    setFiles((prev) => [...prev, ...incoming]);
  }

  function removeFile(index: number) {
    const remaining = files.length - 1;
    setFiles((prev) => prev.filter((_, i) => i !== index));
    if (coverIndex >= remaining) {
      setCoverIndex(remaining > 0 ? remaining - 1 : 0);
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

    formData.append("coverIndex", String(files.length > 0 ? coverIndex : 0));

    startTransition(async () => {
      const result = (await serverAction(
        { ok: false },
        formData
      )) as ActionResult;
      if (!result.ok && result.error) {
        setError(result.error);
      } else if (result.ok) {
        router.push("/admin");
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {isEdit ? <input type="hidden" name="id" value={animal!.id} /> : null}
      <ErrorMessage message={error ?? photoError} />

      <fieldset className="rounded-lg border border-border bg-card p-4">
        <SectionTitle>Основная информация</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Категория">
            <CustomSelect
              value={category}
              onChange={setCategory}
              options={CATEGORIES}
            />
            <input type="hidden" name="category" value={category} />
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
            {category === "KITTEN" ? (
              <>
                <CustomSelect value={sex} onChange={setSex} options={SEXES} />
                <input type="hidden" name="sex" value={sex} />
              </>
            ) : (
              <div className="flex h-10 items-center rounded-md border border-border bg-background px-3 text-sm text-muted">
                {category === "MALE" ? "Кот" : "Кошка"}
              </div>
            )}
          </Field>

          <Field label="Окрас">
            <input name="color" defaultValue={animal?.color ?? ""} className={inputClass} />
          </Field>

          {category === "KITTEN" ? (
            <Field label="Цена (₽)">
              <input
                type="number"
                name="price"
                min={0}
                defaultValue={animal?.price ?? ""}
                className={inputClass}
              />
            </Field>
          ) : null}

          {category === "KITTEN" ? (
            <Field label="Статус">
              <CustomSelect value={status} onChange={setStatus} options={STATUSES} />
              <input type="hidden" name="status" value={status} />
            </Field>
          ) : null}
        </div>
      </fieldset>

      <fieldset className="rounded-lg border border-border bg-card p-4">
        <SectionTitle>Описание</SectionTitle>
        <div className="space-y-4">
          {category === "KITTEN" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Отец">
                <select name="fatherId" defaultValue={animal?.fatherId ?? ""} className={inputClass}>
                  <option value="">Не указан</option>
                  {fathers.map((father) => <option key={father.id} value={father.id}>{father.name}{father.published ? "" : " (не опубликован)"}</option>)}
                </select>
              </Field>
              <Field label="Мать">
                <select name="motherId" defaultValue={animal?.motherId ?? ""} className={inputClass}>
                  <option value="">Не указана</option>
                  {mothers.map((mother) => <option key={mother.id} value={mother.id}>{mother.name}{mother.published ? "" : " (не опубликована)"}</option>)}
                </select>
              </Field>
            </div>
          ) : null}

          {category === "KITTEN" ? (
            <Field label="Характер">
              <textarea
                name="personality"
                rows={4}
                defaultValue={animal?.personality ?? ""}
                className={inputClass}
              />
            </Field>
          ) : null}
        </div>
      </fieldset>

      <fieldset className="rounded-lg border border-border bg-card p-4">
        <SectionTitle>Фото (до {MAX_PHOTOS_PER_ANIMAL})</SectionTitle>
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
            {previews.map((preview, i) => (
              <li key={`${preview.file.name}-${i}`} className="overflow-hidden rounded-md border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview.url}
                  alt={preview.file.name}
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
      </fieldset>

      <div className="rounded-lg border-2 border-accent/40 bg-accent/5 p-4">
        <SectionTitle>Публикация</SectionTitle>
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

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-accent">
      {children}
    </h2>
  );
}
