import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import {
	reqValidatorJSON,
	reqValidatorQUERY,
	usernameToIdValidator,
} from "src/middleware/validation-middleware";
import {
	createMessage,
	getMessages,
	getMessagesByUserId,
} from "src/repositories/message-repository";
import {
	msgPostRequestSchema,
	parsedMsgGetRequestSchema,
} from "src/validation/msgReqValidationSchemas";

const app = new Hono()
	.get("/", reqValidatorQUERY(parsedMsgGetRequestSchema), async (c) => {
		const { parsedNo, parsedOffset } = c.req.valid("query");
		const messages = await getMessages(parsedNo, parsedOffset);
		return c.json(messages, 200);
	})
	.get(
		"/:username",
		usernameToIdValidator,
		reqValidatorQUERY(parsedMsgGetRequestSchema),
		async (c) => {
			const { userId } = c.req.valid("param");
			const { parsedNo, parsedOffset } = c.req.valid("query");
			const userMessages = await getMessagesByUserId(
				{ userId },
				parsedNo,
				parsedOffset,
			);
			return c.json(userMessages, userMessages.length === 0 ? 204 : 200);
		},
	)
	.post(
		"/:username",
		usernameToIdValidator,
		reqValidatorJSON(msgPostRequestSchema),
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
