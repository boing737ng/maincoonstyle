import type { Animal, AnimalPhoto } from "@prisma/client";
import { KittenCard, AdultCard } from "@/components/site/AnimalCard";

type AnimalWithPhotos = Animal & { photos: AnimalPhoto[] };

export function EmptyState({ text }: { text: string }) {
  return (
    <p className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center text-muted">
      {text}
    </p>
  );
}

export function KittenGrid({ kittens }: { kittens: AnimalWithPhotos[] }) {
  if (kittens.length === 0) {
    return (
      <EmptyState text="Пока нет доступных котят — следите за обновлениями нашего питомника." />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {kittens.map((kitten) => (
        <KittenCard key={kitten.id} animal={kitten} />
      ))}
    </div>
  );
}

export function AdultGrid({
  animals,
  emptyText,
}: {
  animals: AnimalWithPhotos[];
  emptyText: string;
}) {
  if (animals.length === 0) {
    return <EmptyState text={emptyText} />;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {animals.map((animal) => (
        <AdultCard key={animal.id} animal={animal} />
      ))}
    </div>
  );
}