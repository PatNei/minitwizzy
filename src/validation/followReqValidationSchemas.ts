import z from "zod";
const username = z.string();
const followSchema = z.object({ follow: z.string() });
export const unfollowSchema = z.object({ unfollow: z.string() });
export const changeFollowRequestSchema = followSchema.or(unfollowSchema);

export type unfollowDTO = z.infer<typeof unfollowSchema>;
export type followDTO = z.infer<typeof followSchema>;
export type changeFollowDTO = z.infer<typeof changeFollowRequestSchema>;
