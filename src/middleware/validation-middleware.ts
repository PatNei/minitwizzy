import { zValidator } from "@hono/zod-validator"
import { ValidationTargets } from "hono"
import { throw400 } from "src/utility/api-util"
import z from "zod"
import { customHonoLogger } from "./logging-middleware"
import { validator } from "hono/validator"
import { getUserID } from "src/repositories/user-repository"
import { HTTPException } from "hono/http-exception"

/** Love my curry */
export const reqValidator = <T extends z.ZodTypeAny >(schema:T) => {
    return zValidator("json",schema,(result,c) => {
     if(!result.success){
         throw new HTTPException(400,{message:result.error.issues.pop()?.message})
        }
        return {...result.data} as z.TypeOf<T> // Typescript magic to get typeinference
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