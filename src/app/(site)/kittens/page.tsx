import type { Metadata } from "next";
import { Suspense } from "react";
import { getKittens, getKittenFilterOptions } from "@/lib/animals";
import { kittenQuerySchema } from "@/lib/schemas";
import { KittenGrid } from "@/components/site/AnimalGrids";
import { PageHeader, Section } from "@/components/site/Section";
import { KittenFilters as KittenFilterControls } from "@/components/site/KittenFilters";

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
  const value = (key: string) => {
    const v = params[key];
    return typeof v === "string" && v ? v : undefined;
  };
  const parsed = kittenQuerySchema.safeParse({
    status: value("status"),
    sex: value("sex"),
    color: value("color"),
    sort: value("sort"),
  });
  const filters = parsed.success ? parsed.data : {};

  const [kittens, options] = await Promise.all([
    getKittens(filters),
    getKittenFilterOptions(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Котята"
        title="Наши малыши"
        subtitle="Каждый из них ждёт свою любящую семью."
      />
      <Section id="kittens" title="Выберите своего малыша">
        <div className="stitch mb-8 bg-card/40 p-4">
          <Suspense fallback={null}>
            <KittenFilterControls sexes={options.sexes} colors={options.colors} />
          </Suspense>
        </div>

        <p className="mb-6 text-sm text-muted">
          Найдено котят:{" "}
          <span className="font-semibold text-foreground">{kittens.length}</span>
        </p>

        <KittenGrid kittens={kittens} />
      </Section>
    </>
  );
}
