import { customHonoLogger } from "./middleware/logging-middleware";
import { Env, Hono, ValidationTargets } from "hono";
import { prettyJSON } from "hono/pretty-json";
import { Bindings } from "./util/auth-util";
import { logger } from "hono/logger";
import { validator } from 'hono/validator'
import { getLatestAction } from "./repositories/latest-repository";
import { msgDTO, userDTO } from "./types/request-types";
import { HTTPException } from 'hono/http-exception'
import { createUser, getUserID } from "./repositories/user-repository";
import { parseLatestAction } from "./util/api-util";
import { getMessages, getMessagesByUserId } from "./repositories/message-repository";
import { reqValidator } from "./middleware/validation-middleware";
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
app.onError(async (err,c) => {
    if (err instanceof HTTPException){
        const response = await err.getResponse()
        customHonoLogger(await response.json())
        return response

    }
    customHonoLogger(err.message)
    return c.text("Something went wrong",500)
    
})



/** ROUTES */
app.get("/", async (c) => {return c.json({"message":"niceness"},200)});
app.get("/latest", async (c) => {
    const latestAction = await getLatestAction()
    return c.json({"latest": latestAction ?? -1},200)}
);
app.post("/register", reqValidator(userDTO), async (c) => {
    const userDTO = c.req.valid("json")

    if (await getUserID(userDTO.username)){
        return c.json({"status":400,"error_msg":"The username is already taken"},400)
    }
    let userId = await createUser(userDTO)
    
    if (!userId){
        throw new HTTPException(500, { message: 'User not created. Something went wrong 😩'})
    }

    return c.json({},204)
});

app.get("/msgs", async (c) => {
   const messageAmount = c.req.query("no")
   const messages = await getMessages(messageAmount ? Number.parseInt(messageAmount) : undefined)
    return c.json(messages,200)
});
app.get("/msgs/:username", async (c) => {
    const username = c.req.param("username")
    const userId = await getUserID(username)
    if (!userId){
        return c.notFound()
    }
    const userMessages = await getMessagesByUserId(userId)

    return userMessages.length !== 0 ? c.json(userMessages ,200) : c.json({},204)
});
app.post("/msgs/:username", reqValidator(msgDTO), async (c) => {
    

});
app.get("/fllws/:username", async (c) => {return c.json({"message":"niceness"},200)});
app.post("/fllws/:username", async (c) => {return c.json({"message":"niceness"},200)});

export default app;
