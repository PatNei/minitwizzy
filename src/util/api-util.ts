import { Context } from "hono";
import { updateLatestAction } from "src/repositories/latest-repository";
import { SafeParseError } from "zod";

export const parseLatestAction = async (c:Context) => {
    const latestId = c.req.query("latest")
    if (!latestId) return undefined
    if (await updateLatestAction(latestId) === -1){
        return c.json({"status":400,"error_msg":"Invalid latest query string param."},400)
    }
    return undefined
}

    
export const throw400 = <T>(c:Context,parsed: SafeParseError<T>) => {
    return c.json({"status":400,"error_msg": parsed.error.issues.pop()?.message},400)

}