import { sqliteTable, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const followers = sqliteTable("latest", {
  whom_id: integer("whom_id"),
});

export type Follower = typeof followers.$inferSelect;
export type InsertFollower = typeof followers.$inferInsert;
export const insertFollowerSchema = createInsertSchema(followers);
export const selectFollowerSchema = createSelectSchema(followers);
