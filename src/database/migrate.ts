import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { db, sqlite_connection } from "./db";
import { MIGRATIONS_PATH } from "src/constants/paths";

migrate(db, { migrationsFolder: MIGRATIONS_PATH});

sqlite_connection.close();
