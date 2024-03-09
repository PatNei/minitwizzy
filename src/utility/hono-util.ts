import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { customHonoLogger } from "src/middleware/logging-middleware";

export const handleErrorHono = async (err: Error, c: Context) => {
	if (err instanceof HTTPException) {
		customHonoLogger(`HTTP Exception: ${err.status} ${err.message}`);
		return c.json({ status: err.status, error_msg: err.message });
	}
	customHonoLogger(err.message);
	return c.text("Something went wrong", 500);
};
