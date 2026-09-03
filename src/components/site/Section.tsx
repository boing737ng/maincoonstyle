import type { ReactNode } from "react";

export function PageHeader({ title }: { title: string }) {
  return (
    <div className="relative overflow-hidden border-b border-border bg-gradient-to-b from-[#1a1420] to-background">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(200,162,74,0.12),transparent_60%)]" />
      <div className="container-site relative py-16 text-center sm:py-20">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>
      </div>
    </div>
  );
}

export function Section({
  id,
  title,
  subtitle,
  children,
}: {
  id: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 py-16 sm:py-20">
      <div className="container-site">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-3 text-muted">{subtitle}</p>
          )}
          <div className="mx-auto mt-5 h-px w-16 bg-accent" />
        </div>
        {children}
      </div>
    </section>
  );
}

export function Bullet({
  marker,
  children,
}: {
  marker: string;
  children: ReactNode;
}) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 text-accent" aria-hidden>
        {marker}
      </span>
      <span className="text-muted">{children}</span>
    </li>
  );
}