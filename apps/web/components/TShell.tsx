"use client";

import { PageShell } from "@/components/SiteNav";
import { useLang } from "@/lib/i18n";

export function TShell({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <PageShell kicker={kicker} title={title}>
      {children}
    </PageShell>
  );
}

export function usePage() {
  return useLang();
}
