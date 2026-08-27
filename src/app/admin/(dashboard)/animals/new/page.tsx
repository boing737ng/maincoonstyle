import type { Metadata } from "next";
import { AnimalForm } from "@/components/admin/AnimalForm";

export const metadata: Metadata = {
  title: "Добавить животное",
};

export default function NewAnimalPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">
        Добавить животное
      </h1>
      <AnimalForm />
    </div>
  );
}
