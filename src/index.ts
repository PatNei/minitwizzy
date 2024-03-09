import { customHonoLogger } from "./util/loggingutil";
import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";
import { Bindings } from "./util/authutil";
import { logger } from "hono/logger";

/** HONO APP */
const app = new Hono<{ Bindings: Bindings }>();
app.use(logger(customHonoLogger));
app.use(prettyJSON());

/** ROUTES */
app.get("/", async (c) => {});

export default app;
