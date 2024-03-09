import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { followers } from "src/database/schemas/followers";
import { latestAction } from "src/database/schemas/latest";
import { messages } from "src/database/schemas/messages";
import { users } from "src/database/schemas/users";

export const insertFollowerSchema = createInsertSchema(followers);
export const selectFollowerSchema = createSelectSchema(followers);
export const insertLatestActionSchema = createInsertSchema(latestAction);
export const selectLatestActionSchema = createSelectSchema(latestAction);
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertMessageSchema = createInsertSchema(messages);
export const selectMessageSchema = createSelectSchema(messages);
