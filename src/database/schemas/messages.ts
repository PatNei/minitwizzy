import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const messages = sqliteTable("message", {
	messageId: integer("messageId").primaryKey({ autoIncrement: true }),
	authorId: integer("authorId").notNull(),
	text: text("text").notNull(),
	pubDate: integer("pubDate"),
	flagged: integer("flagged"),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;
