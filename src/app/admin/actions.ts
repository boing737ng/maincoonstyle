"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { animalSchema, loginSchema, productSchema } from "@/lib/schemas";
import type { AnimalCategory, ProductCategory } from "@prisma/client";
import { Prisma } from "@prisma/client";
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

function parseCoverIndex(formData: FormData, fileCount: number): number | ActionResult {
  if (fileCount === 0) return 0;

  const value = formData.get("coverIndex");
  const index = typeof value === "string" ? Number(value) : Number.NaN;
  if (!Number.isInteger(index) || index < 0 || index >= fileCount) {
    return { ok: false, error: "Выберите корректную обложку" };
  }
  return index;
}

async function uploadAnimalPhotos(files: File[]): Promise<string[]> {
  const objectKeys: string[] = [];
  try {
    for (const file of files) {
      const { objectKey } = await uploadPhoto(file);
      objectKeys.push(objectKey);
    }
    return objectKeys;
  } catch (error) {
    await Promise.allSettled(objectKeys.map((objectKey) => deletePhotoFromStorage(objectKey)));
    throw error;
  }
}

function parseAnimalForm(formData: FormData) {
  const category = formData.get("category");
  const raw: Record<string, unknown> = {
    category,
    name: formData.get("name"),
    birthDate: formData.get("birthDate") || null,
    sex:
      category === "MALE"
        ? "Кот"
        : category === "FEMALE"
        ? "Кошка"
        : formData.get("sex"),
    color: formData.get("color"),
    price: formData.get("price") || null,
    fatherId: formData.get("fatherId") || null,
    motherId: formData.get("motherId") || null,
    personality: formData.get("personality"),
    status: category === "KITTEN" ? formData.get("status") : "AVAILABLE",
    published: formData.get("published") === "on",
  };
  return animalSchema.safeParse(raw);
}

async function validateParents(
  fatherId: string | null | undefined,
  motherId: string | null | undefined,
  animalId?: string
): Promise<ActionResult | null> {
  if ((fatherId && fatherId === animalId) || (motherId && motherId === animalId)) {
    return { ok: false, error: "Животное не может быть собственным родителем" };
  }
  if (fatherId && fatherId === motherId) {
    return { ok: false, error: "Отец и мать должны быть разными животными" };
  }
  const ids = [fatherId, motherId].filter(Boolean) as string[];
  if (ids.length === 0) return null;
  const parents = await prisma.animal.findMany({
    where: { id: { in: ids } },
    select: { id: true, category: true },
  });
  if (fatherId && !parents.some((parent) => parent.id === fatherId && parent.category === "MALE")) {
    return { ok: false, error: "Выберите кота в качестве отца" };
  }
  if (motherId && !parents.some((parent) => parent.id === motherId && parent.category === "FEMALE")) {
    return { ok: false, error: "Выберите кошку в качестве матери" };
  }
  return null;
}

async function nextAnimalNumber(category: AnimalCategory): Promise<string> {
  const result = await prisma.animal.aggregate({
    where: { category },
    _max: { number: true },
  });

  const max = result._max.number;
  const current = max ? Number.parseInt(max, 10) : 0;
  const next = Number.isNaN(current) ? 1 : current + 1;
  return String(next);
}

async function nextSortOrder(category: AnimalCategory): Promise<number> {
  const result = await prisma.animal.aggregate({
    where: { category },
    _max: { sortOrder: true },
  });
  return (result._max.sortOrder ?? 0) + 1;
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

  const coverIndex = parseCoverIndex(formData, files.length);
  if (typeof coverIndex !== "number") return coverIndex;
  const data = parsed.data;
  const parentError = data.category === "KITTEN"
    ? await validateParents(data.fatherId, data.motherId)
    : null;
  if (parentError) return parentError;

  const [number, sortOrder] = await Promise.all([
    nextAnimalNumber(data.category),
    nextSortOrder(data.category),
  ]);

  let objectKeys: string[];
  try {
    objectKeys = await uploadAnimalPhotos(files);
  } catch (error) {
    console.error("createAnimalAction upload failed:", error);
    return { ok: false, error: "Не удалось загрузить фото. Попробуйте ещё раз." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const animal = await tx.animal.create({
        data: {
          category: data.category,
          number,
          name: data.name,
          birthDate: data.birthDate ?? null,
          sex: data.sex ?? null,
          color: data.color ?? null,
          price: data.category === "KITTEN" ? data.price ?? null : null,
          fatherId: data.category === "KITTEN" ? data.fatherId ?? null : null,
          motherId: data.category === "KITTEN" ? data.motherId ?? null : null,
          personality: data.category === "KITTEN" ? data.personality ?? null : null,
          status: data.category === "KITTEN" ? data.status : "AVAILABLE",
          published: data.published,
          sortOrder,
        },
      });
      if (objectKeys.length > 0) {
        await tx.animalPhoto.createMany({
          data: objectKeys.map((objectKey, index) => ({
            animalId: animal.id,
            objectKey,
            sortOrder: index,
            isCover: index === coverIndex,
          })),
        });
      }
    });
  } catch (error) {
    await Promise.allSettled(objectKeys.map((objectKey) => deletePhotoFromStorage(objectKey)));
    console.error("createAnimalAction failed:", error);
    return { ok: false, error: "Не удалось сохранить животное. Попробуйте ещё раз." };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  return { ok: true };
}

