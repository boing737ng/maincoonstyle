import { logoutAction } from "@/app/admin/actions";

export default async function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="container-site flex h-16 items-center justify-between">
          <a href="/admin" className="text-lg font-semibold tracking-tight">
            <span className="text-accent">Maincoon</span> Style — админ-панель
          </a>
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
