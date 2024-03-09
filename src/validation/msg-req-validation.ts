import z from "zod";

export const msgPostSchema = z.object({
	content: z.string({ required_error: "Content can't be empty" }),
});



export type msgPostDTO = z.infer<typeof msgPostSchema>;
