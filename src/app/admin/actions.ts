"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { animalSchema, loginSchema } from "@/lib/schemas";
import { verifyAdminCredentials } from "@/lib/auth";
import { createSession, destroySession, getSession } from "@/lib/session";
import {
  uploadPhoto,
  deletePhoto as deletePhotoFromStorage,
} from "@/lib/storage";
import {
  MAX_PHOTOS_PER_ANIMAL,
  MAX_PHOTO_BYTES,
  ALLOWED_PHOTO_TYPES,
} from "@/lib/constants";

export type ActionResult = {
  ok: boolean;
  error?: string;
};

async function requireAdmin() {
  const session = await getSession();
  if (!session) {
    throw new Error("Не авторизован");
  }
  return session;
}

export async function loginAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const parsed = loginSchema.safeParse({
    login: formData.get("login"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message || "Неверные данные",
    };
  }

  const admin = await verifyAdminCredentials(
    parsed.data.login,
    parsed.data.password
  );

  if (!admin) {
    return { ok: false, error: "Неверный логин или пароль" };
  }

  await createSession(admin.id);
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}

function validatePhotos(files: File[]): ActionResult | null {
  if (files.length > MAX_PHOTOS_PER_ANIMAL) {
    return {
      ok: false,
      error: `Можно загрузить не более ${MAX_PHOTOS_PER_ANIMAL} фото`,
    };
  }
  for (const file of files) {
    if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
      return { ok: false, error: `Недопустимый тип файла: ${file.type}` };
    }
    if (file.size > MAX_PHOTO_BYTES) {
      return { ok: false, error: "Файл слишком большой (максимум 10 МБ)" };
    }
  }
  return null;
}

function parseAnimalForm(formData: FormData) {
  const raw: Record<string, unknown> = {
    category: formData.get("category"),
    number: formData.get("number"),
    name: formData.get("name"),
    birthDate: formData.get("birthDate") || null,
    sex: formData.get("sex"),
    color: formData.get("color"),
    price: formData.get("price") || null,
    parents: formData.get("parents"),
    personality: formData.get("personality"),
    status: formData.get("status"),
    published: formData.get("published") === "on",
    sortOrder: formData.get("sortOrder"),
  };
  return animalSchema.safeParse(raw);
}

