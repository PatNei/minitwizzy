import { Hono } from "hono";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { customHonoLogger } from "./middleware/logging-middleware";
import { updateLatestActionMiddleware } from "./middleware/latest-middleware";
import { headerAuthorizationMiddleware } from "./middleware/authorization-middleware";
import { apihandleErrorHono } from "./utility/hono-util";
import followRoute from "./routes/api/follow-route";
import latestRoute from "./routes/api/latest-route";
import messageRoute from "./routes/api/message-route";
import registerRoute from "./routes/api/register-route";
import indexPage from "./routes/frontend/index-page";
import { Redis } from "ioredis";
import { PORT_NUMBER } from "./constants/const";
import { REDIS_CONNECTION_STRING } from "./constants/paths";
export const redisClient = new Redis(REDIS_CONNECTION_STRING);
/** HONO APP */
const app = new Hono()
	.use(logger(customHonoLogger))
	.use(prettyJSON())
	.use("/api/*", async (c, next) => {
		headerAuthorizationMiddleware(c.req);
		await next();
	})
	/** Update Latest Id Middleware */
	.use("/api/*", async (c, next) => {
		if (c.req.path !== "/api/latest") await updateLatestActionMiddleware(c.req);
		await next();
	})
	.onError(async (err, c) => {
		return await apihandleErrorHono(err, c);
	});

/** ROUTES */
const routes = app
	.route("/api/fllws", followRoute)
	.route("/api/msgs", messageRoute)
	.route("/api/register", registerRoute)
	.route("/api/latest", latestRoute)
	.route("/", indexPage);

export type RPCType = typeof routes;
export default {
	port: PORT_NUMBER,
	fetch: app.fetch,
};
