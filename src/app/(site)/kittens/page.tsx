import type { Metadata } from "next";
import { Suspense } from "react";
import { getKittens, getKittenFilterOptions, type KittenFilters } from "@/lib/animals";
import { KittenGrid } from "@/components/site/AnimalGrids";
import { PageHeader, Section } from "@/components/site/Section";
import { KittenFilters as KittenFilterControls } from "@/components/site/KittenFilters";
import type { AnimalStatus } from "@prisma/client";

export const metadata: Metadata = {
  title: "Котята",
};

export const dynamic = "force-dynamic";

export default async function KittensPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const status = params.status as AnimalStatus | undefined;
  const sex = typeof params.sex === "string" ? params.sex : undefined;
  const color = typeof params.color === "string" ? params.color : undefined;
  const sort = typeof params.sort === "string" ? params.sort : undefined;

  const filters: KittenFilters = { sex, color, status, sort } as KittenFilters;

  const [kittens, options] = await Promise.all([
    getKittens(filters),
    getKittenFilterOptions(),
  ]);

  return (
    <>
      <PageHeader title="Котята" />
      <Section id="kittens" title="Наши малыши" subtitle="Каждый из них ждёт свою семью">
        <div className="mb-8 rounded-2xl border border-border bg-card p-4">
          <Suspense fallback={null}>
            <KittenFilterControls sexes={options.sexes} colors={options.colors} />
          </Suspense>
        </div>

        <p className="mb-6 text-sm text-muted">
          Найдено котят: <span className="font-semibold text-foreground">{kittens.length}</span>
        </p>

        <KittenGrid kittens={kittens} />
      </Section>
    </>
  );
}
