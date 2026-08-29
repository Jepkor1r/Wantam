import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
config({ path: path.join(root, ".env") });
process.env.DATABASE_PATH ??= path.join(root, "data", "wantam.db");

const { boot } = await import("./app");
boot();
