import z from "zod"
const username = z.string()
const followSchema = z.object({follow: username})
const unfollowSchema = z.object({unfollow: username})
export const changeFollowSchema = followSchema.or(unfollowSchema)


export type unfollowDTO = z.infer<typeof unfollowSchema>
export type followDTO = z.infer<typeof followSchema> 
export type changeFollowDTO = z.infer<typeof changeFollowSchema>