import { zValidator } from "@hono/zod-validator"
import { ValidationTargets } from "hono"
import { throw400 } from "src/util/api-util"
import z from "zod"

export const reqValidator = (schema:z.ZodTypeAny,target:keyof ValidationTargets = "json") => {
    return zValidator(target,schema,(result,c) =>{
     if(!result.success){
        console.log(result.data)
         return c.json(throw400(result.error))
     }
    })
 }
 