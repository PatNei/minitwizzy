import { integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const latestAction = sqliteTable("latestAction", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	actionId: integer("actionId").notNull(),
});

export type LatestAction = typeof latestAction.$inferSelect;
export type InsertLatestAction = typeof latestAction.$inferInsert;
export const insertLatestActionSchema = createInsertSchema(latestAction);
export const selectLatestActionSchema = createSelectSchema(latestAction);
