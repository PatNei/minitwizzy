import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const messages = sqliteTable("message", {
  message_id: integer("message_id").primaryKey({ autoIncrement: true }),
  author_id: integer("author_id").notNull(),
  text: text("text").notNull(),
  pub_date: integer("pub_date"),
  flagged: integer("flagged"),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;
export const insertMessageSchema = createInsertSchema(messages);
export const selectMessageSchema = createSelectSchema(messages);
