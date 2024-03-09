import { getUserID } from "src/repositories/user-repository";
import { z } from "zod";

export const userPostRequestSchema = z.object({
	username: z.string({ required_error: "You have to enter a username" }),
	email: z.string().email("You have to enter a valid email address"),
	pwd: z.string({ required_error: "You have to enter a password" }),
});

export const userGetRequestSchema = z.object({
	username: z.string({ required_error: "You have to enter a username" }),
});

export type userPostDTO = z.infer<typeof userPostRequestSchema>;
