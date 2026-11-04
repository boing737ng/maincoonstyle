import Image from "next/image";
import Link from "next/link";
import type { Animal, AnimalPhoto } from "@prisma/client";
import { StatusBadge } from "@/components/StatusBadge";
import { formatPrice, formatDate } from "@/lib/format";
import { publicUrl } from "@/lib/shared";
import { PawIcon } from "@/components/site/icons";

type AnimalWithPhotos = Animal & { photos: AnimalPhoto[] };

function coverPhoto(animal: AnimalWithPhotos): AnimalPhoto | undefined {
  return animal.photos.find((p) => p.isCover) ?? animal.photos[0];
}

function sexWord(sex: string | null): string {
  if (sex === "Кот") return "мальчик";
  if (sex === "Кошка") return "девочка";
  return sex?.toLowerCase() ?? "";
}

export function KittenCard({
  animal,
}: {
  animal: AnimalWithPhotos;
}) {
  const cover = coverPhoto(animal);
  const photoCount = animal.photos.length;
  const isSold = animal.status === "SOLD";
  const caption = [animal.name, sexWord(animal.sex)]
    .filter(Boolean)
    .join(", ");

  return (
    <Link
      href={`/animals/${animal.id}`}
      className="group block cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background"
    >
      <div className="photo-frame polaroid relative">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-card-2">
          {cover ? (
            <Image
              src={publicUrl(cover.objectKey)}
              alt={animal.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
            />
          ) : (
            <ImagePlaceholder name={animal.name} />
          )}
          <span className="absolute left-3 top-3">
            <StatusBadge status={animal.status} />
          </span>
          <div className="pointer-events-none absolute inset-y-2 right-2 flex flex-col items-end gap-2 min-[480px]:inset-y-3 min-[480px]:right-3">
            {animal.number ? (
              <span className="flex items-center gap-1 whitespace-nowrap rounded-sm border border-white/20 bg-black/60 px-1.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm min-[480px]:px-2 min-[480px]:text-xs">
                <PawIcon className="h-3 w-3 text-amber-soft min-[480px]:h-3.5 min-[480px]:w-3.5" />
                № {animal.number}
              </span>
            ) : null}
            {photoCount > 1 ? (
              <span className="mt-auto whitespace-nowrap rounded-sm border border-white/20 bg-black/60 px-1.5 py-1 text-[11px] tabular-nums text-white backdrop-blur-sm min-[480px]:px-2 min-[480px]:text-xs">
                {photoCount} фото
              </span>
            ) : null}
          </div>
        </div>
        <p className="polaroid-caption">{caption}</p>
        <div className="grid grid-cols-2 gap-2 border-t border-border px-3 py-3 min-[480px]:gap-4 min-[480px]:px-4">
          <div className="min-w-0">
            <span className="block text-[11px] font-medium uppercase tracking-[0.08em] text-muted-strong">
              Окрас
            </span>
            <span className="mt-1 block truncate text-sm text-muted">
              {animal.color || "Не указан"}
            </span>
          </div>
          <div className="min-w-0 text-right">
            <span className="block text-[11px] font-medium uppercase tracking-[0.08em] text-muted-strong">
              Цена
            </span>
            {isSold ? (
              <span className="mt-1 block truncate text-sm text-muted">—</span>
            ) : (
              <span className="mt-1 block truncate text-sm font-semibold text-accent">
                {animal.price != null ? formatPrice(animal.price) : "По запросу"}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export function AdultCard({
  animal,
}: {
  animal: AnimalWithPhotos;
}) {
  const cover = coverPhoto(animal);
  const photoCount = animal.photos.length;
  return (
    <Link
      href={`/animals/${animal.id}`}
      className="group block cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background"
    >
      <div className="photo-frame polaroid relative">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-card-2">
          {cover ? (
            <Image
              src={publicUrl(cover.objectKey)}
              alt={animal.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
            />
          ) : (
            <ImagePlaceholder name={animal.name} />
          )}
          {photoCount > 1 ? (
            <span className="absolute bottom-2 right-2 rounded-sm border border-white/20 bg-black/60 px-1.5 py-1 text-[11px] tabular-nums text-white backdrop-blur-sm min-[480px]:bottom-3 min-[480px]:right-3 min-[480px]:px-2 min-[480px]:text-xs">
              {photoCount} фото
            </span>
          ) : null}
        </div>
        <div className="polaroid-caption">
          <p>{animal.name}</p>
          {animal.color ? (
            <p className="mt-1.5 font-sans text-sm leading-normal text-muted">
              Окрас: {animal.color}
            </p>
          ) : null}
        </div>
        {animal.birthDate ? (
          <p className="px-4 pb-4 pt-0 text-sm text-muted">
            Дата рождения: {formatDate(animal.birthDate)}
          </p>
        ) : null}
      </div>
    </Link>
  );
}

function ImagePlaceholder({ name }: { name: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-card-2">
      <span className="font-display text-3xl tracking-[0.08em] text-accent/70">LB</span>
      <span className="px-4 text-center text-sm text-muted">
        {name}
      </span>
    </div>
  );
}
