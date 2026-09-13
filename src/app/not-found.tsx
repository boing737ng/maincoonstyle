import Link from "next/link";
import { PawIcon } from "@/components/site/icons";

export default function NotFound() {
  return (
    <div className="container-site flex min-h-[60vh] flex-col items-center justify-center gap-6 py-20 text-center">
      <PawIcon className="h-12 w-12 text-amber-soft/70" />
      <p className="font-display text-6xl leading-none text-accent-hover">404</p>
      <h1 className="text-3xl text-foreground sm:text-4xl">
        Здесь никого нет
      </h1>
      <p className="max-w-md text-lg leading-relaxed text-muted">
        Такой страницы на сайте нет. Загляните к нашим котятам — они точно на
        месте.
      </p>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <Link href="/kittens" className="btn btn-solid">
          Смотреть котят
        </Link>
        <Link href="/" className="btn btn-ghost">
          На главную
        </Link>
      </div>
    </div>
  );
}
