import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import { usernameToIdSchema } from "src/validation/user-req-validation";
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

export const usernameToIdValidator = zValidator(
	"param",
	usernameToIdSchema,
	(result, c) => {
		if (!result.success)
			throw new HTTPException(404, { message: result.error.message });
	},
);
