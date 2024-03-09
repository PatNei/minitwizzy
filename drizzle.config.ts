import type { Config } from "drizzle-kit";
import { MIGRATIONS_PATH } from "./src/constants/paths";

export default {
  schema: "src/schemas/*",
  out: MIGRATIONS_PATH,
} satisfies Config;
