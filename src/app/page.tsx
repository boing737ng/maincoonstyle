import { getPublishedAnimals } from "@/lib/animals";
import { getSiteData } from "@/lib/constants";
import { Header, MobileNav, CallBar } from "@/components/site/Layout";
import { KittenGrid, AdultGrid } from "@/components/site/AnimalGrids";
import { Section, Bullet } from "@/components/site/Section";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const site = getSiteData();
  const [kittens, males, females] = await Promise.all([
    getPublishedAnimals("KITTEN"),
    getPublishedAnimals("MALE"),
    getPublishedAnimals("FEMALE"),
  ]);

  return (
    <main className="flex-1 pb-16 sm:pb-0">
      <Header
        siteName={site.name}
        phoneDisplay={site.phoneDisplay}
        phoneTel={site.phoneTel}
      />
      <MobileNav />

      <Hero phoneTel={site.phoneTel} />

      <Section
        id="kittens"
        title="Котята"
        subtitle="Наши малыши ищут свой дом"
      >
        <KittenGrid kittens={kittens} />
      </Section>

      <Section id="about" title="О нашем питомнике">
        <About />
      </Section>

      <Section
        id="breed"
        title="О породе"
        subtitle="Мейн-кун — ласковый гигант"
      >
        <Breed />
      </Section>

      <Section
        id="cats"
        title="Коты"
        subtitle="Наши производители"
      >
        <AdultGrid
          animals={males}
          emptyText="Информация о наших котах скоро появится."
        />
      </Section>

      <Section
        id="females"
        title="Кошки"
        subtitle="Наши производительницы"
      >
        <AdultGrid
          animals={females}
          emptyText="Информация о наших кошках скоро появится."
        />
      </Section>

      <Section
        id="furniture"
        title="Лежанки и мебель"
        subtitle="Уникальные изделия ручной работы для ваших питомцев"
      >
        <Furniture />
      </Section>

      <Section
        id="contacts"
        title="Контакты"
        subtitle="Свяжитесь с нами — наши малыши ждут встречи с Вами!"
      >
        <Contacts
          phoneTel={site.phoneTel}
          phoneDisplay={site.phoneDisplay}
          email={site.email}
        />
      </Section>

      <Footer
        siteName={site.name}
        phoneDisplay={site.phoneDisplay}
        phoneTel={site.phoneTel}
        email={site.email}
      />

      <CallBar phoneDisplay={site.phoneDisplay} phoneTel={site.phoneTel} />
    </main>
  );
}

function Hero({ phoneTel }: { phoneTel: string }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#1a1420] via-background to-background">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(200,162,74,0.15),transparent_60%)]" />
      <div className="container-site relative flex min-h-[80vh] flex-col items-center justify-center py-24 text-center">
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-accent">
          Питомник мейн-кунов
        </p>
        <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Добро пожаловать в мир больших кошек!
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted">
          Домашний питомник ласковых гигантов. Поможем каждому малышу найти
          самую лучшую и любящую семью.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <a
            href={`tel:${phoneTel}`}
            className="flex h-12 items-center justify-center rounded-full bg-accent px-8 font-semibold text-accent-foreground transition-colors hover:bg-accent-hover"
          >
            Позвонить
          </a>
          <a
            href="#kittens"
            className="flex h-12 items-center justify-center rounded-full border border-accent/40 px-8 font-semibold text-accent transition-colors hover:bg-accent/10"
          >
            Смотреть котят
          </a>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <div className="mx-auto max-w-3xl space-y-5 text-lg leading-relaxed text-muted">
      <p>
        Приветствуем Вас — тех, кто уже влюбился в породу мейн-кун и мечтает
        стать счастливым обладателем очаровательного пушистого друга. Наш
        питомник — уютный семейный дом, где каждое животное окружено любовью и
        заботой.
      </p>
      <p>
        Мы искренне верим, что главная цель заводчика — это развитие лучших
        качеств породы. Для нас важен каждый хвостик, каждая кисточка, ведь
        именно она делает наших малышей такими уникальными. Мы гордимся своим
        маленьким домашним питомником ласковых гигантов и стремимся подарить
        вам самые милые и нежные души.
      </p>
      <p>
        Наши котята растут среди людей, впитывая доброту и нежность каждого
        дня. Мы хотим найти каждому малышу самую лучшую семью, потому что
        понимаем: идеальный владелец — тот, кто будет любить своего питомца
        всей душой, уделять внимание, дарить тепло и радость общения.
      </p>
      <p>
        Кроме котят мы предлагаем уникальные аксессуары и мебель для ваших
        любимцев, чтобы жизнь вашего нового члена семьи была комфортной и
        счастливой.
      </p>
    </div>
  );
}

