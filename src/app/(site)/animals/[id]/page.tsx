import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAnimalById, getKittens } from "@/lib/animals";
import { getSiteData } from "@/lib/constants";
import { formatPrice, formatDate } from "@/lib/format";
import { StatusBadge } from "@/components/StatusBadge";
import { AnimalGallery } from "@/components/site/AnimalGallery";
import { KittenGrid } from "@/components/site/AnimalGrids";
import { Section } from "@/components/site/Section";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const animal = await getAnimalById(id);
  if (!animal) return { title: "Животное не найдено" };
  return { title: animal.name };
}

export default async function AnimalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const animal = await getAnimalById(id);
  if (!animal) notFound();

  const site = getSiteData();
  const categoryLabel =
    animal.category === "KITTEN"
      ? "Котята"
      : animal.category === "MALE"
      ? "Коты"
      : "Кошки";
  const categoryHref = animal.category === "KITTEN" ? "/kittens" : "/";

  const siblings = await getKittens({
    sex: animal.sex ?? undefined,
  });
  const related = siblings
    .filter((a) => a.id !== animal.id)
    .slice(0, 3);

  return (
    <div className="container-site py-8 sm:py-12">
      <nav aria-label="Хлебные крошки" className="mb-6 text-sm text-muted">
        <Link href="/" className="hover:text-accent">
          Главная
        </Link>
        <span className="mx-2">/</span>
        <Link href={categoryHref} className="hover:text-accent">
          {categoryLabel}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{animal.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <AnimalGallery photos={animal.photos} name={animal.name} />

        <div>
          <div className="mb-4 flex flex-wrap items-start gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {animal.name}
            </h1>
            <StatusBadge status={animal.status} />
          </div>

          {animal.price != null && (
            <p className="mb-6 text-3xl font-bold text-accent">
              {formatPrice(animal.price)}
            </p>
          )}

          <dl className="space-y-3 divide-y divide-border">
            {animal.number && (
              <DetailRow label="Номер" value={animal.number} />
            )}
            {animal.birthDate && (
              <DetailRow
                label="Дата рождения"
                value={formatDate(animal.birthDate)}
              />
            )}
            {animal.sex && <DetailRow label="Пол" value={animal.sex} />}
            {animal.color && <DetailRow label="Окрас" value={animal.color} />}
            {animal.parents && (
              <DetailRow label="Родители" value={animal.parents} />
            )}
            {animal.category && (
              <DetailRow
                label="Категория"
                value={
                  animal.category === "KITTEN"
                    ? "Котёнок"
                    : animal.category === "MALE"
                    ? "Кот"
                    : "Кошка"
                }
              />
            )}
          </dl>

          {animal.status !== "SOLD" ? (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={`tel:${site.phoneTel}`}
                className="flex h-12 items-center justify-center rounded-full bg-accent px-8 font-semibold text-accent-foreground transition-colors hover:bg-accent-hover"
              >
                Позвонить
              </a>
              <a
                href={`mailto:${site.email}?subject=${encodeURIComponent(
                  `Вопрос о питомце: ${animal.name}`
                )}`}
                className="flex h-12 items-center justify-center rounded-full border border-accent/40 px-8 font-semibold text-accent transition-colors hover:bg-accent/10"
              >
                Написать
              </a>
            </div>
          ) : (
            <p className="mt-8 rounded-xl border border-border bg-card px-6 py-4 text-center text-muted">
              Этот питомец уже нашёл свой дом, но у нас есть другие замечательные
              котята.
            </p>
          )}
        </div>
      </div>

      {animal.personality && (
        <section className="mt-12">
          <h2 className="mb-4 text-2xl font-bold tracking-tight text-foreground">
            Характер
          </h2>
          <p className="max-w-3xl whitespace-pre-line text-lg leading-relaxed text-muted">
            {animal.personality}
          </p>
        </section>
      )}

      {related.length > 0 && animal.category === "KITTEN" && (
        <Section id="related" title="Другие котята">
          <KittenGrid kittens={related} />
        </Section>
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="text-right text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}
