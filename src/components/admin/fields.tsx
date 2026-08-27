import Link from "next/link";

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-muted">{hint}</span> : null}
    </label>
  );
}

export const inputClass =
  "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";

export function SubmitButton({
  children,
  variant = "primary",
}: {
  children: React.ReactNode;
  variant?: "primary" | "danger";
}) {
  const base =
    "rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50";
  const styles =
    variant === "primary"
      ? "bg-accent text-accent-foreground hover:bg-accent-hover"
      : "border border-red-600/40 bg-red-600/10 text-red-400 hover:bg-red-600/20";
  return (
    <button type="submit" className={`${base} ${styles}`}>
      {children}
    </button>
  );
}

export function CancelLink({ href = "/admin" }: { href?: string }) {
  return (
    <Link
      href={href}
      className="rounded-md border border-border px-4 py-2 text-sm text-muted transition-colors hover:border-accent hover:text-foreground"
    >
      Отмена
    </Link>
  );
}

export function ErrorMessage({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="rounded-md border border-red-600/40 bg-red-600/10 px-3 py-2 text-sm text-red-400">
      {message}
    </p>
  );
}
