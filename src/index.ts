import { customHonoLogger } from "./middleware/logging-middleware";
import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";
import { Bindings } from "./util/authutil";
import { logger } from "hono/logger";

/** HONO APP */
const app = new Hono<{ Bindings: Bindings }>();
app.use(logger(customHonoLogger));
app.use(prettyJSON());

/** ROUTES */
app.get("/", async (c) => {return c.json({"message":"niceness"},200)});
app.get("/latest", async (c) => {
    c.req
    return c.json({"message":"niceness"},200)}
);
app.post("/register", async (c) => {return c.json({"message":"niceness"},200)});
app.get("/msgs", async (c) => {return c.json({"message":"niceness"},200)});
app.get("/msgs/:username", async (c) => {return c.json({"message":"niceness"},200)});
app.post("/msgs/:username", async (c) => {return c.json({"message":"niceness"},200)});
app.get("/fllws/:username", async (c) => {return c.json({"message":"niceness"},200)});
app.post("/fllws/:username", async (c) => {return c.json({"message":"niceness"},200)});

export default app;
