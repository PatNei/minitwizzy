import type { Config } from "drizzle-kit";
import { DB_PATH, MIGRATIONS_PATH, SCHEMA_PATH } from "./src/constants/paths";
export default {
	schema: SCHEMA_PATH,
	out: MIGRATIONS_PATH,
	driver: "better-sqlite",
	dbCredentials: {
		url: DB_PATH,
	},
	verbose: false,
} satisfies Config;
