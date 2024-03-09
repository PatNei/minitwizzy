import { and, eq } from "drizzle-orm";
import { db } from "src/database/db";
import { Follower, followers } from "src/database/schemas/followers";
import { User, users } from "src/database/schemas/users";
import { customHonoLogger } from "src/middleware/logging-middleware";

export const followUserId = async ({ whoId, whomId }: Follower) => {
	const success = await db
		.insert(followers)
		.values({ whoId: whoId, whomId: whomId })
		.returning({ user: followers.whoId, followed: followers.whomId });
	return success.pop();
};

export const unfollowUserId = async ({ whoId, whomId }: Follower) => {
	const success = await db
		.delete(followers)
		.where(and(eq(followers.whoId, whoId), eq(followers.whomId, whomId)))
		.returning({ user: followers.whoId, unfollowed: followers.whomId });
	return success.pop();
};

export const doesUserFollowById = async ({ whoId, whomId }: Follower) => {
	const follower = await db
		.select({
			userId:followers.whoId,
			followerId: followers.whomId
		})
		.from(followers)
		.where(and(eq(followers.whoId, whoId), eq(followers.whomId, whomId)))
	return follower.pop()
}

export const getFollowersByUserId = async (
	{ userId }: Pick<User, "userId">,
	amount = 100,
) => {
	const listOfFollowers = await db
		.select({
			username: users.username,
		})
		.from(followers)
		.leftJoin(users, eq(followers.whomId, users.userId))
		.where(eq(followers.whoId, userId))
		.limit(amount);
	return listOfFollowers;
};