export async function createAnimalAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  await requireAdmin();

  const parsed = parseAnimalForm(formData);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message || "Неверные данные",
    };
  }

  const files = formData
    .getAll("photos")
    .filter((f): f is File => f instanceof File && f.size > 0);

  const photoError = validatePhotos(files);
  if (photoError) return photoError;

  const coverIndex = Number(formData.get("coverIndex") ?? "0");
  const data = parsed.data;

  const animal = await prisma.animal.create({
    data: {
      category: data.category,
      number: data.number ?? null,
      name: data.name,
      birthDate: data.birthDate ?? null,
      sex: data.sex ?? null,
      color: data.color ?? null,
      price: data.price ?? null,
      parents: data.parents ?? null,
      personality: data.personality ?? null,
      status: data.status,
      published: data.published,
      sortOrder: data.sortOrder,
    },
  });

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const { objectKey } = await uploadPhoto(file);
    await prisma.animalPhoto.create({
      data: {
        animalId: animal.id,
        objectKey,
        sortOrder: i,
        isCover: i === coverIndex,
      },
    });
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function updateAnimalAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  await requireAdmin();

  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    return { ok: false, error: "Не указан идентификатор" };
  }

  const parsed = parseAnimalForm(formData);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message || "Неверные данные",
    };
  }

  const data = parsed.data;
  const animal = await prisma.animal.findUnique({
    where: { id },
    include: { photos: true },
  });
  if (!animal) {
    return { ok: false, error: "Животное не найдено" };
  }

  await prisma.animal.update({
    where: { id },
    data: {
      category: data.category,
      number: data.number ?? null,
      name: data.name,
      birthDate: data.birthDate ?? null,
      sex: data.sex ?? null,
      color: data.color ?? null,
      price: data.price ?? null,
      parents: data.parents ?? null,
      personality: data.personality ?? null,
      status: data.status,
      published: data.published,
      sortOrder: data.sortOrder,
    },
  });

  const files = formData
    .getAll("photos")
    .filter((f): f is File => f instanceof File && f.size > 0);

  if (files.length > 0) {
    const existingCount = animal.photos.length;
    if (existingCount + files.length > MAX_PHOTOS_PER_ANIMAL) {
      return {
        ok: false,
        error: `Всего фото не может превышать ${MAX_PHOTOS_PER_ANIMAL}`,
      };
    }
    const photoError = validatePhotos(files);
    if (photoError) return photoError;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const { objectKey } = await uploadPhoto(file);
      await prisma.animalPhoto.create({
        data: {
          animalId: id,
          objectKey,
          sortOrder: existingCount + i,
          isCover: false,
        },
      });
    }
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/admin/animals/${id}/edit`);
  redirect("/admin");
}

export async function deleteAnimalAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  await requireAdmin();

  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    return { ok: false, error: "Не указан идентификатор" };
  }

  const animal = await prisma.animal.findUnique({
    where: { id },
    include: { photos: true },
  });
  if (!animal) {
    return { ok: false, error: "Животное не найдено" };
  }

  for (const photo of animal.photos) {
    await deletePhotoFromStorage(photo.objectKey);
  }

  await prisma.animal.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deletePhotoAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  await requireAdmin();

  const photoId = formData.get("photoId");
  const animalId = formData.get("animalId");
  if (typeof photoId !== "string" || typeof animalId !== "string") {
    return { ok: false, error: "Неверные данные" };
  }

  const photo = await prisma.animalPhoto.findUnique({ where: { id: photoId } });
  if (!photo || photo.animalId !== animalId) {
    return { ok: false, error: "Фото не найдено" };
  }

  await deletePhotoFromStorage(photo.objectKey);
  await prisma.animalPhoto.delete({ where: { id: photoId } });

  revalidatePath(`/admin/animals/${animalId}/edit`);
  return { ok: true };
}

export async function setCoverAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  await requireAdmin();

  const photoId = formData.get("photoId");
  const animalId = formData.get("animalId");
  if (typeof photoId !== "string" || typeof animalId !== "string") {
    return { ok: false, error: "Неверные данные" };
  }

  await prisma.$transaction([
    prisma.animalPhoto.updateMany({
      where: { animalId },
      data: { isCover: false },
    }),
    prisma.animalPhoto.update({
      where: { id: photoId },
      data: { isCover: true },
    }),
  ]);

  revalidatePath(`/admin/animals/${animalId}/edit`);
  return { ok: true };
}

export async function movePhotoAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  await requireAdmin();

  const photoId = formData.get("photoId");
  const animalId = formData.get("animalId");
  const direction = formData.get("direction");
  if (
    typeof photoId !== "string" ||
    typeof animalId !== "string" ||
    (direction !== "up" && direction !== "down")
  ) {
    return { ok: false, error: "Неверные данные" };
  }

  const photos = await prisma.animalPhoto.findMany({
    where: { animalId },
    orderBy: { sortOrder: "asc" },
  });

  const index = photos.findIndex((p) => p.id === photoId);
  if (index === -1) {
    return { ok: false, error: "Фото не найдено" };
  }

  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= photos.length) {
    return { ok: true };
  }

  const current = photos[index];
  const other = photos[swapIndex];

  await prisma.$transaction([
    prisma.animalPhoto.update({
      where: { id: current.id },
      data: { sortOrder: other.sortOrder },
    }),
    prisma.animalPhoto.update({
      where: { id: other.id },
      data: { sortOrder: current.sortOrder },
    }),
  ]);

  revalidatePath(`/admin/animals/${animalId}/edit`);
  return { ok: true };
}
