import type { Config } from "drizzle-kit";
import { MIGRATIONS_PATH } from "./src/constants/paths";

export default {
  schema: "./src/schemas/*.ts",
  driver: "better-sqlite",
   dbCredentials: {
    url: "./src/database/tmp/minitwit.db", // 👈 this could also be a path to the local sqlite file
  },
  out: MIGRATIONS_PATH,
  verbose:true
} satisfies Config;
