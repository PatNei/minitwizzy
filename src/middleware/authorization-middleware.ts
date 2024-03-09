import { HonoRequest } from "hono";
import { HTTPException } from "hono/http-exception";
import {
	AUTHORIZATION_SIMULATOR,
	IS_DEVELOPMENT_MODE,
} from "src/constants/const";

export const headerAuthorizationMiddleware = (req: HonoRequest) => {
	// TODO: When going live this should be commented out
	// if (IS_DEVELOPMENT_MODE) return;
	const authHead = `${req.header("Authorization")}`;
	const reqHead = `Basic ${AUTHORIZATION_SIMULATOR}`;
	if (authHead !== reqHead) {
		// if (false) {
		const error = "You are not authorized to use this resource!";
		throw new HTTPException(403, { message: error });
	}
};
