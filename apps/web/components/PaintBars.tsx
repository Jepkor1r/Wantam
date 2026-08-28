export function PaintBars({
  title,
  rows,
  unit = "",
}: {
  title: string;
  rows: { label: string; value: number; max: number }[];
  unit?: string;
}) {
  return (
    <article className="rounded-md bg-bone-white p-[17px] text-ink-black">
      <p className="font-mono text-[12px] leading-[0.8] tracking-[0.05em]">
        {title}
      </p>
      <div className="mt-4 flex flex-col gap-3">
        {rows.map((row) => {
          const pct = Math.min(100, Math.round((row.value / row.max) * 100));
          return (
            <div key={row.label}>
              <div className="mb-1 flex justify-between font-mono text-[12px] leading-[0.8] tracking-[0.05em]">
                <span>{row.label}</span>
                <span>
                  {row.value}
                  {unit}
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-md bg-dusk-violet">
                <div
                  className="h-full bg-hi-vis-yellow"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}

export function PaintColumns({
  title,
  rows,
}: {
  title: string;
  rows: { label: string; value: number }[];
}) {
  const max = Math.max(...rows.map((r) => r.value), 1);
  return (
    <article className="rounded-md bg-bone-white p-[17px] text-ink-black">
      <p className="font-mono text-[12px] leading-[0.8] tracking-[0.05em]">
        {title}
      </p>
      <div className="mt-6 flex h-40 items-end gap-4">
        {rows.map((row) => {
          const h = Math.max(8, Math.round((row.value / max) * 140));
          return (
            <div key={row.label} className="flex flex-1 flex-col items-center gap-2">
              <span className="font-mono text-[12px] leading-[0.8]">{row.value}</span>
              <div
                className="w-full rounded-md bg-hi-vis-yellow"
                style={{ height: h }}
              />
              <span className="text-center font-mono text-[10px] leading-[1] tracking-[0.05em]">
                {row.label}
              </span>
            </div>
          );
        })}
      </div>
    </article>
  );
}

export function PaintShare({
  title,
  rows,
}: {
  title: string;
  rows: { label: string; value: number }[];
}) {
  const total = rows.reduce((sum, row) => sum + row.value, 0) || 1;
  const fills = [
    "bg-hi-vis-yellow text-pure-black",
    "bg-dusk-violet text-bone-white",
    "bg-matcha-cream text-ink-black",
    "bg-lilac-shadow text-bone-white",
  ];
  return (
    <article className="rounded-md bg-bone-white p-[17px] text-ink-black">
      <p className="font-mono text-[12px] leading-[0.8] tracking-[0.05em]">
        {title}
      </p>
      <div className="mt-4 flex h-10 overflow-hidden rounded-md">
        {rows.map((row, i) => {
          if (row.value <= 0) return null;
          const pct = Math.max(8, Math.round((row.value / total) * 100));
          return (
            <div
              key={row.label}
              className={`flex items-center justify-center font-mono text-[10px] leading-[1] ${fills[i % fills.length]}`}
              style={{ width: `${pct}%` }}
              title={`${row.label}: ${row.value}`}
            >
              {row.label}
            </div>
          );
        })}
      </div>
      <ul className="mt-4 flex flex-col gap-1 font-mono text-[12px] leading-[0.8] tracking-[0.05em]">
        {rows.map((row) => (
          <li key={row.label} className="flex justify-between">
            <span>{row.label}</span>
            <span>
              {row.value} · {Math.round((row.value / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}

export function HelpStrip({
  youDo,
  itHelps,
  doLabel,
  helpLabel,
}: {
  youDo: string;
  itHelps: string;
  doLabel: string;
  helpLabel: string;
}) {
  return (
    <div className="grid gap-10 md:grid-cols-2">
      <article className="rounded-md bg-lilac-shadow p-[17px] text-bone-white">
        <p className="font-mono text-[12px] leading-[0.8] tracking-[0.05em]">
          {doLabel}
        </p>
        <p className="mt-3 font-ui text-[16px] leading-[1.15] tracking-[0.8px]">
          {youDo}
        </p>
      </article>
      <article className="rounded-md bg-matcha-cream p-[17px] text-ink-black">
        <p className="font-mono text-[12px] leading-[0.8] tracking-[0.05em]">
          {helpLabel}
        </p>
        <p className="mt-3 font-ui text-[16px] leading-[1.15] tracking-[0.8px]">
          {itHelps}
        </p>
      </article>
    </div>
  );
}
