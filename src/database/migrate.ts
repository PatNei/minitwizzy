import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { MIGRATIONS_PATH } from "src/constants/paths";
import { db, sqlite_connection } from "./db";


migrate(db, { migrationsFolder: MIGRATIONS_PATH});
sqlite_connection.close()
