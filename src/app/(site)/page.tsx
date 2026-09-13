import Link from "next/link";
import { getPublishedAnimals } from "@/lib/animals";
import { getSiteData } from "@/lib/constants";
import { KittenGrid } from "@/components/site/AnimalGrids";
import { Section } from "@/components/site/Section";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const site = getSiteData();
  const [kittens] = await Promise.all([
    getPublishedAnimals("KITTEN"),
  ]);

  const featuredKittens = kittens.slice(0, 3);

  return (
    <>
      <Hero siteName={site.name} phoneTel={site.phoneTel} />

      <Section
        id="kittens"
        eyebrow="сейчас в питомнике"
        title="Котята, которых уже любят"
        subtitle="Они растут рядом с нами, в спокойной домашней обстановке."
      >
        <KittenGrid kittens={featuredKittens} />
        <div className="mt-12">
          <Link href="/kittens" className="btn btn-ghost">
            Все котята
          </Link>
        </div>
      </Section>

      <Section
        id="links"
        eyebrow="загляните в наш дом"
        title="Питомник изнутри"
      >
        <CtaLinks phoneTel={site.phoneTel} phoneDisplay={site.phoneDisplay} />
      </Section>
    </>
  );
}

function Hero({
  siteName,
  phoneTel,
}: {
  siteName: string;
  phoneTel: string;
}) {
  const [nameFirst, ...nameRest] = siteName.split(" ");

  return (
    <section className="relative isolate overflow-hidden border-b border-border">
      <div className="container-site grid items-center gap-12 py-16 md:grid-cols-[1.05fr_0.95fr] md:py-24">
        <div className="max-w-2xl">
          <p className="text-sm font-medium tracking-[0.08em] text-accent-hover">
            питомник кошек мейн-кун
          </p>
          <h1 className="mt-5 text-5xl leading-[1.05] sm:text-6xl md:text-7xl">
            {nameFirst} {nameRest.join(" ") || "CATTERY"}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            Дом больших кошек, где каждый мейн-кун растёт рядом с людьми, в заботе,
            спокойствии и любви.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/kittens" className="btn btn-solid">
              Смотреть котят
            </Link>
            <a href={`tel:${phoneTel}`} className="btn btn-ghost">
              Связаться с нами
            </a>
          </div>
        </div>
        <HomeMark />
      </div>
    </section>
  );
}

function HomeMark() {
  return (
    <div className="relative mx-auto flex aspect-square w-full max-w-md items-center justify-center overflow-hidden rounded-[2rem] border border-border bg-card">
      <div className="absolute h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
      <div className="relative flex h-48 w-48 items-center justify-center rounded-full border border-accent/35">
        <div className="flex h-36 w-36 items-center justify-center rounded-full border border-accent/20 bg-background">
          <span className="font-display text-5xl tracking-[0.08em] text-accent">LB</span>
        </div>
      </div>
    </div>
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
    { href: "/furniture", label: "Лежанки, Мебель" },
    { href: "/contacts", label: "Контакты" },
  ];

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="stitch stitch-hover group flex min-h-32 items-end bg-card/40 p-5 transition-colors"
          >
            <span className="font-display text-xl leading-tight text-foreground transition-colors group-hover:text-amber-soft">
              {link.label}
            </span>
          </Link>
        ))}
      </div>
      <p className="mt-8 text-sm text-muted">
        Или позвоните нам:{" "}
        <a
          href={`tel:${phoneTel}`}
          className="font-semibold text-amber hover:text-amber-soft"
        >
          {phoneDisplay}
        </a>
      </p>
    </div>
  );
}
