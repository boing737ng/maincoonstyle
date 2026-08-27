import Image from "next/image";
import type { Animal, AnimalPhoto } from "@prisma/client";
import { StatusBadge } from "@/components/StatusBadge";
import { formatPrice, formatDate } from "@/lib/format";
import { publicUrl } from "@/lib/storage";

type AnimalWithPhotos = Animal & { photos: AnimalPhoto[] };

function coverPhoto(animal: AnimalWithPhotos): AnimalPhoto | undefined {
  return (
    animal.photos.find((p) => p.isCover) ??
    animal.photos[0]
  );
}

export function KittenCard({ animal }: { animal: AnimalWithPhotos }) {
  const cover = coverPhoto(animal);

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="relative aspect-square w-full overflow-hidden">
        {cover ? (
          <Image
            src={publicUrl(cover.objectKey)}
            alt={animal.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <ImagePlaceholder name={animal.name} />
        )}
        <div className="absolute left-3 top-3">
          <StatusBadge status={animal.status} />
        </div>
      </div>

      <div className="flex flex-col gap-2 p-5">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-lg font-semibold text-foreground">
            {animal.name}
          </h3>
          {animal.price != null && (
            <span className="whitespace-nowrap font-semibold text-accent">
              {formatPrice(animal.price)}
            </span>
          )}
        </div>

        <dl className="space-y-1 text-sm text-muted">
          {animal.number && (
            <InfoRow label="Номер" value={animal.number} />
          )}
          {animal.birthDate && (
            <InfoRow label="Дата рождения" value={formatDate(animal.birthDate)} />
          )}
          {animal.sex && <InfoRow label="Пол" value={animal.sex} />}
          {animal.color && <InfoRow label="Окрас" value={animal.color} />}
          {animal.parents && <InfoRow label="Родители" value={animal.parents} />}
          {animal.personality && (
            <InfoRow label="Характер" value={animal.personality} />
          )}
        </dl>
      </div>
    </article>
  );
}

export function AdultCard({ animal }: { animal: AnimalWithPhotos }) {
  const cover = coverPhoto(animal);

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="relative aspect-square w-full overflow-hidden">
        {cover ? (
          <Image
            src={publicUrl(cover.objectKey)}
            alt={animal.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <ImagePlaceholder name={animal.name} />
        )}
      </div>
      <div className="flex flex-col gap-2 p-5">
        <h3 className="text-lg font-semibold text-foreground">{animal.name}</h3>
        <dl className="space-y-1 text-sm text-muted">
          {animal.birthDate && (
            <InfoRow label="Дата рождения" value={formatDate(animal.birthDate)} />
          )}
          {animal.color && <InfoRow label="Окрас" value={animal.color} />}
        </dl>
      </div>
    </article>
  );
}

function ImagePlaceholder({ name }: { name: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-card to-background">
      <span className="text-5xl text-border" aria-hidden>
        🐾
      </span>
      <span className="sr-only">{name}</span>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="text-muted/70">{label}:</dt>
      <dd className="text-foreground">{value}</dd>
    </div>
  );
}