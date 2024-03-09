import type { Config } from "drizzle-kit";
import { DB_PATH, MIGRATIONS_PATH } from "./src/constants/paths";

export default {
  schema: "./src/constants/schema.ts",
  out: MIGRATIONS_PATH,
  driver:"better-sqlite",
  dbCredentials:{
    url:DB_PATH
  },
  verbose:true
} satisfies Config;
