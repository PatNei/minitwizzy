import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { reqValidatorJSON } from "src/middleware/validation-middleware";
import { createUser, getUserID } from "src/repositories/user-repository";
import { userPostRequestSchema } from "src/validation/userReqValidationSchemas";

const app = new Hono().post(
	"/",
	reqValidatorJSON(userPostRequestSchema),
	async (c) => {
		const { username, email, pwd } = c.req.valid("json");

		if (await getUserID({ username })) {
			throw new HTTPException(400, {
				message: "The username is already taken",
			});
		}
		const userId = await createUser({
			username: username,
			password: pwd,
			email: email,
		});

		if (!userId) {
			throw new HTTPException(500, {
				message: "User not created. Something went wrong 😩",
			});
		}

		return c.json({}, 204);
	},
);

export default app;
