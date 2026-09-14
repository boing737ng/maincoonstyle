import { getPublishedAnimals } from "@/lib/animals";
import { AdultGrid } from "@/components/site/AnimalGrids";
import { PageHeader } from "@/components/site/Section";
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
      <section id={id} className="scroll-mt-24 py-14 sm:py-16">
        <div className="container-site">
          <AdultGrid animals={animals} emptyText={emptyText} />
        </div>
      </section>
    </>
  );
}
