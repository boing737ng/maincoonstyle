import Link from "next/link";
import Image from "next/image";
import fs from "node:fs";
import path from "node:path";
import { getPublishedAnimals } from "@/lib/animals";
import { getSiteData } from "@/lib/constants";
import { KittenGrid } from "@/components/site/AnimalGrids";
import { Section } from "@/components/site/Section";

export const dynamic = "force-dynamic";

const HERO_IMAGE = "images/hero-lake.jpg";

function hasHeroImage(): boolean {
  try {
    fs.accessSync(path.join(process.cwd(), "public", HERO_IMAGE));
    return true;
  } catch {
    return false;
  }
}

export default async function HomePage() {
  const site = getSiteData();
  const [kittens] = await Promise.all([
    getPublishedAnimals("KITTEN"),
  ]);

  const featuredKittens = [
    ...kittens.filter((kitten) => kitten.status === "AVAILABLE"),
    ...kittens.filter((kitten) => kitten.status !== "AVAILABLE"),
  ].slice(0, 3);

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
  const scriptName = siteName.split(" ")[0] ?? "LargeBrush";
  const capsName = siteName.split(" ").slice(1).join(" ") || "CATTERY";
  const withPhoto = hasHeroImage();

  return (
    <section className="hero relative isolate overflow-hidden border-b border-border">
      {withPhoto ? (
        <Image
          src={`/${HERO_IMAGE}`}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      ) : (
        <HeroScenery />
      )}
      <div
        className="hero-overlay absolute inset-0"
        aria-hidden
      />

      <div className="container-site relative grid min-h-[34rem] items-center gap-12 py-16 md:min-h-[39rem] md:grid-cols-[1.05fr_.95fr] md:py-20">
        <div className="hero-copy max-w-xl">
        <p className="hero-kicker text-sm font-medium tracking-[0.24em] text-accent-hover uppercase">
          питомник кошек мейн-кун
        </p>
        <h1 className="mt-5 flex flex-col gap-1">
          <span className="font-hand text-7xl leading-none text-accent sm:text-8xl md:text-9xl">
            {scriptName}
          </span>
          <span className="font-display text-4xl tracking-[0.08em] text-foreground sm:text-5xl md:text-6xl">
            {capsName}
          </span>
        </h1>
        <p className="mt-7 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
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
        <div className="hero-note hidden self-end justify-self-end border-l border-accent/50 pl-5 text-sm leading-relaxed text-muted md:block">
          <span className="mb-2 block font-display text-2xl text-foreground">Жить рядом.</span>
          Растить с вниманием к характеру,<br />здоровью и домашнему ритму.
        </div>
      </div>
    </section>
  );
}

/* Спокойная графическая сцена остаётся нейтральной, пока нет hero-фотографии. */
function HeroScenery() {
  return (
    <div className="absolute inset-0" aria-hidden>
      <div className="absolute inset-0 bg-[#e8eee7]" />
      <div className="absolute -right-24 top-10 h-80 w-80 rounded-full border border-accent/25" />
      <div className="absolute -right-8 top-24 h-64 w-64 rounded-full border border-accent/20" />
      <div className="absolute bottom-0 left-0 h-1/3 w-full bg-[#d8ddd2]" />
      <svg
        className="absolute inset-x-0 bottom-0 h-40 w-full text-[#c2cdbd]"
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
      >
        <path
          d="M0 96 L90 60 L150 92 L230 44 L310 88 L400 52 L480 90 L560 40 L640 84 L720 56 L800 92 L890 48 L970 86 L1060 54 L1140 90 L1230 46 L1310 88 L1390 60 L1440 84 L1440 160 L0 160 Z"
          fill="currentColor"
          opacity="0.9"
        />
      </svg>
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
    { href: "/furniture", label: "Лежанки и мебель" },
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
