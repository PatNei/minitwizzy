import { eq } from "drizzle-orm"
import { db } from "src/database/db"
import { latestAction } from "src/schemas/latest"

export const getLatestAction = async () => {
    return (await db.select({actionId:latestAction.actionId}).from(latestAction)).pop()
}

export const updateLatestAction = async (newActionId:number) => {
    return await db.update(latestAction).set({actionId: newActionId}).where(eq (latestAction.id,0)).returning({updatedActionId:latestAction.actionId})
}