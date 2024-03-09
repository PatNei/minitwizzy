import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { validator } from "hono/validator";
import {
	reqValidator,
	usernameToIdValidator,
} from "src/middleware/validation-middleware";
import {
	createMessage,
	getMessages,
	getMessagesByUserId,
} from "src/repositories/message-repository";
import {
	msgGetRequestSchema,
	msgPostRequestSchema,
} from "src/validation/msg-req-validation";

const app = new Hono()
	.get("/", reqValidator(msgGetRequestSchema), async (c) => {
		const { no, offset } = c.req.valid("json");
		const messages = await getMessages(no, offset);
		return c.json(messages, 200);
	})
	.get(
		"/:username",
		usernameToIdValidator,
		reqValidator(msgGetRequestSchema),
		async (c) => {
			const { userId } = c.req.valid("param");
			const { no, offset } = c.req.valid("json");
			const userMessages = await getMessagesByUserId({ userId }, no, offset);

			return userMessages.length !== 0
				? c.json(userMessages, 200)
				: c.json({}, 204);
		},
	)
	.post(
		"/:username",
		usernameToIdValidator,
		reqValidator(msgPostRequestSchema),
		async (c) => {
			const { userId } = c.req.valid("param");
			const { content } = c.req.valid("json");
			const messageId = await createMessage({
				text: content,
				authorId: userId,
			});

			if (!messageId) {
				throw new HTTPException(500, { message: "Something went wrong" });
			}

			return c.json({}, 204);
		},
	);
export default app;
