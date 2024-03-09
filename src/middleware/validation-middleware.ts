import { zValidator } from "@hono/zod-validator"
import { ValidationTargets } from "hono"
import { throw400 } from "src/utility/api-util"
import z from "zod"
import { customHonoLogger } from "./logging-middleware"
import { validator } from "hono/validator"
import { getUserID } from "src/repositories/user-repository"
import { HTTPException } from "hono/http-exception"

export const reqValidator = (schema:z.ZodTypeAny,target:keyof ValidationTargets = "json") => {
    return zValidator(target,schema,(result,c) =>{
     if(!result.success){
         return c.json(throw400(result.error))
        }
    })
 }
 
export const userIdValidator =  validator("param", async (value,c) =>{
    const username = value["username"]
    const userId = await getUserID(username)
    if (!userId){
        throw new HTTPException(404,{message:"Username not found"})
    }
    return {userId}
})