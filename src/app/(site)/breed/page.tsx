import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PageHeader } from "@/components/site/Section";
import { PawIcon } from "@/components/site/icons";

export const metadata: Metadata = {
  title: "О породе",
};

const PLANTS = [
  "Азалия",
  "Алоэ вера",
  "Амариллис",
  "Бегония",
  "Герань",
  "Гиацинт",
  "Диффербахия",
  "Драцена",
  "Замиокулькас",
  "Каланхоэ",
  "Лилия",
  "Монстера",
  "Плющ",
  "Спатифллум",
  "Тис ягодный",
  "Толстянка",
  "Традесканция",
  "Фикус лировидный",
  "Хомаломена Уоллеса",
  "Хризантема",
  "Цикламен",
  "Юкка",
];

export default function BreedPage() {
  return (
    <>
      <PageHeader
        eyebrow="О породе"
        title="Добрый великан с большим сердцем"
      />

      <div className="container-site pb-10">
        <div className="relative ml-[3px] border-l border-border pl-8 sm:ml-1 sm:pl-12">
          <TimelineSection id="memo" title="Памятка будущего владельца">
            <div className="space-y-6 text-[17px] leading-relaxed text-muted">
              <p>
                Эту Памятку я писала, исходя из своего личного опыта заводчика
                мейн-кунов с 5-летним стажем. Часть информации, конечно, взята на
                просторах интернета. Прошу не считать мой труд единственно
                правильным руководством к действию. Я только описываю то, как делаю
                сама. Конечно, в своем питомнике я не одна. Мне очень помогают моя
                дочь и маленькая внучка Кира. И эту памятку я написала, когда мы
                вместе с ней готовились к появлению в доме первого для них
                мейн-куна. Я старалась честно и доходчиво обьяснить ребенку все
                особенности породы, возможные подводные камни, нюансы ухода. И вся
                памятка — именно об этом. Я не писала про выставки, ни про
                племенную деятельность.
              </p>
            </div>
          </TimelineSection>

          <TimelineSection id="intro" title="Вступление">
            <div className="space-y-6 text-[17px] leading-relaxed text-muted">
              <p>
                В Вашем доме появился котенок и конечно, жизнь уже не будет
                прежней. Я всегда говорю будущим владельцам, что котенок — это тот
                же ребенок. Может и нахулиганить, и испортить что-то в доме, может
                заболеть, пораниться, отравиться и т.д. С котом нужно играть,
                разговаривать, вычесывать, мыть, обрабатывать от глистов и клещей.
                Не будет такого, что Вы насыпали корм, поменяли лоток, почесали за
                ушком и все, долг владельца выполнен. Любое животное требует
                внимания.
              </p>
              <p>
                Первый мейн-кун появился у меня в доме можно сказать, случайно.
                Маленькая Кира, впервые увидев у меня куна, страшно удивилась его
                огромным размерам. «Ба, а почему они такие большие???!!». Пришлось
                рассказать ей историю породы.
              </p>
            </div>
          </TimelineSection>

          <TimelineSection id="history" title="История породы" pending />
          <TimelineSection id="standard" title="Стандарты породы (по WCF)" pending />
          <TimelineSection id="character" title="Характер" pending />
          <TimelineSection id="grooming" title="Груминг" pending />
          <TimelineSection id="claws" title="Когти" pending />
          <TimelineSection id="litter" title="Туалет" pending />
          <TimelineSection id="scratcher" title="Когтеточка" pending />
          <TimelineSection id="feeding" title="Кормление" pending />

          <TimelineSection id="plants" title="Опасные растения">
            <div className="text-[17px] leading-relaxed text-muted">
              <p className="mb-6 max-w-3xl">
                Многие комнатные растения токсичны для кошек. Обезопасьте своего
                питомца — держите эти растения в недоступном для него месте.
              </p>
              <ul className="grid max-w-4xl gap-x-10 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
                {PLANTS.map((plant) => (
                  <li
                    key={plant}
                    className="flex items-center gap-2.5 border-b border-border/60 py-1.5"
                  >
                    <PawIcon
                      className="h-3.5 w-3.5 shrink-0 text-accent/50"
                    />
                    {plant}
                  </li>
                ))}
              </ul>
            </div>
          </TimelineSection>
        </div>
      </div>
    </>
  );
}

function TimelineSection({
  id,
  title,
  pending = false,
  children,
}: {
  id: string;
  title: string;
  pending?: boolean;
  children?: ReactNode;
}) {
  return (
    <section id={id} className="relative scroll-mt-24 py-8 sm:py-10">
      <span
        aria-hidden
        className="absolute -left-[7px] top-[38px] flex h-3.5 w-3.5 items-center justify-center rounded-full border border-accent/70 bg-background sm:-left-[13px]"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
      </span>
      <h2 className="text-2xl leading-tight text-accent-hover sm:text-3xl">
        {title}
      </h2>
      {pending ? <PendingNote /> : children}
    </section>
  );
}

function PendingNote() {
  return (
    <p className="mt-5 flex max-w-2xl items-start gap-3 text-base italic leading-relaxed text-muted-strong">
      <PawIcon className="mt-1.5 h-4 w-4 shrink-0 text-accent/50" />
      Раздел готовится — материалы добавляются из памятки заводчика.
    </p>
  );
}
