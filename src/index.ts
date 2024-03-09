import { Hono } from "hono";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { customHonoLogger } from "./middleware/logging-middleware";
import { updateLatestActionMiddleware } from "./middleware/latest-middleware";
import { headerAuthorizationMiddleware } from "./middleware/authorization-middleware";
import { handleErrorHono } from "./utility/hono-util";
import followRoute from "./routes/api/follow-route";
import latestRoute from "./routes/api/latest-route";
import messageRoute from "./routes/api/message-route";
import registerRoute from "./routes/api/register-route";
import indexPage from "./routes/frontend/index-page";

/** HONO APP */

const app = new Hono();
app.use(logger(customHonoLogger));
app.use(prettyJSON());
app.use("*", async (c, next) => {
	headerAuthorizationMiddleware(c.req);
	await next();
});
/** Update Latest Id Middleware */
app.use("*", async (c, next) => {
	await updateLatestActionMiddleware(c.req);
	await next();
});
app.onError(async (err, c) => {
	return await handleErrorHono(err, c);
});

/** ROUTES */
app.route("/api/fllws", followRoute);
app.route("/api/msgs", messageRoute);
app.route("/api/register", registerRoute);
app.route("/api/latest", latestRoute);
app.route("/", indexPage);

export default app;
