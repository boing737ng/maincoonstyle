import type { ReactNode } from "react";
import { getSiteData } from "@/lib/constants";
import { Header, Footer, CallBar } from "@/components/site/Layout";

export default async function SiteLayout({
  children,
}: {
  children: ReactNode;
}) {
  const site = getSiteData();

  return (
    <div className="flex min-h-full flex-col">
      <Header
        siteName={site.name}
        phoneDisplay={site.phoneDisplay}
        phoneTel={site.phoneTel}
      />
      <main className="flex-1 pb-16 sm:pb-0">{children}</main>
      <Footer
        siteName={site.name}
        phoneDisplay={site.phoneDisplay}
        phoneTel={site.phoneTel}
        email={site.email}
      />
      <CallBar phoneDisplay={site.phoneDisplay} phoneTel={site.phoneTel} />
    </div>
  );
}
