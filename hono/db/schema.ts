import { sqliteTable, text, integer  } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const user = sqliteTable('user',{
    user_id: integer('user_id').primaryKey({autoIncrement:true}),
    username: text('username').notNull(),
    email: text('email').notNull(),
    pw_hash: text('pw_hash').notNull()
})

export const follower = sqliteTable('follower',{
    who_id: integer('who_id'),
    whom_id: integer('whom_id')
    
})

export const message = sqliteTable('message',{
    message_id: integer('message_id').primaryKey({autoIncrement:true}),
    author_id: integer('author_id').notNull(),
    text: text("text").notNull(),
    pub_date: integer("pub_date"),
    flagged: integer('flagged')
})

export type User = typeof user.$inferSelect
export type InsertUser = typeof user.$inferInsert
export const insertUserSchema = createInsertSchema(user);
export const selectUserSchema = createSelectSchema(user);

export type Follower = typeof follower.$inferSelect
export type InsertFollower = typeof follower.$inferInsert
export const insertFollowerSchema = createInsertSchema(follower);
export const selectFollowerSchema = createSelectSchema(follower);

export type Message = typeof message.$inferSelect
export type InsertMessage = typeof message.$inferInsert
export const insertMessageSchema = createInsertSchema(message);
export const selectMessageSchema = createSelectSchema(message);