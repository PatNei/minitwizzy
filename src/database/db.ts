import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { DB_PATH } from "../constants/paths";
import { drizzleLogger } from "../util/loggingutil";

const sqlite = new Database(DB_PATH);
export const db = drizzle(sqlite, { logger: drizzleLogger });
