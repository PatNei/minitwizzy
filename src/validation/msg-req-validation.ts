import z from "zod";

export const msgPostRequestSchema = z.object({
	content: z.string({ required_error: "Content can't be empty" }),
});

export const msgGetRequestSchema = z.object({
	no: z.number({ required_error: "No can't be empty" }).optional(),
	offset: z.number({ required_error: "No can't be empty" }).optional(),
});



export type msgPostDTO = z.infer<typeof msgPostRequestSchema>;
