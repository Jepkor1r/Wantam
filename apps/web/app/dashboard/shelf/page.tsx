"use client";

import { HelpStrip } from "@/components/PaintBars";
import { TShell, usePage } from "@/components/TShell";
import { getShop } from "@/lib/shop-store";

export default function ShelfPage() {
  const { t } = usePage();
  const shop = getShop();
  return (
    <TShell kicker={t.shKicker} title={t.shTitle}>
      <HelpStrip
        doLabel={t.youDo}
        helpLabel={t.itHelps}
        youDo={t.shDo}
        itHelps={t.shHelp}
      />
      <article className="rounded-md bg-matcha-cream p-[17px] text-ink-black">
        <ul className="space-y-3 font-ui text-[16px] leading-none tracking-[0.8px]">
          {shop.stock.map((row) => (
            <li key={row.sku}>{row.label}</li>
          ))}
        </ul>
        <p className="mt-6 font-mono text-[12px] leading-[0.8] tracking-[0.05em]">
          {shop.voice}
        </p>
      </article>
    </TShell>
  );
}
