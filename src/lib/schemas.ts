import { z } from "zod";

export const ANIMAL_CATEGORIES = ["KITTEN", "MALE", "FEMALE"] as const;
export const ANIMAL_STATUSES = ["AVAILABLE", "RESERVED", "SOLD"] as const;

export const AnimalCategory = z.enum(ANIMAL_CATEGORIES);
export const AnimalStatus = z.enum(ANIMAL_STATUSES);

export const animalSchema = z.object({
  category: AnimalCategory,
  number: z.string().trim().max(32).optional().nullable(),
  name: z.string().trim().min(1, "Введите кличку").max(100),
  birthDate: z.coerce.date().optional().nullable(),
  sex: z.string().trim().max(16).optional().nullable(),
  color: z.string().trim().max(128).optional().nullable(),
  price: z.coerce
    .number()
    .int("Цена должна быть целым числом")
    .nonnegative("Цена не может быть отрицательной")
    .optional()
    .nullable(),
  parents: z.string().trim().max(255).optional().nullable(),
  personality: z.string().trim().max(2000).optional().nullable(),
  status: AnimalStatus.default("AVAILABLE"),
  published: z.boolean().default(false),
  sortOrder: z.coerce.number().int().default(0),
});

export const loginSchema = z.object({
  login: z.string().trim().min(1, "Введите логин"),
  password: z.string().min(1, "Введите пароль"),
});

export type AnimalInput = z.infer<typeof animalSchema>;
