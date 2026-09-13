import type { Metadata } from "next";
import { getSiteData } from "@/lib/constants";
import { PageHeader, Section } from "@/components/site/Section";

export const metadata: Metadata = {
  title: "Контакты",
};

export default function ContactsPage() {
  const site = getSiteData();

  return (
    <>
      <PageHeader
        eyebrow="контакты"
        title="Свяжитесь с нами"
        subtitle="Наши малыши ждут встречи с Вами."
      />
      <Section id="contacts" title="Как с нами связаться">
        <div className="grid max-w-4xl gap-5 sm:grid-cols-2">
          <a
            href={`tel:${site.phoneTel}`}
            className="stitch stitch-hover group flex flex-col justify-between gap-6 bg-card/40 p-8 transition-colors"
          >
            <span className="text-sm font-medium text-muted">
              позвонить
            </span>
            <span className="font-display text-2xl leading-tight text-foreground transition-colors group-hover:text-amber-soft">
              {site.phoneDisplay}
            </span>
          </a>
          <a
            href={`mailto:${site.email}`}
            className="stitch stitch-hover group flex flex-col justify-between gap-6 bg-card/40 p-8 transition-colors"
          >
            <span className="text-sm font-medium text-muted">
              написать
            </span>
            <span className="font-display break-all text-2xl leading-tight text-foreground transition-colors group-hover:text-amber-soft">
              {site.email}
            </span>
          </a>
        </div>

        <div className="mt-6 max-w-4xl">
          <p className="mb-3 text-sm font-medium text-muted">
            соцсети
          </p>
          <div className="flex flex-wrap gap-6">
            <a
              href={site.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg text-foreground underline decoration-dashed decoration-border underline-offset-8 transition-colors hover:text-amber-soft hover:decoration-amber-soft"
            >
              Facebook
            </a>
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg text-foreground underline decoration-dashed decoration-border underline-offset-8 transition-colors hover:text-amber-soft hover:decoration-amber-soft"
            >
              Instagram
            </a>
          </div>
        </div>

        <p className="mt-10 max-w-xl text-lg leading-relaxed text-muted">
          Позвоните или напишите нам — с радостью ответим на все вопросы о
          наших питомцах, бронировании котят и изделиях ручной работы.
        </p>
        <p className="mt-4 max-w-xl font-display text-2xl leading-snug text-accent-hover">
          звоните — мы всегда рады поговорить о котятах
        </p>
      </Section>
    </>
  );
}
