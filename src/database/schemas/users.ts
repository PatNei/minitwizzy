import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("user", {
	userId: integer("userId").primaryKey({ autoIncrement: true }),
	username: text("username").notNull(),
	email: text("email").notNull(),
	password: text("password").notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
