const SW_NUM: Record<string, number> = {
  moja: 1,
  mbili: 2,
  tatu: 3,
  nne: 4,
  tano: 5,
  sita: 6,
  saba: 7,
  nane: 8,
  tisa: 9,
  kumi: 10,
  kumi_na_moja: 11,
  ishirini: 20,
  thelathini: 30,
};

export function parseCount(token: string): number | null {
  const t = token.toLowerCase().replace(/,/g, "").trim();
  if (/^\d+(\.\d+)?$/.test(t)) return Number(t);
  if (SW_NUM[t] != null) return SW_NUM[t];
  return null;
}

export function weekStartIso(d = new Date()): string {
  const x = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = x.getUTCDay() || 7;
  x.setUTCDate(x.getUTCDate() - day + 1);
  return x.toISOString().slice(0, 10);
}

export function addDaysIso(iso: string, days: number): string {
  const x = new Date(`${iso}T00:00:00.000Z`);
  x.setUTCDate(x.getUTCDate() + days);
  return x.toISOString().slice(0, 10);
}
