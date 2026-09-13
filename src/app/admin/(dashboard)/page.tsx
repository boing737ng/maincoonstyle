import type { Metadata } from "next";
import Link from "next/link";
import { getAllAnimals } from "@/lib/animals";
import { formatPrice } from "@/lib/format";
import { StatusBadge } from "@/components/StatusBadge";
import { AnimalRowActions } from "@/components/admin/AnimalRowActions";
import { PublishedToggle } from "@/components/admin/PublishedToggle";
import { publicUrl } from "@/lib/storage";
import type { AnimalCategory } from "@prisma/client";
import { getAllProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Животные",
};

export default async function AdminPage() {
  const [animals, products] = await Promise.all([getAllAnimals(), getAllProducts()]);

  const categories: { value: AnimalCategory; label: string }[] = [
    { value: "KITTEN", label: "Котята" },
    { value: "MALE", label: "Коты" },
    { value: "FEMALE", label: "Кошки" },
  ];

  const groups = categories.map((cat) => ({
    ...cat,
    animals: animals.filter((a) => a.category === cat.value),
  }));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Животные</h1>
        <Link
          href="/admin/animals/new"
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover"
        >
          + Добавить
        </Link>
      </div>

      {groups.map((group) => (
        <section key={group.value} className="mb-8">
          <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted">
            {group.label}{" "}
            <span className="text-zinc-600">({group.animals.length})</span>
          </h2>

          {group.animals.length === 0 ? (
            <p className="rounded-md border border-border bg-card px-4 py-6 text-sm text-muted">
              Нет животных в этой категории
            </p>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {group.animals.map((animal) => {
                const cover = animal.photos.find((p) => p.isCover) ?? animal.photos[0];
                return (
                  <li
                    key={animal.id}
                    className="flex flex-col rounded-lg border border-border bg-card p-4"
                  >
                    <div className="mb-3 flex items-start gap-3">
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md border border-border bg-background">
                        {cover ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={publicUrl(cover.objectKey)}
                            alt={animal.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-muted">
                            —
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/admin/animals/${animal.id}/edit`}
                          className="block truncate font-medium text-foreground hover:text-accent"
                        >
                          {animal.name}
                        </Link>
                        {animal.number ? (
                          <p className="text-xs text-muted">№ {animal.number}</p>
                        ) : null}
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <StatusBadge status={animal.status} />
                          {animal.price != null ? (
                            <span className="text-xs text-muted">
                              {formatPrice(animal.price)}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
                      <PublishedToggle
                        animalId={animal.id}
                        published={animal.published}
                      />
                      <AnimalRowActions animalId={animal.id} />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      ))}
      <section className="mb-8 border-t border-border pt-8">
        <div className="mb-3 flex items-center justify-between"><h2 className="text-sm font-medium uppercase tracking-wide text-muted">Лежанки и мебель ({products.length})</h2><Link href="/admin/products/new" className="rounded-md border border-accent px-3 py-1.5 text-sm text-accent">+ Добавить товар</Link></div>
        {products.length === 0 ? <p className="rounded-md border border-border bg-card px-4 py-6 text-sm text-muted">Товаров пока нет</p> : <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{products.map((product) => <li key={product.id} className="border border-border bg-card p-4"><Link href={`/admin/products/${product.id}/edit`} className="font-medium text-foreground hover:text-accent">{product.category === "BED" ? "Лежанка" : "Мебель"} № {product.number}</Link><p className="mt-1 text-sm text-muted">Фото: {product.photos.length}</p><p className="mt-3 text-sm text-muted">{product.published ? "Опубликован" : "Черновик"}</p></li>)}</ul>}
      </section>
    </div>
  );
}