export async function createProductAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = productSchema.safeParse({
    category: formData.get("category"),
    number: formData.get("number"),
    published: formData.get("published") === "on",
  });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message || "Неверные данные" };
  const files = formData.getAll("photos").filter((file): file is File => file instanceof File && file.size > 0);
  const photoError = validatePhotos(files);
  if (photoError) return photoError;
  const category = parsed.data.category as ProductCategory;
  const max = await prisma.product.aggregate({ where: { category }, _max: { sortOrder: true } });
  try {
    const product = await prisma.product.create({
      data: { ...parsed.data, sortOrder: (max._max.sortOrder ?? 0) + 1 },
    });
    for (let index = 0; index < files.length; index++) {
      const { objectKey } = await uploadPhoto(files[index]);
      await prisma.productPhoto.create({ data: { productId: product.id, objectKey, sortOrder: index, isCover: index === 0 } });
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { ok: false, error: "Товар с таким номером уже существует" };
    }
    console.error("createProductAction failed:", error);
    return { ok: false, error: "Не удалось сохранить товар. Попробуйте ещё раз." };
  }
  revalidatePath("/furniture");
  revalidatePath("/admin");
  return { ok: true };
}

export async function toggleProductPublishedAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  await requireAdmin();
  const id = formData.get("id");
  if (typeof id !== "string") return { ok: false, error: "Неверные данные" };
  const product = await prisma.product.findUnique({ where: { id }, select: { published: true } });
  if (!product) return { ok: false, error: "Товар не найден" };
  await prisma.product.update({ where: { id }, data: { published: !product.published } });
  revalidatePath("/furniture");
  revalidatePath("/admin");
  return { ok: true };
}

export async function updateProductAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const id = formData.get("id");
  if (typeof id !== "string") return { ok: false, error: "Неверные данные" };
  const parsed = productSchema.safeParse({ category: formData.get("category"), number: formData.get("number"), published: formData.get("published") === "on" });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message || "Неверные данные" };
  const product = await prisma.product.findUnique({ where: { id }, include: { photos: true } });
  if (!product) return { ok: false, error: "Товар не найден" };
  const files = formData.getAll("photos").filter((file): file is File => file instanceof File && file.size > 0);
  const photoError = validatePhotos(files);
  if (photoError) return photoError;
  if (product.photos.length + files.length > MAX_PHOTOS_PER_ANIMAL) return { ok: false, error: `Можно загрузить не более ${MAX_PHOTOS_PER_ANIMAL} фото` };
  try {
    await prisma.product.update({ where: { id }, data: parsed.data });
    for (let index = 0; index < files.length; index++) {
      const { objectKey } = await uploadPhoto(files[index]);
      await prisma.productPhoto.create({ data: { productId: id, objectKey, sortOrder: product.photos.length + index, isCover: product.photos.length === 0 && index === 0 } });
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { ok: false, error: "Товар с таким номером уже существует" };
    }
    console.error("updateProductAction failed:", error);
    return { ok: false, error: "Не удалось сохранить товар. Попробуйте ещё раз." };
  }
  revalidatePath("/furniture"); revalidatePath("/admin"); revalidatePath(`/admin/products/${id}/edit`);
  return { ok: true };
}

export async function deleteProductAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const id = formData.get("id");
  if (typeof id !== "string") return { ok: false, error: "Неверные данные" };
  const product = await prisma.product.findUnique({ where: { id }, include: { photos: true } });
  if (!product) return { ok: false, error: "Товар не найден" };
  for (const photo of product.photos) await deletePhotoFromStorage(photo.objectKey);
  await prisma.product.delete({ where: { id } });
  revalidatePath("/furniture"); revalidatePath("/admin");
  redirect("/admin");
}

