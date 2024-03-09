import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { DB_PATH, MIGRATIONS_PATH } from "../constants/paths";
import { drizzleLogger } from "../util/loggingutil";

const sqlite = new Database(DB_PATH);

const db = drizzle(sqlite, { logger: drizzleLogger });

migrate(db, { migrationsFolder: MIGRATIONS_PATH });

sqlite.close();
