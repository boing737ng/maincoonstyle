"use client";

import { useActionState } from "react";
import { loginAction, type ActionResult } from "@/app/admin/actions";
import { ErrorMessage, Field, inputClass } from "@/components/admin/fields";

const initialState: ActionResult = { ok: false };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(
    loginAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-4">
      <ErrorMessage message={state.error} />
      <Field label="Логин">
        <input
          type="text"
          name="login"
          autoComplete="username"
          required
          className={inputClass}
        />
      </Field>
      <Field label="Пароль">
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          required
          className={inputClass}
        />
      </Field>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover disabled:opacity-50"
      >
        {pending ? "Вход..." : "Войти"}
      </button>
    </form>
  );
}