async function getProductPhoto(photoId: FormDataEntryValue | null, productId: FormDataEntryValue | null) {
  if (typeof photoId !== "string" || typeof productId !== "string") return null;
  const photo = await prisma.productPhoto.findUnique({ where: { id: photoId } });
  return photo?.productId === productId ? photo : null;
}

export async function deleteProductPhotoAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdmin(); const photo = await getProductPhoto(formData.get("photoId"), formData.get("productId"));
  if (!photo) return { ok: false, error: "Фото не найдено" };
  await deletePhotoFromStorage(photo.objectKey); await prisma.productPhoto.delete({ where: { id: photo.id } });
  revalidatePath(`/admin/products/${photo.productId}/edit`); revalidatePath("/furniture"); return { ok: true };
}

export async function setProductCoverAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdmin(); const photo = await getProductPhoto(formData.get("photoId"), formData.get("productId"));
  if (!photo) return { ok: false, error: "Фото не найдено" };
  await prisma.$transaction([prisma.productPhoto.updateMany({ where: { productId: photo.productId }, data: { isCover: false } }), prisma.productPhoto.update({ where: { id: photo.id }, data: { isCover: true } })]);
  revalidatePath(`/admin/products/${photo.productId}/edit`); revalidatePath("/furniture"); return { ok: true };
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
  const parentError = data.category === "KITTEN"
    ? await validateParents(data.fatherId, data.motherId, id)
    : null;
  if (parentError) return parentError;

  const files = formData
    .getAll("photos")
    .filter((f): f is File => f instanceof File && f.size > 0);

  const existingCount = animal.photos.length;
  if (existingCount + files.length > MAX_PHOTOS_PER_ANIMAL) {
    return {
      ok: false,
      error: `Всего фото не может превышать ${MAX_PHOTOS_PER_ANIMAL}`,
    };
  }
  const photoError = validatePhotos(files);
  if (photoError) return photoError;

  const coverIndex = parseCoverIndex(formData, files.length);
  if (typeof coverIndex !== "number") return coverIndex;

  let objectKeys: string[];
  try {
    objectKeys = await uploadAnimalPhotos(files);
  } catch (error) {
    console.error("updateAnimalAction upload failed:", error);
    return { ok: false, error: "Не удалось загрузить фото. Попробуйте ещё раз." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.animal.update({
        where: { id },
        data: {
          category: data.category,
          name: data.name,
          birthDate: data.birthDate ?? null,
          sex: data.sex ?? null,
          color: data.color ?? null,
          price: data.category === "KITTEN" ? data.price ?? null : null,
          fatherId: data.category === "KITTEN" ? data.fatherId ?? null : null,
          motherId: data.category === "KITTEN" ? data.motherId ?? null : null,
          personality: data.category === "KITTEN" ? data.personality ?? null : null,
          status: data.category === "KITTEN" ? data.status : "AVAILABLE",
          published: data.published,
        },
      });
      if (objectKeys.length > 0) {
        await tx.animalPhoto.createMany({
          data: objectKeys.map((objectKey, index) => ({
            animalId: id,
            objectKey,
            sortOrder: existingCount + index,
            isCover: existingCount === 0 && index === coverIndex,
          })),
        });
      }
    });
  } catch (error) {
    await Promise.allSettled(objectKeys.map((objectKey) => deletePhotoFromStorage(objectKey)));
    console.error("updateAnimalAction failed:", error);
    return { ok: false, error: "Не удалось сохранить животное. Попробуйте ещё раз." };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/admin/animals/${id}/edit`);
  return { ok: true };
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

  const photo = await prisma.animalPhoto.findUnique({ where: { id: photoId } });
  if (!photo || photo.animalId !== animalId) {
    return { ok: false, error: "Фото не найдено" };
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

export async function togglePublishedAction(
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
    select: { published: true },
  });
  if (!animal) {
    return { ok: false, error: "Животное не найдено" };
  }

  await prisma.animal.update({
    where: { id },
    data: { published: !animal.published },
  });

  revalidatePath("/");
  revalidatePath("/admin");
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

  if (!photos.some((photo) => photo.id === photoId)) {
    return { ok: false, error: "Фото не найдено" };
  }

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
