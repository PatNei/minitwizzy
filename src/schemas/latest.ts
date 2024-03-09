import { sqliteTable, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const latestTweet = sqliteTable("latestTweet", {
  id: integer("id").primaryKey().default(1),
  tweetId: integer("tweetId").notNull(),
  timestamp: integer("timestamp").notNull()
});

export type LatestTweet = typeof latestTweet.$inferSelect;
export type InsertLatestTweet = typeof latestTweet.$inferInsert;
export const insertLatestTweetSchema = createInsertSchema(latestTweet);
export const selectLatestTweetSchema = createSelectSchema(latestTweet);
