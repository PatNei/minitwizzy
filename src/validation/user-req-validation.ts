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


export const usernameToIdSchema = userGetRequestSchema.transform(async (username, ctx) => {
	const userId = await getUserID(username);
	if (!userId) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: "User not found",
			fatal: true,
		});
		return z.NEVER;
	}
	return { userId };
})
export type userPostDTO = z.infer<typeof userPostRequestSchema>;
