import { getPublishedAnimals } from "@/lib/animals";
import { AdultGrid } from "@/components/site/AnimalGrids";
import { PageHeader, Section } from "@/components/site/Section";
import type { AnimalCategory } from "@prisma/client";

export async function AdultCategoryPage({
  category,
  id,
  eyebrow,
  title,
  emptyText,
}: {
  category: AnimalCategory;
  id: string;
  eyebrow: string;
  title: string;
  emptyText: string;
}) {
  const animals = await getPublishedAnimals(category);
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} />
      <Section id={id} title={title}>
        <AdultGrid animals={animals} emptyText={emptyText} />
      </Section>
    </>
  );
}
