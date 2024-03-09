import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { reqValidator } from "src/middleware/validation-middleware";
import { createUser, getUserID } from "src/repositories/user-repository";
import { userRequestSchema } from "src/validation/user-req-validation";

const app = new Hono();

app.post("/", reqValidator(userRequestSchema), async (c) => {
	const { username, email, pwd } = c.req.valid("json");

	if (await getUserID({ username })) {
		return c.json(
			{ status: 400, error_msg: "The username is already taken" },
			400,
		);
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
});

export default app;
