"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container-site flex min-h-[60vh] flex-col items-center justify-center gap-6 py-20 text-center">
      <h1 className="text-3xl font-medium text-foreground sm:text-4xl">
        Что-то пошло не так
      </h1>
      <p className="max-w-md text-lg leading-relaxed text-muted">
        Страница не смогла загрузиться. Попробуйте ещё раз.
      </p>
      <button type="button" onClick={reset} className="btn btn-solid mt-2">
        Попробовать снова
      </button>
    </div>
  );
}
