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
    <div className="relative overflow-hidden border-b border-border">
      <div className="container-site py-12 sm:py-16">
        <div className="max-w-3xl">
          {eyebrow && (
            <p className="mb-3 text-sm font-medium tracking-[0.08em] text-accent-hover">
              {eyebrow}
            </p>
          )}
          <h1 className="text-3xl leading-[1.15] text-foreground sm:text-4xl md:text-5xl">
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
    <section id={id} className="scroll-mt-24 py-14 sm:py-16">
      <div className="container-site">
        <div className="mb-10 max-w-3xl">
          {eyebrow && (
            <p className="mb-3 text-sm font-medium tracking-[0.08em] text-accent-hover">
              {eyebrow}
            </p>
          )}
          <h2 className="text-3xl leading-tight text-foreground sm:text-4xl">
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
