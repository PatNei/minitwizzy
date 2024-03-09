import { customHonoLogger } from "./middleware/logging-middleware";
import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";
import { Bindings } from "./util/authutil";
import { logger } from "hono/logger";
import { validator } from 'hono/validator'
import { getLatestAction, updateLatestAction } from "./repositories/latest-repository";
import { userDTOSchema, userDTO } from "./types/request-types";
import { HTTPException } from 'hono/http-exception'
import { createUser, getUserID } from "./repositories/user-repository";
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
    const latestAction = await getLatestAction()
    console.log(`What is the latest action: ${latestAction}`)
    return c.json({"latest": latestAction ?? -1},200)}
);
app.post("/register", validator('json',(value,c) =>{
    const parsed = userDTOSchema.safeParse(value)

    if (!parsed.success){
       return c.json({"status":400,"error_msg": parsed.error.issues.pop()?.message},400)
    }
    return parsed.data

}), async (c) => {
    const latestId = c.req.query("latest")
    if (await updateLatestAction(latestId) === -1){
        return c.json({"status":400,"error_msg":"Invalid latest query string param."},400)
    }
    const userDTO:userDTO = c.req.valid('json')

    if (await getUserID(userDTO.username)){
        return c.json({"status":400,"error_msg":"The username is already taken"},400)
    }
    let user_id = await createUser(userDTO)
    
    if (!user_id){
        throw new HTTPException(500, { message: 'User not created. Something went wrong 😩'})
    }

    return c.json({},204)
});

app.get("/msgs", async (c) => {return c.json({"message":"niceness"},200)});
app.get("/msgs/:username", async (c) => {return c.json({"message":"niceness"},200)});
app.post("/msgs/:username", async (c) => {return c.json({"message":"niceness"},200)});
app.get("/fllws/:username", async (c) => {return c.json({"message":"niceness"},200)});
app.post("/fllws/:username", async (c) => {return c.json({"message":"niceness"},200)});

export default app;
