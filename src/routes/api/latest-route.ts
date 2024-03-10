import { Hono } from "hono";
import { customHonoLogger } from "src/middleware/logging-middleware";
import { getLatestAction } from "src/repositories/latest-repository.js";

const app = new Hono().get("/", async (c) => {
	const latestAction = await getLatestAction();
	customHonoLogger("what we get back", `${latestAction}`);
	return c.json({ latest: latestAction}, 200);
});
export default app;
