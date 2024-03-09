import { customHonoLogger } from "./middleware/logging-middleware";
import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";
import { Bindings } from "./utility/auth-util";
import { logger } from "hono/logger";
import { getLatestAction } from "./repositories/latest-repository";
import { HTTPException } from 'hono/http-exception'
import { createUser, getUserID } from "./repositories/user-repository";
import { parseLatestAction } from "./utility/api-util";
import { createMessage, getMessages, getMessagesByUserId } from "./repositories/message-repository";
import { reqValidator, userIdValidator } from "./middleware/validation-middleware";
import { userRequestSchema } from "./validation/userReqValidation";
import { msgRequestSchema } from "./validation/msgReqValidation";
import { changeFollowRequestSchema } from "./validation/followReqValidation";
import { followUserId, unfollowUserId } from "./repositories/follower-repository";
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
        return c.json({...response})

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
app.post("/register", reqValidator(userRequestSchema), async (c) => {
    const {username,password,email} = c.req.valid("json")

    if (await getUserID(username)){
        return c.json({"status":400,"error_msg":"The username is already taken"},400)
    }
    let userId = await createUser({username:username,password:password,email:email})
    
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
app.get("/msgs/:username", userIdValidator,async (c) => {
    const {userId} = c.req.valid("param")
    const userMessages = await getMessagesByUserId(userId)

    return userMessages.length !== 0 ? c.json(userMessages ,200) : c.json({},204)
});
app.post("/msgs/:username", userIdValidator,reqValidator(msgRequestSchema), async (c) => {
    const {userId} = c.req.valid("param")
    const {content} = c.req.valid("json")
    const messageId = await createMessage({text:content,authorId:userId})

    if (!messageId){
        throw new HTTPException(500,{message:"Something went wrong"})
    }

    return c.json("",204)

});
app.post("/fllws/:username", userIdValidator,reqValidator(changeFollowRequestSchema),async (c) => {
    const {userId} = c.req.valid("param")
    const folReq = c.req.valid("json")
    const isFollowAction = 'follow' in folReq
    const username = isFollowAction ? folReq.follow : folReq.unfollow // Bad names both gives usernames.

    const whomId = await getUserID(username)
    if (!whomId) throw new HTTPException(404,{message:`Can't ${isFollowAction ? "follow" : "unfollow"} user as the user does not exist`})

    if (isFollowAction)
    {
        followUserId({whoId:userId,whomId:whomId})
        return c.json("",204)
    }

    if (!isFollowAction){
        unfollowUserId({whoId:userId,whomId:whomId})
        return c.json("",204)

    }

    throw new HTTPException(500,{message:`Something wen't wrong when trying to ${isFollowAction ? "follow" : "unfollow"} user`})
});
app.get("/fllws/:username", async (c) => {return c.json({"message":"niceness"},200)});

export default app;
