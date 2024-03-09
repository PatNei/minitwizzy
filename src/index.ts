import { customHonoLogger } from "./middleware/logging-middleware";
import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";
import { Bindings } from "./util/authutil";
import { logger } from "hono/logger";
import { validator } from 'hono/validator'
import { getLatestTweet } from "./repositories/latest-tweet-repository";
import { registerSchema } from "./types/request-types";
import { HTTPException } from 'hono/http-exception'
import { createUser, getUserID } from "./repositories/user-repository";
import { Password, password } from "bun";
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
app.onError((err,c) => {
    console.error(err)
    if (err instanceof HTTPException){
        return err.getResponse()
        
    }
    return c.text("Something went wrong",500)
    
})


/** ROUTES */
app.get("/", async (c) => {return c.json({"message":"niceness"},200)});
app.get("/latest", async (c) => {
    const latestTweet = await getLatestTweet()
    return c.json({"latest": latestTweet?.tweetId ?? -1},200)}
);
app.post("/register", validator('json',(value,c) =>{
    const parsed = registerSchema.safeParse(value)

    if (!parsed.success){
       return c.json({"status":400,"error_msg":parsed.error.issues.pop()?.message},400)
    }
    return parsed.data

}), async (c) => {
    const {body} = c.req.valid('json')
    if (await getUserID(body.username)){
        return c.json({"status":400,"error_msg":"The username is already taken"},400)
    }
    let user_id = await createUser(body)
    
    if (!user_id){
        throw new HTTPException(500, { message: 'User not created. Something went wrong 😩'})
    }
    // TODO: Add Registration

    return c.json({},204)
});

app.get("/msgs", async (c) => {return c.json({"message":"niceness"},200)});
app.get("/msgs/:username", async (c) => {return c.json({"message":"niceness"},200)});
app.post("/msgs/:username", async (c) => {return c.json({"message":"niceness"},200)});
app.get("/fllws/:username", async (c) => {return c.json({"message":"niceness"},200)});
app.post("/fllws/:username", async (c) => {return c.json({"message":"niceness"},200)});

export default app;
