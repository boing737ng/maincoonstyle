"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import type { AnimalPhoto } from "@prisma/client";
import { publicUrl } from "@/lib/shared";
import { cn } from "@/lib/cn";
import { PawIcon } from "@/components/site/icons";

export function AnimalGallery({
  photos,
  name,
}: {
  photos: AnimalPhoto[];
  name: string;
}) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const total = photos.length;
  const current = total > 0 ? photos[Math.min(active, total - 1)] : null;

  const goPrev = useCallback(() => {
    setActive((i) => (i - 1 + total) % total);
  }, [total]);

  const goNext = useCallback(() => {
    setActive((i) => (i + 1) % total);
  }, [total]);

  useEffect(() => {
    if (!lightbox) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setLightbox(false);
      if ((e.key === "ArrowLeft" || e.key === "ArrowRight") && total > 1) {
        if (e.key === "ArrowLeft") {
          goPrev();
        } else {
          goNext();
        }
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [lightbox, total, goPrev, goNext]);

  if (total === 0) {
    return (
      <div className="stitch flex aspect-square w-full flex-col items-center justify-center gap-3 bg-card/40">
        <PawIcon className="h-8 w-8 text-accent/50" />
        <span className="px-6 text-center text-sm text-muted">
          Фотографии скоро появятся
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="photo-frame relative">
        <button
          type="button"
          onClick={() => setLightbox(true)}
          aria-label="Открыть фото во весь экран"
          className="relative block aspect-square w-full cursor-zoom-in overflow-hidden bg-card-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {current && (
            <Image
              key={current.id}
              src={publicUrl(current.objectKey)}
              alt={`${name} — фото ${Math.min(active, total - 1) + 1}`}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority={active === 0}
              className="object-cover"
            />
          )}
        </button>
      </div>

      {total > 1 ? (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {photos.map((photo, index) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Показать фото ${index + 1}`}
              aria-current={index === active}
              className={cn(
                "photo-frame relative aspect-square w-full transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                index === active
                  ? "ring-1 ring-accent opacity-100"
                  : "opacity-70 hover:opacity-100"
              )}
            >
              <span className="absolute inset-1 overflow-hidden rounded-md">
                <Image
                  src={publicUrl(photo.objectKey)}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 33vw, 20vw"
                  className="object-cover"
                />
              </span>
            </button>
          ))}
        </div>
      ) : null}

      {lightbox && current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Просмотр фото: ${name}`}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#120d09]/92 p-4"
          onClick={() => setLightbox(false)}
        >
          <div className="relative max-h-[90vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={publicUrl(current.objectKey)}
              alt={`${name} — фото ${Math.min(active, total - 1) + 1}`}
              width={1200}
              height={1200}
              className="max-h-[82vh] w-auto max-w-full object-contain"
            />
            {total > 1 ? (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="Предыдущее фото"
                  className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-background/70 text-foreground backdrop-blur transition-colors hover:bg-paper hover:text-paper-ink"
                >
                  <Chevron direction="left" />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Следующее фото"
                  className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-background/70 text-foreground backdrop-blur transition-colors hover:bg-paper hover:text-paper-ink"
                >
                  <Chevron direction="right" />
                </button>
              </>
            ) : null}
            <button
              type="button"
              onClick={() => setLightbox(false)}
              aria-label="Закрыть"
              className="absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-full bg-background/70 text-foreground backdrop-blur transition-colors hover:bg-paper hover:text-paper-ink"
            >
              ✕
            </button>
            <span className="mt-3 block text-center text-sm text-accent-foreground/80">
              {Math.min(active, total - 1) + 1} / {total}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={direction === "left" ? "rotate-180" : ""}
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}
