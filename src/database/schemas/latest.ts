import { integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const latestAction = sqliteTable("latestAction", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	actionId: integer("actionId").notNull(),
});

export type LatestAction = typeof latestAction.$inferSelect;
export type InsertLatestAction = typeof latestAction.$inferInsert;
