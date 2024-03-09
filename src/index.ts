import { customHonoLogger } from "./middleware/logging-middleware";
import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";
import { Bindings } from "./util/authutil";
import { logger } from "hono/logger";
import { validator } from 'hono/validator'
import { getLatestTweet } from "./repositories/latest-tweet-repository";
import { registerRequestSchema } from "./types/request-types";
import { HTTPException } from 'hono/http-exception'

/** HONO APP */
const app = new Hono<{ Bindings: Bindings }>();
app.use(logger(customHonoLogger));
app.use(prettyJSON());
app.use("*", async (c,next) => {
    // TODO: When going live this should be commented out
    // if (!(c.req.header("Authorization") === "Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh")){
    if(false){
        let error = "You are not authorized to use this resource!"
        return c.json({"status":403, "error_msg": error},403)
    }
    await next()
})

/** ROUTES */
app.get("/", async (c) => {return c.json({"message":"niceness"},200)});
app.get("/latest", async (c) => {
    const latestTweet = await getLatestTweet()
    return c.json({"latest": latestTweet?.tweetId ?? -1},200)}
);
app.post("/register", validator('json',(value,c) =>{
    const parsed = registerRequestSchema.safeParse(value)

    if (!parsed.success){
       return c.json({"status":400,"error_msg":parsed.error.issues.pop()?.message},400)
    }
    return parsed.data

    
}) ,async (c) => {
    const {body} =c.req.valid('json')

    // TODO: Add Registration

    return c.json({"message":"niceness"},200)
});
app.get("/msgs", async (c) => {return c.json({"message":"niceness"},200)});
app.get("/msgs/:username", async (c) => {return c.json({"message":"niceness"},200)});
app.post("/msgs/:username", async (c) => {return c.json({"message":"niceness"},200)});
app.get("/fllws/:username", async (c) => {return c.json({"message":"niceness"},200)});
app.post("/fllws/:username", async (c) => {return c.json({"message":"niceness"},200)});

export default app;
