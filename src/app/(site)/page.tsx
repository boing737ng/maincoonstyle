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
  const scriptName = siteName.split(" ")[0] ?? "LargeBrush";
  const capsName = siteName.split(" ").slice(1).join(" ") || "CATTERY";
  const withPhoto = hasHeroImage();

  return (
    <section className="relative isolate overflow-hidden border-b border-border">
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
        className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/55 to-background"
        aria-hidden
      />

      <div className="container-site relative flex flex-col items-center py-20 text-center md:py-28">
        <p className="text-sm font-medium tracking-[0.35em] text-accent-hover uppercase">
          питомник кошек мейн-кун
        </p>
        <h1 className="mt-4 flex flex-col items-center gap-1">
          <span className="font-hand text-6xl leading-none text-accent sm:text-7xl md:text-8xl">
            {scriptName}
          </span>
          <span className="text-2xl tracking-[0.18em] text-foreground sm:text-3xl md:text-4xl">
            {capsName}
          </span>
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
    </section>
  );
}

/* Вечерняя сцена «озеро на закате» — временная до присылки фирменного арта. */
function HeroScenery() {
  return (
    <div className="absolute inset-0" aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_115%,#3d2b1c_0%,#241a13_45%,#141210_100%)]" />
      <div className="absolute left-1/2 top-[62%] h-56 w-[46rem] max-w-[92vw] -translate-x-1/2 rounded-[100%] bg-accent/15 blur-3xl" />
      <div className="absolute left-1/2 top-[68%] h-24 w-[30rem] max-w-[80vw] -translate-x-1/2 rounded-[100%] bg-[#e8b06d]/20 blur-2xl" />
      <svg
        className="absolute inset-x-0 bottom-0 h-40 w-full text-[#100e0c]"
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
      >
        <path
          d="M0 96 L90 60 L150 92 L230 44 L310 88 L400 52 L480 90 L560 40 L640 84 L720 56 L800 92 L890 48 L970 86 L1060 54 L1140 90 L1230 46 L1310 88 L1390 60 L1440 84 L1440 160 L0 160 Z"
          fill="currentColor"
          opacity="0.85"
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
