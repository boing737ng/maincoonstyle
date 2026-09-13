import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Prata, Nunito_Sans, Caveat } from "next/font/google";
import "./globals.css";

const prata = Prata({
  subsets: ["latin", "cyrillic"],
  weight: "400",
  variable: "--font-prata",
  display: "swap",
});

const nunito = Nunito_Sans({
  subsets: ["latin", "cyrillic"],
  variable: "--font-nunito",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin", "cyrillic"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "LargeBrush Cattery — питомник мейн-кунов",
    template: "%s | LargeBrush Cattery",
  },
  description:
    "Домашний питомник мейн-кунов. Котята, коты и кошки, а также уникальные лежанки и мебель ручной работы для ваших питомцев.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="ru"
      className={`h-full antialiased ${prata.variable} ${nunito.variable} ${caveat.variable}`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