function Breed() {
  return (
    <div className="mx-auto max-w-3xl space-y-5 text-lg leading-relaxed text-muted">
      <p>
        Мейн-кун — одна из крупнейших домашних пород кошек в мире. Эти
        величественные животные сочетают внушительные размеры с невероятно
        добродушным и ласковым характером.
      </p>
      <p>
        Породу легко узнать по характерным кисточкам на ушах, большому пушистому
        хвосту и выразительному взгляду. Мейн-куны общительны и дружелюбны — их
        не зря называют «ласковыми гигантами», ведь они прекрасно ладят с людьми
        и становятся верными и нежными компаньонами для всей семьи.
      </p>
    </div>
  );
}

function Furniture() {
  return (
    <div className="mx-auto grid max-w-3xl gap-10">
      <div>
        <h3 className="mb-4 text-xl font-semibold text-foreground">
          Уникальные лежанки ручной работы
        </h3>
        <p className="mb-4 text-muted">
          Для наших любимых мейн-кунов мы создали серию эксклюзивных лежанок
          ручной работы, изготовленных специально для комфорта пушистых друзей.
        </p>
        <ul className="space-y-3">
          <Bullet marker="✅">
            Каждая лежанка выполнена индивидуально, с учётом предпочтений кошки
            и пожеланий владельца.
          </Bullet>
          <Bullet marker="✅">
            Мы используем различные техники исполнения: шитьё, плетение, вязание
            крючком.
          </Bullet>
          <Bullet marker="✅">
            Наши изделия представлены разнообразием форм и конструкций:
            классические плоские лежанки, уютные корзинки, мягкие домики,
            гамаки-палатки и многое другое.
          </Bullet>
          <Bullet marker="✅">
            Вы можете заказать индивидуальную разработку лежанки с учётом цвета,
            формы, размера и материала.
          </Bullet>
        </ul>
      </div>

      <div>
        <h3 className="mb-4 text-xl font-semibold text-foreground">
          Деревянная мебель для кошек ручной работы
        </h3>
        <p className="mb-4 text-muted">
          Мы запускаем новое направление — производство качественной деревянной
          мебели для кошек. Уже сегодня вы можете приобрести элегантные
          деревянные лежанки ручной работы, созданные специально для вашего
          любимого питомца.
        </p>
        <ul className="space-y-3">
          <Bullet marker="⭐">
            Изготавливается исключительно из экологически чистых материалов
            высшего качества.
          </Bullet>
          <Bullet marker="⭐">
            Удобство, прочность и долговечность каждой модели гарантируются нашим
            опытом и вниманием к деталям.
          </Bullet>
        </ul>
        <p className="mt-4 text-muted">
          Уже скоро расширим ассортимент мебелью для активного досуга и
          комфортного проживания вашего пушистого друга. Следите за обновлениями!
        </p>
      </div>
    </div>
  );
}

function Contacts({
  phoneTel,
  phoneDisplay,
  email,
}: {
  phoneTel: string;
  phoneDisplay: string;
  email: string;
}) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-12">
      <a
        href={`tel:${phoneTel}`}
        className="flex items-center gap-3 rounded-xl border border-border bg-card px-6 py-4 transition-colors hover:border-accent"
      >
        <span className="text-2xl" aria-hidden>
          📞
        </span>
        <span className="text-foreground">{phoneDisplay}</span>
      </a>
      <a
        href={`mailto:${email}`}
        className="flex items-center gap-3 rounded-xl border border-border bg-card px-6 py-4 transition-colors hover:border-accent"
      >
        <span className="text-2xl" aria-hidden>
          ✉️
        </span>
        <span className="text-foreground">{email}</span>
      </a>
    </div>
  );
}

function Footer({
  siteName,
  phoneDisplay,
  phoneTel,
  email,
}: {
  siteName: string;
  phoneDisplay: string;
  phoneTel: string;
  email: string;
}) {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border bg-card/40">
      <div className="container-site flex flex-col items-center gap-3 py-10 text-center text-sm text-muted">
        <span className="text-base font-semibold text-foreground">
          {siteName}
        </span>
        <a href={`tel:${phoneTel}`} className="hover:text-accent">
          {phoneDisplay}
        </a>
        <a href={`mailto:${email}`} className="hover:text-accent">
          {email}
        </a>
        <span>© {year} {siteName}. Все права защищены.</span>
      </div>
    </footer>
  );
}