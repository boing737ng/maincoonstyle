import type { Metadata } from "next";
import { AdultCategoryPage } from "@/components/site/AdultCategoryPage";

export const metadata: Metadata = { title: "Кошки" };
export const dynamic = "force-dynamic";

export default function FemalesPage() {
  return (
    <AdultCategoryPage
      category="FEMALE"
      id="females"
      eyebrow="Производительницы"
      title="Кошки"
      emptyText="Информация о наших кошках скоро появится."
    />
  );
}
