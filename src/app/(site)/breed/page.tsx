import type { Metadata } from "next";
import { PageHeader, Section } from "@/components/site/Section";

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
      <Section id="memo" title="Памятка будущего владельца">
        <div className="max-w-3xl space-y-6 text-[17px] leading-relaxed text-muted">
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
      </Section>

      <Section id="intro" title="Вступление">
        <div className="max-w-3xl space-y-6 text-[17px] leading-relaxed text-muted">
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
      </Section>

      <Section id="history" title="История породы">
        <div className="max-w-3xl space-y-6 text-[17px] leading-relaxed text-muted">
          <p>Текст</p>
        </div>
      </Section>

      <Section id="standard" title="Стандарты породы (по WCF)">
        <div className="max-w-3xl space-y-6 text-[17px] leading-relaxed text-muted">
          <p>Текст</p>
        </div>
      </Section>

      <Section id="character" title="Характер">
        <div className="max-w-3xl space-y-6 text-[17px] leading-relaxed text-muted">
          <p>Текст</p>
        </div>
      </Section>

      <Section id="grooming" title="Груминг">
        <div className="max-w-3xl space-y-6 text-[17px] leading-relaxed text-muted">
          <p>Текст</p>
        </div>
      </Section>

      <Section id="claws" title="Когти">
        <div className="max-w-3xl space-y-6 text-[17px] leading-relaxed text-muted">
          <p>Текст</p>
        </div>
      </Section>

      <Section id="litter" title="Туалет">
        <div className="max-w-3xl space-y-6 text-[17px] leading-relaxed text-muted">
          <p>Текст</p>
        </div>
      </Section>

      <Section id="scratcher" title="Когтеточка">
        <div className="max-w-3xl space-y-6 text-[17px] leading-relaxed text-muted">
          <p>Текст</p>
        </div>
      </Section>

      <Section id="feeding" title="Кормление">
        <div className="max-w-3xl space-y-6 text-[17px] leading-relaxed text-muted">
          <p>Текст</p>
        </div>
      </Section>

      <Section id="plants" title="Опасные растения">
        <div className="max-w-3xl text-[17px] leading-relaxed text-muted">
          <ul className="grid gap-x-10 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
            {PLANTS.map((plant) => (
              <li key={plant} className="border-b border-border/60 py-1.5">
                {plant}
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </>
  );
}
