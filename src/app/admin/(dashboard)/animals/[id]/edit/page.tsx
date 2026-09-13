import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAnimalById, getParentOptions } from "@/lib/animals";
import { AnimalForm } from "@/components/admin/AnimalForm";
import { PhotoManager } from "@/components/admin/PhotoManager";

export const metadata: Metadata = {
  title: "Редактировать животное",
};

export default async function EditAnimalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [animal, parentOptions] = await Promise.all([getAnimalById(id), getParentOptions()]);
  if (!animal) {
    notFound();
  }

  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">
        Редактировать: {animal.name}
      </h1>
      <PhotoManager animalId={animal.id} photos={animal.photos} />
      <AnimalForm animal={animal} parentOptions={parentOptions} />
    </div>
  );
}
