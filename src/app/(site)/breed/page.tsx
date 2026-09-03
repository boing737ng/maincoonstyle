import type { Metadata } from "next";
import { PageHeader, Section } from "@/components/site/Section";

export const metadata: Metadata = {
  title: "О породе",
};

export default function BreedPage() {
  return (
    <>
      <PageHeader title="О породе" />
      <Section id="breed" title="Мейн-кун — ласковый гигант">
        <div className="mx-auto max-w-3xl space-y-5 text-lg leading-relaxed text-muted">
          <p>
            Мейн-кун — одна из крупнейших домашних пород кошек в мире. Эти
            величественные животные сочетают внушительные размеры с невероятно
            добродушным и ласковым характером.
          </p>
          <p>
            Породу легко узнать по характерным кисточкам на ушах, большому
            пушистому хвосту и выразительному взгляду. Мейн-куны общительны и
            дружелюбны — их не зря называют «ласковыми гигантами», ведь они
            прекрасно ладят с людьми и становятся верными и нежными
            компаньонами для всей семьи.
          </p>
        </div>
      </Section>
    </>
  );
}
