import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader, Section } from "@/components/site/Section";
import { getPublishedProducts } from "@/lib/products";
import { publicUrl } from "@/lib/shared";
import { CheckIcon, StarIcon } from "@/components/site/icons";

export const metadata: Metadata = {
  title: "Лежанки, Мебель",
};

export const dynamic = "force-dynamic";

export default async function FurniturePage() {
  const products = await getPublishedProducts();
  return (
    <>
      <PageHeader
        eyebrow="Лежанки, Мебель"
        title="Изделия ручной работы"
        subtitle="Каждый аксессуар создан с теплом и заботой о вашем питомце."
      />

      <Section id="catalog" title="Уникальные лежанки ручной работы">
        <div className="max-w-3xl space-y-6 text-[17px] leading-relaxed text-muted">
          <p>
            Для наших любимых мейн-кунов мы создали серию эксклюзивных лежанок
            ручной работы, изготовленных специально для комфорта и удобства
            пушистых друзей.
          </p>
          <ul className="space-y-3">
            <CheckItem>
              Каждая лежанка выполнена индивидуально, с учётом предпочтений
              кошки и пожеланий владельца.
            </CheckItem>
            <CheckItem>
              Мы используем различные техники исполнения: шитье, плетение,
              вязание крючком.
            </CheckItem>
            <CheckItem>
              Наши изделия представлены разнообразием форм и конструкций:
              классические плоские лежанки, уютные корзинки, удобные мягкие
              домики-крепости, гамаки-палатки и многое другое.
            </CheckItem>
            <CheckItem>
              Вы можете заказать индивидуальную разработку лежанки с учётом
              цвета, формы, размера и материала.
            </CheckItem>
          </ul>
          <p>
            Каждый аксессуар сделан вручную, с теплом и заботой, что
            гарантирует вашему питомцу комфорт и удовольствие от отдыха на
            нашей уникальной продукции.
          </p>
          <p className="font-display text-lg italic text-foreground">
            Хотите порадовать своего кота? Закажите уникальную лежанку прямо
            сейчас и подарите своему другу настоящий праздник комфорта и
            тепла!
          </p>
        </div>

        <div className="mt-10">
          {products.length === 0 ? (
            <p className="text-muted">
              Фотографии и номера изделий появятся здесь в ближайшее время.
            </p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
              {products.map((product) => {
                const cover =
                  product.photos.find((photo) => photo.isCover) ??
                  product.photos[0];
                const label = `${product.category === "BED" ? "Лежанка" : "Мебель"} № ${product.number}`;
                return (
                  <article
                    key={product.id}
                    className="group"
                  >
                    <div className="photo-frame">
                      <div className="relative aspect-square w-full overflow-hidden bg-card-2">
                        {cover ? (
                          <Image
                            src={publicUrl(cover.objectKey)}
                            alt={label}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full flex-col items-center justify-center gap-3">
                            <span className="font-display text-3xl tracking-[0.08em] text-accent/70">LB</span>
                            <span className="px-4 text-center text-sm text-muted">
                              {label}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="px-1 pt-3 font-display text-xl leading-none text-foreground/90 transition-colors group-hover:text-accent-hover">
                      {label}
                    </p>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </Section>

      <Section id="wood" title="Деревянная мебель для кошек ручной работы">
        <div className="max-w-3xl space-y-6 text-[17px] leading-relaxed text-muted">
          <p>
            Мы запускаем новое направление — производство качественной
            деревянной мебели для кошек. Уже сегодня вы можете приобрести
            элегантные деревянные лежанки ручной работы, созданные специально
            для вашего любимого питомца.
          </p>
          <ul className="space-y-3">
            <StarItem>
              Изготавливается исключительно из экологически чистых материалов
              высшего качества.
            </StarItem>
            <StarItem>
              Удобство, прочность и долговечность каждой модели гарантируются
              нашим опытом и вниманием к деталям.
            </StarItem>
          </ul>
          <p>
            Уже скоро расширим ассортимент мебелью, предназначенной для
            активного досуга и комфортного проживания вашего пушистого друга.
            Следите за обновлениями и первыми приобретайте нашу новую
            коллекцию мебели для питомцев, разработанной специально для
            истинных ценителей прекрасного дизайна и экологичных решений.
          </p>
        </div>
      </Section>
    </>
  );
}

function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <CheckIcon className="mt-1 h-5 w-5 shrink-0 text-amber-soft" />
      <span>{children}</span>
    </li>
  );
}

function StarItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <StarIcon className="mt-1 h-5 w-5 shrink-0 text-amber-soft" />
      <span>{children}</span>
    </li>
  );
}
