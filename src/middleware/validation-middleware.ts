import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import { getUserID } from "src/repositories/user-repository";
import { userGetRequestSchema } from "src/validation/userReqValidationSchemas";
import z from "zod";

/** Love my curry */
export const reqValidatorJSON = <T extends z.ZodTypeAny>(schema: T) => {
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

export const reqValidatorQUERY = <T extends z.ZodTypeAny>(schema: T) => {
	return zValidator("query", schema, (result, c) => {
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
	userGetRequestSchema.transform(async (username, ctx) => {
		const userId = await getUserID(username);
		if (!userId) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "User not found",
				fatal: true,
			});
			return z.NEVER;
		}
		return { userId };
	}),
	(result, c) => {
		if (!result.success)
			throw new HTTPException(404, { message: "User not found" });
	},
);
