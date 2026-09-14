import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";

export default async function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="container-site flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <a
              href="/admin"
              className="text-lg font-semibold tracking-tight whitespace-nowrap"
            >
              <span className="font-hand text-accent">LargeBrush</span> — админ-
              панель
            </a>
            <nav className="hidden items-center gap-4 text-sm sm:flex">
              <Link
                href="/admin"
                className="text-muted transition-colors hover:text-accent"
              >
                Животные и товары
              </Link>
              <Link
                href="/admin/orders"
                className="text-muted transition-colors hover:text-accent"
              >
                Заявки
              </Link>
            </nav>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-md border border-border px-3 py-1.5 text-sm text-muted transition-colors hover:border-accent hover:text-foreground"
            >
              Выйти
            </button>
          </form>
        </div>
      </header>
      <main className="container-site py-8">{children}</main>
    </div>
  );
}
