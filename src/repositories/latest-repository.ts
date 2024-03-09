import { eq } from "drizzle-orm"
import { db } from "src/database/db"
import { latestAction } from "src/schemas/latest"

export const getLatestAction = async () => {
    return await db
        .select({actionId:latestAction.actionId})
        .from(latestAction)
        .all()
        .pop()?.actionId
}

export const updateLatestAction = async (newActionId:string | undefined) => {
    const parsedActionId = Number.parseInt(newActionId ? newActionId : "-1")
    return newActionId ? 
        await db
            .update(latestAction)
            .set({actionId: parsedActionId})
            .where(eq(latestAction.id,0))
            .returning({updatedActionId:latestAction.actionId})
        : parsedActionId
}

export const createLatestAction = async (newActionId:number) => {
    await db.insert(latestAction).values({id:0,actionId:newActionId}).onConflictDoNothing()
}
