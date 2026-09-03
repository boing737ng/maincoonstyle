"use client";

import { useState } from "react";
import Image from "next/image";
import type { AnimalPhoto } from "@prisma/client";
import { publicUrl } from "@/lib/shared";
import { cn } from "@/lib/cn";

export function AnimalGallery({ photos, name }: { photos: AnimalPhoto[]; name: string }) {
  const [active, setActive] = useState(0);

  if (photos.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-2xl border border-border bg-gradient-to-br from-card to-background">
        <span className="text-6xl text-border" aria-hidden>
          🐾
        </span>
      </div>
    );
  }

  const current = photos[Math.min(active, photos.length - 1)];

  return (
    <div className="space-y-3">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border bg-card">
        <Image
          key={current.id}
          src={publicUrl(current.objectKey)}
          alt={`${name} — фото ${Math.min(active, photos.length - 1) + 1}`}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority={active === 0}
          className="object-cover"
        />
      </div>

      {photos.length > 1 ? (
        <div className="grid grid-cols-5 gap-2">
          {photos.map((photo, index) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Показать фото ${index + 1}`}
              aria-current={index === active}
              className={cn(
                "relative aspect-square w-full overflow-hidden rounded-lg border transition-colors",
                index === active
                  ? "border-accent ring-2 ring-accent"
                  : "border-border hover:border-accent/50"
              )}
            >
              <Image
                src={publicUrl(photo.objectKey)}
                alt=""
                fill
                sizes="20vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
