import { Hono } from "hono";
import { getLatestAction } from "src/repositories/latest-repository";

const app = new Hono();

app.get("/", async (c) => {
	const latestAction = await getLatestAction();
	return c.json({ latest: latestAction ?? -1 }, 200);
});

export default app;
