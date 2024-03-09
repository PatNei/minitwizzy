import z from "zod";

export const msgRequestSchema = z.object({
	content: z.string({ required_error: "Content can't be empty" }),
});

export type msgDTO = z.infer<typeof msgRequestSchema>;
