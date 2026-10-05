import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getKittens, getPublishedAnimalById } from "@/lib/animals";
import { getSiteData } from "@/lib/constants";
import { formatPrice, formatDate } from "@/lib/format";
import { StatusBadge } from "@/components/StatusBadge";
import { AnimalGallery } from "@/components/site/AnimalGallery";
import { KittenGrid } from "@/components/site/AnimalGrids";
import { Section } from "@/components/site/Section";
import { PawIcon } from "@/components/site/icons";
import { publicUrl } from "@/lib/shared";
import type { Animal, AnimalPhoto } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const animal = await getPublishedAnimalById(id);
  if (!animal) return { title: "Животное не найдено" };
  return { title: animal.name };
}

function sexLabel(sex: string | null): string {
  if (sex === "Кот") return "Мальчик";
  if (sex === "Кошка") return "Девочка";
  return sex ?? "";
}

export default async function AnimalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const animal = await getPublishedAnimalById(id);
  if (!animal) notFound();

  const site = getSiteData();
  const categoryLabel =
    animal.category === "KITTEN"
      ? "Котята"
      : animal.category === "MALE"
      ? "Коты"
      : "Кошки";
  const categoryHref =
    animal.category === "KITTEN"
      ? "/kittens"
      : animal.category === "MALE"
      ? "/cats"
      : "/females";

  if (animal.category !== "KITTEN") {
    return (
      <div className="container-site py-10 sm:py-16">
        <nav aria-label="Хлебные крошки" className="mb-8 text-sm text-muted">
          <Link href="/" className="hover:text-amber-soft">
            Главная
          </Link>
          <span className="mx-2 text-muted-strong">/</span>
          <Link href={categoryHref} className="hover:text-amber-soft">
            {categoryLabel}
          </Link>
          <span className="mx-2 text-muted-strong">/</span>
          <span className="text-foreground">{animal.name}</span>
        </nav>

        <div className="mx-auto max-w-3xl">
          <AnimalGallery photos={animal.photos} name={animal.name} />
          <p className="mt-6 text-center font-display text-2xl text-foreground sm:text-3xl">
            {animal.name}
            {animal.color ? (
              <span className="text-muted"> {animal.color}</span>
            ) : null}
          </p>
          {animal.birthDate ? (
            <p className="mt-2 text-center text-sm text-muted">
              Дата рождения: {formatDate(animal.birthDate)}
            </p>
          ) : null}
        </div>
      </div>
    );
  }

  const siblings = await getKittens();
  const related = siblings.filter((a) => a.id !== animal.id).slice(0, 3);

  return (
    <div className="container-site py-10 sm:py-16">
      <nav aria-label="Хлебные крошки" className="mb-8 text-sm text-muted">
        <Link href="/" className="hover:text-amber-soft">
          Главная
        </Link>
        <span className="mx-2 text-muted-strong">/</span>
        <Link href={categoryHref} className="hover:text-amber-soft">
          {categoryLabel}
        </Link>
        <span className="mx-2 text-muted-strong">/</span>
        <span className="text-foreground">{animal.name}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <AnimalGallery photos={animal.photos} name={animal.name} />
        </div>

        <div className="lg:col-span-6">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <h1 className="font-display text-3xl text-foreground sm:text-4xl">
              {animal.name}
            </h1>
            <StatusBadge status={animal.status} />
          </div>

          <dl className="divide-y divide-border border-y border-border">
            <DetailRow label="Пол" value={sexLabel(animal.sex)} />
            {animal.number && (
              <DetailRow label="Номер" value={`№ ${animal.number}`} />
            )}
            {animal.birthDate && (
              <DetailRow label="Дата рождения" value={formatDate(animal.birthDate)} />
            )}
            {animal.color && <DetailRow label="Окрас" value={animal.color} />}
            {animal.price != null && animal.status !== "SOLD" && (
              <div className="flex items-center justify-between gap-4 py-4">
                <dt className="text-sm text-muted-strong">Цена</dt>
                <dd className="text-right font-display text-3xl text-amber">
                  {formatPrice(animal.price)}
                </dd>
              </div>
            )}
          </dl>

          {animal.personality && (
            <div className="mt-6">
              <h2 className="mb-2 font-display text-xl text-foreground">
                Характер
              </h2>
              <p className="whitespace-pre-line leading-relaxed text-muted">
                {animal.personality}
              </p>
            </div>
          )}

          {animal.status !== "SOLD" ? (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={`tel:${site.phoneTel}`} className="btn btn-solid">
                Позвонить
              </a>
              <a
                href={`mailto:${site.email}?subject=${encodeURIComponent(
                  `Вопрос о питомце: ${animal.name}`
                )}`}
                className="btn btn-ghost"
              >
                Написать
              </a>
            </div>
          ) : (
            <p className="stitch mt-8 bg-card/40 px-6 py-4 text-muted">
              Этот питомец уже нашёл свой дом, но у нас есть другие замечательные
              котята.
            </p>
          )}
        </div>
      </div>

      {((animal.father?.published ? animal.father : null) ||
        (animal.mother?.published ? animal.mother : null)) ? (
        <section className="mt-16 border-t border-border pt-10">
          <h2 className="font-display text-2xl text-foreground">Родители</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {animal.father?.published ? <ParentCard label="Отец" parent={animal.father} /> : null}
            {animal.mother?.published ? <ParentCard label="Мать" parent={animal.mother} /> : null}
          </div>
        </section>
      ) : null}

      {related.length > 0 && (
        <Section id="related" title="Другие котята">
          <KittenGrid kittens={related} />
        </Section>
      )}
    </div>
  );
}

function ParentCard({ label, parent }: { label: string; parent: Animal & { photos: AnimalPhoto[] } }) {
  const cover = parent.photos.find((photo) => photo.isCover) ?? parent.photos[0];
  return (
    <Link href={`/animals/${parent.id}`} className="stitch stitch-hover group flex items-center gap-4 bg-card/40 p-3 transition-colors">
      <div className="photo-frame shrink-0 p-1">
        <div className="relative h-20 w-20 overflow-hidden rounded bg-card-2">
          {cover ? (
            <Image
              src={publicUrl(cover.objectKey)}
              alt={parent.name}
              fill
              sizes="80px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <PawIcon className="h-7 w-7 text-amber-soft/60" />
            </div>
          )}
        </div>
      </div>
      <div>
        <p className="text-sm font-medium tracking-[0.08em] text-accent-hover">{label}</p>
        <p className="font-display mt-1 text-xl text-foreground group-hover:text-amber-soft">{parent.name}</p>
        <p className="mt-1 text-sm text-muted">{parent.color}</p>
      </div>
    </Link>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <dt className="text-sm text-muted-strong">{label}</dt>
      <dd className="text-right text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}
