import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const users = sqliteTable("user", {
  user_id: integer("user_id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull(),
  email: text("email").notNull(),
  pw_hash: text("pw_hash").notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
