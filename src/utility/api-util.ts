import { Context } from "hono";
import { customHonoLogger } from "src/middleware/logging-middleware";
import { updateLatestAction } from "src/repositories/latest-repository";
import { ZodError } from "zod";

export const parseLatestAction = async (c:Context) => {
    const latestId = c.req.query("latest")
    if (!latestId) return undefined
    if (await updateLatestAction(latestId) === -1){
        return c.json({"status":400,"error_msg":"Invalid latest query string param."},400)
    }
    return undefined
}

    
export const throw400 = <T>(error: ZodError<T>) => {
    const errorMessage = {"status":400,"error_msg": error.issues.pop()?.message}
    customHonoLogger(errorMessage.status.toString(),errorMessage.error_msg ?? "")
    return [errorMessage,400]

}