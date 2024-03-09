import { Context, HonoRequest } from "hono";
import { HTTPException } from "hono/http-exception";
import { updateLatestAction } from "src/repositories/latest-repository";

export const updateLatestActionMiddleware = async (req: HonoRequest) => {
	const latestId = req.query("latest");
	if (
		latestId &&
		(await updateLatestAction({ actionId: Number.parseInt(latestId) })) === -1
	) {
		throw new HTTPException(400, {
			message: "Invalid latest query string param.",
		});
	}
};
