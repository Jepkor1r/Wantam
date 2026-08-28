"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LangGlobe } from "@/components/LangGlobe";
import { useLang } from "@/lib/i18n";

type NavKey =
  | "overview"
  | "messaging"
  | "shelf"
  | "till"
  | "people"
  | "brief"
  | "credit"
  | "savings"
  | "channels"
  | "consent";

const SHOP: [string, NavKey][] = [
  ["/dashboard", "overview"],
  ["/dashboard/messaging", "messaging"],
  ["/dashboard/shelf", "shelf"],
  ["/dashboard/till", "till"],
  ["/dashboard/people", "people"],
];

const GROW: [string, NavKey][] = [
  ["/dashboard/brief", "brief"],
  ["/dashboard/credit", "credit"],
  ["/dashboard/savings", "savings"],
];

const SETUP: [string, NavKey][] = [
  ["/dashboard/channels", "channels"],
  ["/dashboard/consent", "consent"],
];

function NavGroup({
  label,
  links,
  pathname,
  t,
}: {
  label: string;
  links: [string, NavKey][];
  pathname: string;
  t: ReturnType<typeof useLang>["t"];
}) {
  return (
    <div className="mt-6">
      <p className="mb-2 px-3 font-mono text-[10px] leading-[1] tracking-[0.08em] text-buttery-yellow">
        {label}
      </p>
      <div className="flex flex-col gap-1">
        {links.map(([href, key]) => {
          const active =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : href === "/dashboard/messaging"
                ? pathname.startsWith("/dashboard/messaging") ||
                  pathname.startsWith("/dashboard/inbox") ||
                  pathname.startsWith("/dashboard/outbox")
                : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`rounded-md px-3 py-2 font-mono text-[12px] leading-[1] tracking-[0.05em] ${
                active
                  ? "bg-hi-vis-yellow text-pure-black"
                  : "text-bone-white hover:bg-dusk-violet"
              }`}
            >
              {t[key]}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function DashboardChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t } = useLang();

  return (
    <div className="flex min-h-dvh bg-dusk-violet">
      <aside className="sticky top-0 flex h-dvh w-[240px] shrink-0 flex-col border-r border-lilac-shadow bg-lilac-shadow px-4 py-[17px]">
        <Link
          href="/dashboard"
          className="font-display text-[30px] font-extrabold leading-[0.9] tracking-[0.02em] text-hi-vis-yellow [font-feature-settings:'calt'_0]"
        >
          DUKA
        </Link>
        <p className="mt-2 font-mono text-[12px] leading-[0.8] tracking-[0.05em] text-bone-white">
          {t.dash}
        </p>
        <nav className="flex flex-1 flex-col overflow-y-auto">
          <NavGroup label={t.navShop} links={SHOP} pathname={pathname} t={t} />
          <NavGroup label={t.navGrow} links={GROW} pathname={pathname} t={t} />
          <NavGroup label={t.navSetup} links={SETUP} pathname={pathname} t={t} />
        </nav>
        <Link
          href="/"
          className="mt-4 font-mono text-[12px] leading-[0.8] tracking-[0.05em] text-bone-white underline underline-offset-[3px]"
        >
          {t.back}
        </Link>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-dusk-violet px-5">
          <p className="font-mono text-[12px] leading-[0.8] tracking-[0.05em] text-bone-white">
            {t.shop}
          </p>
          <LangGlobe />
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto pt-8">{children}</div>
      </div>
    </div>
  );
}
