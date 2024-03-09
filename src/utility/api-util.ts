import { customHonoLogger } from "src/middleware/logging-middleware";
import { ZodError } from "zod";

export const throw400 = <T>(error: ZodError<T>) => {
	const errorMessage = { status: 400, error_msg: error.issues.pop()?.message };
	customHonoLogger(
		errorMessage.status.toString(),
		errorMessage.error_msg ?? "",
	);
	return [errorMessage, 400];
};
