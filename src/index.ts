import { customHonoLogger } from "./middleware/logging-middleware";
import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";
import { Bindings } from "./util/auth-util";
import { logger } from "hono/logger";
import { validator } from 'hono/validator'
import { getLatestAction } from "./repositories/latest-repository";
import { userDTOSchema, userDTO } from "./types/request-types";
import { HTTPException } from 'hono/http-exception'
import { createUser, getUserID } from "./repositories/user-repository";
import { parseLatestAction, throw400 } from "./util/api-util";
import { getMessages } from "./repositories/message-repository";
/** HONO APP */
const app = new Hono<{ Bindings: Bindings }>();
app.use(logger(customHonoLogger));
app.use(prettyJSON());
app.use("*", async (c,next) => {
    // TODO: When going live this should be commented out
    // if (!(c.req.header("Authorization") === `Basic ${AUTHORIZATION_SIMULATOR}`)){
    if(false){
        let error = "You are not authorized to use this resource!"
        return c.json({"status":403, "error_msg": error},403)
    }
    await next()
})
/** Update Latest Id Middleware */
app.use("*", async (c,next) => {
    const actionParseError = await parseLatestAction(c)
    if (actionParseError) return actionParseError
    await next()
})
app.onError((err,c) => {
    customHonoLogger(err.message)
    if (err instanceof HTTPException){
        return err.getResponse()
    }
    return c.text("Something went wrong",500)
    
})


/** ROUTES */
app.get("/", async (c) => {return c.json({"message":"niceness"},200)});
app.get("/latest", async (c) => {
    const latestAction = await getLatestAction()
    return c.json({"latest": latestAction ?? -1},200)}
);
app.post("/register", validator('json',(value,c) =>{

    return userDTOSchema.safeParse(value)
    
}), async (c) => {

    // TODO: Figure out how to abstract this boiler plate away, maybe by using try catch with http exceptions.

    const parsed = c.req.valid("json")
    if (!parsed.success) return throw400(c,parsed)
    const userDTO:userDTO = parsed.data

    if (await getUserID(userDTO.username)){
        return c.json({"status":400,"error_msg":"The username is already taken"},400)
    }
    let user_id = await createUser(userDTO)
    
    if (!user_id){
        throw new HTTPException(500, { message: 'User not created. Something went wrong 😩'})
    }

    return c.json({},204)
});

app.get("/msgs", async (c) => {
   const messageAmount = c.req.query("no")
   const messages = getMessages(messageAmount ? Number.parseInt(messageAmount) : undefined)
    return c.json({"message":"niceness"},200)
});
app.get("/msgs/:username", async (c) => {return c.json({"message":"niceness"},200)});
app.post("/msgs/:username", async (c) => {return c.json({"message":"niceness"},200)});
app.get("/fllws/:username", async (c) => {return c.json({"message":"niceness"},200)});
app.post("/fllws/:username", async (c) => {return c.json({"message":"niceness"},200)});

export default app;
