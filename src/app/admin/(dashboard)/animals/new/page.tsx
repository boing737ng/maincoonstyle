import type { Metadata } from "next";
import { AnimalForm } from "@/components/admin/AnimalForm";
import { getParentOptions } from "@/lib/animals";

export const metadata: Metadata = {
  title: "Добавить животное",
};

export default async function NewAnimalPage() {
  const parentOptions = await getParentOptions();
  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">
        Добавить животное
      </h1>
      <AnimalForm parentOptions={parentOptions} />
    </div>
  );
}
