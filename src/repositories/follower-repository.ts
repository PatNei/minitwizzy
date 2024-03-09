import { and, eq } from "drizzle-orm"
import { db } from "src/database/db"
import { Follower, followers } from "src/database/schemas/followers"

export const followUserId = async ({who_id,whom_id}:Follower) => {
    const success = await db
        .insert(followers)
        .values({who_id:who_id,whom_id:whom_id})
        .onConflictDoNothing()
        .returning({})
    return success.pop()
}

export const unfollowUserId = async ({who_id,whom_id}:Follower) => {
    const success = await db
        .delete(followers)
        .where(
            and(
                eq(followers.who_id,who_id),
                eq(followers.whom_id,whom_id))
        )
        .returning({})
    return success.pop()
}