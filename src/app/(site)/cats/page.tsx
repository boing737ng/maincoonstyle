import type { Metadata } from "next";
import { AdultCategoryPage } from "@/components/site/AdultCategoryPage";

export const metadata: Metadata = { title: "Коты" };
export const dynamic = "force-dynamic";

export default function CatsPage() {
  return (
    <AdultCategoryPage
      category="MALE"
      id="cats"
      eyebrow="Производители"
      title="Коты"
      emptyText="Информация о наших котах скоро появится."
    />
  );
}
