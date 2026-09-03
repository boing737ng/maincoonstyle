import Link from "next/link";
import { getPublishedAnimals } from "@/lib/animals";
import { getSiteData } from "@/lib/constants";
import { KittenGrid, AdultGrid } from "@/components/site/AnimalGrids";
import { Section } from "@/components/site/Section";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const site = getSiteData();
  const [kittens, males, females] = await Promise.all([
    getPublishedAnimals("KITTEN"),
    getPublishedAnimals("MALE"),
    getPublishedAnimals("FEMALE"),
  ]);

  const featuredKittens = kittens.slice(0, 3);

  return (
    <>
      <Hero phoneTel={site.phoneTel} />

      <Section
        id="kittens"
        title="Котята"
        subtitle="Наши малыши ищут свой дом"
      >
        <KittenGrid kittens={featuredKittens} />
        <div className="mt-8 text-center">
          <Link
            href="/kittens"
            className="inline-flex h-12 items-center justify-center rounded-full border border-accent/40 px-8 font-semibold text-accent transition-colors hover:bg-accent/10"
          >
            Все котята
          </Link>
        </div>
      </Section>

      <Section id="cats" title="Коты" subtitle="Наши производители">
        <AdultGrid
          animals={males}
          emptyText="Информация о наших котах скоро появится."
        />
      </Section>

      <Section id="females" title="Кошки" subtitle="Наши производительницы">
        <AdultGrid
          animals={females}
          emptyText="Информация о наших кошках скоро появится."
        />
      </Section>

      <Section id="links" title="Узнайте больше">
        <CtaLinks
          phoneTel={site.phoneTel}
          phoneDisplay={site.phoneDisplay}
        />
      </Section>
    </>
  );
}

function Hero({ phoneTel }: { phoneTel: string }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#1a1420] via-background to-background">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(200,162,74,0.15),transparent_60%)]" />
      <div className="container-site relative flex min-h-[80vh] flex-col items-center justify-center py-24 text-center">
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-accent">
          Питомник мейн-кунов
        </p>
        <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Добро пожаловать в мир больших кошек!
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted">
          Домашний питомник ласковых гигантов. Поможем каждому малышу найти
          самую лучшую и любящую семью.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <a
            href={`tel:${phoneTel}`}
            className="flex h-12 items-center justify-center rounded-full bg-accent px-8 font-semibold text-accent-foreground transition-colors hover:bg-accent-hover"
          >
            Позвонить
          </a>
          <Link
            href="/kittens"
            className="flex h-12 items-center justify-center rounded-full border border-accent/40 px-8 font-semibold text-accent transition-colors hover:bg-accent/10"
          >
            Смотреть котят
          </Link>
        </div>
      </div>
    </section>
  );
}

function CtaLinks({
  phoneTel,
  phoneDisplay,
}: {
  phoneTel: string;
  phoneDisplay: string;
}) {
  const links = [
    { href: "/about", label: "О питомнике" },
    { href: "/breed", label: "О породе" },
    { href: "/furniture", label: "Лежанки и мебель" },
    { href: "/contacts", label: "Контакты" },
  ];

  return (
    <div className="mx-auto max-w-4xl">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex h-16 items-center justify-center rounded-xl border border-border bg-card px-4 text-center font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            {link.label}
          </Link>
        ))}
      </div>
      <p className="mt-8 text-center text-muted">
        Или позвоните нам:{" "}
        <a href={`tel:${phoneTel}`} className="font-semibold text-accent hover:text-accent-hover">
          {phoneDisplay}
        </a>
      </p>
    </div>
  );
}
