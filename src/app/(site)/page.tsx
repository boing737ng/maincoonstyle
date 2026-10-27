import Link from "next/link";
import Image from "next/image";
import { getPublishedAnimals } from "@/lib/animals";
import { getSiteData } from "@/lib/constants";
import { KittenGrid } from "@/components/site/AnimalGrids";
import { Section } from "@/components/site/Section";

export const dynamic = "force-dynamic";

const HERO_IMAGE = "images/hero-largebrush.png";

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
  const capsName = siteName.split(" ").slice(1).join(" ") || "Cattery";

  return (
    <section className="hero relative isolate overflow-hidden border-b border-border">
      <Image
        src={`/${HERO_IMAGE}`}
        alt="Большой мейн-кун на побережье"
        fill
        priority
        sizes="100vw"
        className="hero-media object-cover object-center"
      />
      <div className="hero-overlay absolute inset-0" aria-hidden />
      <div className="hero-glow absolute inset-0" aria-hidden />

      <div className="container-site relative grid min-h-[36rem] items-center gap-12 py-16 md:min-h-[42rem] md:grid-cols-[1.05fr_.95fr] md:py-20">
        <div className="hero-copy max-w-xl">
        <p className="hero-kicker text-xs font-medium tracking-[0.3em] text-white/75 uppercase">
          питомник кошек мейн-кун
        </p>
        <h1 className="hero-title mt-5 flex flex-col gap-0">
          <span className="hero-title-primary font-display text-6xl font-medium leading-[0.88] tracking-[0.06em] text-white sm:text-8xl md:text-[7.5rem]">
            LARGE BRUSH
          </span>
          <span className="mt-4 font-hand text-5xl leading-none text-[#d6b878] sm:text-6xl md:text-7xl">
            {capsName}
          </span>
        </h1>
        <p className="mt-7 max-w-lg text-base leading-relaxed text-white/80 sm:text-lg">
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
        <div className="hero-note hidden self-end justify-self-end border-l border-white/35 pl-5 text-sm leading-relaxed text-white/70 md:block">
          <span className="mb-2 block font-display text-2xl text-white">Жить рядом.</span>
          Растить с вниманием к характеру,<br />здоровью и домашнему ритму.
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
