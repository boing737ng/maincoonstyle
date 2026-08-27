const NAV_LINKS = [
  { href: "#kittens", label: "Котята" },
  { href: "#cats", label: "Коты" },
  { href: "#females", label: "Кошки" },
  { href: "#breed", label: "О породе" },
  { href: "#about", label: "О нас" },
  { href: "#furniture", label: "Лежанки и мебель" },
  { href: "#contacts", label: "Контакты" },
];

export function Header({
  siteName,
  phoneDisplay,
  phoneTel,
}: {
  siteName: string;
  phoneDisplay: string;
  phoneTel: string;
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <div className="container-site flex h-16 items-center justify-between gap-4">
        <a href="#" className="text-lg font-bold tracking-tight text-foreground">
          {siteName}
        </a>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted transition-colors hover:text-accent"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href={`tel:${phoneTel}`}
          className="hidden whitespace-nowrap text-sm font-semibold text-accent sm:block"
        >
          {phoneDisplay}
        </a>
      </div>
    </header>
  );
}

export function MobileNav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur lg:hidden">
      <div className="container-site flex h-11 items-center gap-4 overflow-x-auto text-sm">
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="whitespace-nowrap text-muted transition-colors hover:text-accent"
          >
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

export function CallBar({
  phoneDisplay,
  phoneTel,
}: {
  phoneDisplay: string;
  phoneTel: string;
}) {
  return (
    <a
      href={`tel:${phoneTel}`}
      className="fixed inset-x-0 bottom-0 z-50 flex h-14 items-center justify-center gap-2 bg-accent text-base font-semibold text-accent-foreground transition-colors hover:bg-accent-hover sm:hidden"
    >
      Позвонить · {phoneDisplay}
    </a>
  );
}