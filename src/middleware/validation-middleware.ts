import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import { validator } from "hono/validator";
import { getUserID } from "src/repositories/user-repository";
import z from "zod";

/** Love my curry */
export const reqValidator = <T extends z.ZodTypeAny>(schema: T) => {
	return zValidator("json", schema, (result, c) => {
		if (!result.success) {
			throw new HTTPException(400, {
				message: `Zod Validation Error: ${result.error.message} ${result.error.errors} `,
			});
		}
		const data = result.data;
		return { data } as z.TypeOf<T>; // Typescript magic to get typeinference
	});
};

export const userIdValidator = validator("param", async (value, c) => {
	const username = value.username;
	if (!username)
		throw new HTTPException(500, {
			message: "Validator: Could not parse parameter for the username",
		});
	const userId = await getUserID({ username });
	if (!userId) {
		throw new HTTPException(404, { message: "Username not found" });
	}
	return { userId };
});
