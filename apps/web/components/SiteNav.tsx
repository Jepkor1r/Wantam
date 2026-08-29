import Link from "next/link";

const LINKS = [
  ["/dashboard", "Overview", "Muhtasari"],
  ["/dashboard/consent", "Consent", "Ridhaa"],
  ["/dashboard/channels", "Channels", "Njia"],
  ["/dashboard/messaging", "Messaging", "Ujumbe"],
  ["/dashboard/shelf", "Shelf", "Rafu"],
  ["/dashboard/till", "Till", "Duka / pesa"],
  ["/dashboard/people", "People", "Wateja"],
  ["/dashboard/brief", "Brief", "Ripoti"],
  ["/dashboard/credit", "Credit", "Mkopo"],
  ["/dashboard/savings", "Savings", "Akiba"],
  ["/dashboard/board", "Board", "Bodi"],
] as const;

export function DashboardNav() {
  return (
    <header className="px-5 py-[17px]">
      <Link
        href="/dashboard"
        className="block text-center font-display text-[30px] font-extrabold leading-[0.9] tracking-[0.02em] text-hi-vis-yellow [font-feature-settings:'calt'_0]"
      >
        DUKA
      </Link>
      <Link
        href="/"
        className="mt-3 block text-center font-mono text-[12px] leading-[0.8] tracking-[0.05em] text-bone-white underline underline-offset-[3px]"
      >
        Back to site · Rudi nyumbani
      </Link>
      <nav className="mx-auto mt-4 flex max-w-[1100px] flex-wrap justify-center gap-x-5 gap-y-2">
        {LINKS.map(([href, en, sw]) => (
          <Link
            key={href}
            href={href}
            className="font-mono text-[12px] leading-[0.8] tracking-[0.05em] text-bone-white underline-offset-4 hover:underline"
          >
            {en}
            <span className="text-buttery-yellow"> · {sw}</span>
          </Link>
        ))}
      </nav>
    </header>
  );
}

export function PageShell({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[1100px] px-5 pb-20">
      <p className="font-mono text-[12px] leading-[0.8] tracking-[0.05em] text-bone-white">
        {kicker}
      </p>
      <h1 className="mt-4 font-display text-[30px] font-extrabold leading-[0.9] tracking-[0.02em] text-hi-vis-yellow [font-feature-settings:'calt'_0]">
        {title}
      </h1>
      <div className="mt-10 flex flex-col gap-10">{children}</div>
    </div>
  );
}
