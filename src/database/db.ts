import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { DB_PATH } from "../constants/paths";
import * as schema from "../constants/schema";
import { drizzleLogger } from "../middleware/logging-middleware";
export const sqlite_connection = new Database(DB_PATH);
export const db = drizzle(sqlite_connection, {
	schema: schema,
	logger: drizzleLogger,
});
