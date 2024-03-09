import { sqliteTable, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const followers = sqliteTable("follower", {
	whoId: integer("whoId").notNull(),
	whomId: integer("whomId").notNull(),
});

export type Follower = typeof followers.$inferSelect;
export type InsertFollower = typeof followers.$inferInsert;
export const insertFollowerSchema = createInsertSchema(followers);
export const selectFollowerSchema = createSelectSchema(followers);
