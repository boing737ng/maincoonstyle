import type { ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  eyebrow,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
}) {
  return (
    <div className="relative overflow-hidden border-b border-border bg-card/40">
      <div className="container-site py-14 sm:py-20">
        <div className="max-w-3xl">
          {eyebrow && (
            <p className="mb-4 text-xs font-semibold tracking-[0.14em] text-accent-hover uppercase">
              {eyebrow}
            </p>
          )}
          <h1 className="max-w-2xl text-4xl leading-[1.04] text-foreground sm:text-5xl md:text-6xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function Section({
  id,
  title,
  subtitle,
  eyebrow,
  children,
}: {
  id: string;
  title: string;
  subtitle?: string;
  eyebrow?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 py-16 sm:py-20">
      <div className="container-site">
        <div className="mb-10 max-w-3xl">
          {eyebrow && (
            <p className="mb-4 text-xs font-semibold tracking-[0.14em] text-accent-hover uppercase">
              {eyebrow}
            </p>
          )}
          <h2 className="max-w-2xl text-3xl leading-[1.08] text-foreground sm:text-4xl md:text-5xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-3 text-base leading-relaxed text-muted sm:text-lg">
              {subtitle}
            </p>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}

export function Bullet({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span
        className="mt-3 h-0 w-6 shrink-0 border-t border-accent"
        aria-hidden
      />
      <span className="text-muted">{children}</span>
    </li>
  );
}
