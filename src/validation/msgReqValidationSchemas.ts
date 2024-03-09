import z from "zod";

export const msgPostRequestSchema = z.object({
	content: z.string({ required_error: "Content can't be empty" }),
});

export const msgGetRequestSchema = z.object({
	no: z.string({ required_error: "No can't be empty" }).optional(),
	offset: z.string({ required_error: "No can't be empty" }).optional(),
});

export const parsedMsgGetRequestSchema = msgGetRequestSchema.transform(
	({ no, offset }, ctx) => {
		const parsedNo = no ? Number.parseInt(no) : undefined;
		const parsedOffset = offset ? Number.parseInt(offset) : undefined;
		return { parsedNo, parsedOffset };
	},
);

export type msgPostDTO = z.infer<typeof msgPostRequestSchema>;
