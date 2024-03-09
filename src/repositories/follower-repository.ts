import { and, eq } from "drizzle-orm"
import { db } from "src/database/db"
import { Follower, followers } from "src/database/schemas/followers"

export const followUserId = async ({whoId,whomId}:Follower) => {
    const success = await db
        .insert(followers)
        .values({whoId:whoId,whomId:whomId})
        .onConflictDoNothing()
        .returning({})
    return success.pop()
}

export const unfollowUserId = async ({whoId,whomId}:Follower) => {
    const success = await db
        .delete(followers)
        .where(
            and(
                eq(followers.whoId,whoId),
                eq(followers.whomId,whomId))
        )
        .returning({})
    return success.pop()
}