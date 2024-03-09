import { sqliteTable, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const latestAction = sqliteTable("LatestAction", {
  id: integer("id").primaryKey().default(0),
  actionId: integer("actionId").notNull(),
});

export type LatestAction = typeof latestAction.$inferSelect;
export type InsertLatestAction = typeof latestAction.$inferInsert;
export const insertLatestActionSchema = createInsertSchema(latestAction);
export const selectLatestActionSchema = createSelectSchema(latestAction);
