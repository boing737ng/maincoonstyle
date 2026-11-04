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

  const availableKittens = kittens.filter((kitten) => kitten.status === "AVAILABLE");
  const featuredKittens = (availableKittens.length > 0 ? availableKittens : kittens).slice(0, 3);
  const kittensTitle = availableKittens.length > 0
    ? "Котята, которых уже любят"
    : "Наши котята";
  const kittensSubtitle = availableKittens.length > 0
    ? "Они растут рядом с нами, в спокойной домашней обстановке."
    : "Познакомьтесь с нашими малышами и следите за новостями питомника.";

  return (
    <>
      <Hero siteName={site.name} phoneTel={site.phoneTel} />

      <Section
        id="kittens"
        eyebrow="сейчас в питомнике"
        title={kittensTitle}
        subtitle={kittensSubtitle}
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
        className="hero-media object-cover"
      />
      <div className="hero-overlay absolute inset-0" aria-hidden />
      <div className="hero-glow absolute inset-0" aria-hidden />

      <div className="container-site relative flex min-h-[32rem] items-end py-5 sm:min-h-[38rem] sm:py-8 md:min-h-[42rem] md:py-10">
        <div className="hero-copy hero-panel w-full max-w-5xl">
          <div className="hero-panel-main">
            <p className="hero-kicker text-[11px] font-medium tracking-[0.25em] text-white/70 uppercase sm:text-xs sm:tracking-[0.3em]">
              питомник кошек мейн-кун
            </p>
            <h1 className="hero-title mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1 sm:mt-3 sm:gap-x-5">
              <span className="hero-title-primary font-display text-4xl font-medium leading-none tracking-[0.03em] text-white sm:text-7xl md:text-8xl">
                LARGE BRUSH
              </span>
              <span className="font-hand text-3xl leading-none text-[#d6b878] sm:text-5xl md:text-6xl">
                {capsName}
              </span>
            </h1>
            <p className="hero-description mt-3 max-w-xl text-sm leading-relaxed text-white/80 sm:mt-4 sm:text-lg">
              Дом больших кошек, где каждый мейн-кун растёт рядом с людьми, в заботе,
              спокойствии и любви.
            </p>
          </div>

          <div className="hero-panel-actions mt-5 flex flex-col gap-2.5 sm:mt-6 sm:flex-row sm:gap-3 md:mt-0">
            <Link href="/kittens" className="btn btn-solid">
              Смотреть котят
            </Link>
            <a href={`tel:${phoneTel}`} className="btn btn-ghost">
              Связаться с нами
            </a>
          </div>
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
