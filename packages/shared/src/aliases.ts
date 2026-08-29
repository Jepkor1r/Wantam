export type SkuUnit = "piece" | "tray" | "kg" | "bag";

export type SkuDef = {
  id: string;
  name: string;
  unit: SkuUnit;
  aliases: string[];
  lowStock: number;
  opening: number;
};

/** Mama Kuku Fresh demo catalogue. Aliases cover Sheng / Swahili / English. */
export const DEFAULT_SKUS: SkuDef[] = [
  {
    id: "kuku",
    name: "Kuku",
    unit: "piece",
    aliases: ["kuku", "chicken", "kuku live"],
    lowStock: 5,
    opening: 40,
  },
  {
    id: "mayai",
    name: "Mayai",
    unit: "tray",
    aliases: ["mayai", "eggs", "egg", "tray", "trays"],
    lowStock: 2,
    opening: 8,
  },
  {
    id: "tomato",
    name: "Tomato",
    unit: "kg",
    aliases: ["tomato", "tomatoes", "nyanya", "nyaanya"],
    lowStock: 3,
    opening: 20,
  },
  {
    id: "mahindi",
    name: "Mahindi",
    unit: "kg",
    aliases: ["mahindi", "maize", "corn"],
    lowStock: 4,
    opening: 15,
  },
  {
    id: "feed",
    name: "Chicken feed",
    unit: "bag",
    aliases: ["feed", "chicken feed", "chakula cha kuku", "mash"],
    lowStock: 1,
    opening: 10,
  },
];

export function aliasToSkuId(token: string): string | null {
  const t = token.toLowerCase().trim();
  for (const sku of DEFAULT_SKUS) {
    if (sku.id === t || sku.name.toLowerCase() === t) return sku.id;
    if (sku.aliases.some((a) => a === t)) return sku.id;
  }
  return null;
}
