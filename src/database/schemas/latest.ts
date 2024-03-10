import { integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const latestAction = sqliteTable("latestAction", {
	actionId: integer("actionId").primaryKey(),
});

export type LatestAction = typeof latestAction.$inferSelect;
export type InsertLatestAction = typeof latestAction.$inferInsert;
