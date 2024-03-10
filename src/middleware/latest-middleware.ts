import { HonoRequest } from "hono";
import { HTTPException } from "hono/http-exception";
import { updateLatestAction } from "src/repositories/latest-repository";
import { customHonoLogger } from "./logging-middleware";

export const updateLatestActionMiddleware = async (req: HonoRequest) => {
	const latestId = req.query("latest");
	if (!latestId) return;
	if (
		(await updateLatestAction({ actionId: Number.parseInt(latestId) })) === -1
	) {
		customHonoLogger("Latest Id:", "Invalid query string param.");
		throw new HTTPException(400, {
			message: "Invalid latest query string param.",
		});
	}
	customHonoLogger("Latest Id:", latestId);
};
