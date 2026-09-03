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
      <PageHeader title="Контакты" />
      <Section
        id="contacts"
        title="Свяжитесь с нами"
        subtitle="Наши малыши ждут встречи с Вами!"
      >
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-12">
          <a
            href={`tel:${site.phoneTel}`}
            className="flex items-center gap-3 rounded-xl border border-border bg-card px-6 py-4 transition-colors hover:border-accent"
          >
            <span className="text-2xl" aria-hidden>
              📞
            </span>
            <span className="text-foreground">{site.phoneDisplay}</span>
          </a>
          <a
            href={`mailto:${site.email}`}
            className="flex items-center gap-3 rounded-xl border border-border bg-card px-6 py-4 transition-colors hover:border-accent"
          >
            <span className="text-2xl" aria-hidden>
              ✉️
            </span>
            <span className="text-foreground">{site.email}</span>
          </a>
        </div>
        <p className="mx-auto mt-10 max-w-xl text-center text-muted">
          Позвоните или напишите нам — с радостью ответим на все вопросы о наших
          питомцах, бронировании котят и изделиях ручной работы.
        </p>
      </Section>
    </>
  );
}
