import { integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const followers = sqliteTable("follower", {
	whoId: integer("whoId").notNull(),
	whomId: integer("whomId").notNull(),
});

export type Follower = typeof followers.$inferSelect;
export type InsertFollower = typeof followers.$inferInsert;
