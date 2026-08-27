import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Вход в админ-панель",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-lg border border-border bg-card p-8">
        <h1 className="mb-1 text-2xl font-semibold tracking-tight">
          <span className="text-accent">Maincoon</span> Style
        </h1>
        <p className="mb-6 text-sm text-muted">Вход в админ-панель</p>
        <LoginForm />
      </div>
    </div>
  );
}
