import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import {
	reqValidator,
	userIdValidator,
} from "src/middleware/validation-middleware";
import {
	createMessage,
	getMessages,
	getMessagesByUserId,
} from "src/repositories/message-repository";
import { msgPostSchema } from "src/validation/msg-req-validation";

const app = new Hono()
	.get("/", async (c) => {
		const messageAmount = c.req.query("no");
		const messages = await getMessages(
			messageAmount ? Number.parseInt(messageAmount) : undefined,
		);
		return c.json(messages, 200);
	})
	.get("/:username", userIdValidator, async (c) => {
		const { userId } = c.req.valid("param");
		const userMessages = await getMessagesByUserId({ userId });

		return userMessages.length !== 0
			? c.json(userMessages, 200)
			: c.json({}, 204);
	})
	.post(
		"/:username",
		userIdValidator,
		reqValidator(msgPostSchema),
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
