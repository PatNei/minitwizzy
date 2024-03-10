import { and, eq } from "drizzle-orm";
import { redisClient } from "src";
import { db } from "src/database/db";
import { Follower, followers } from "src/database/schemas/followers";
import { User, users } from "src/database/schemas/users";
import { customHonoLogger } from "src/middleware/logging-middleware";
const REDIS_FOLLOWER_SET = "follow";

export const followUserId = async ({
	whoId,
	whomId,
}: Follower): Promise<Follower | undefined> => {
	const success = await db
		.insert(followers)
		.values({ whoId: whoId, whomId: whomId })
		.returning({ whoId: followers.whoId, whomId: followers.whomId });
	if (success) cacheFollow({ whoId, whomId });
	return success.pop();
};

export const unfollowUserId = async ({
	whoId,
	whomId,
}: Follower): Promise<Follower | undefined> => {
	const success = await db
		.delete(followers)
		.where(and(eq(followers.whoId, whoId), eq(followers.whomId, whomId)))
		.returning({ whoId: followers.whoId, whomId: followers.whomId });
	if (success) cacheUnfollow({ whoId, whomId });

	return success.pop();
};

export const doesUserFollowUserId = async ({
	whoId,
	whomId,
}: Follower): Promise<Follower | undefined> => {
	const redisRes = checkCacheIfUserFollowsUserId({ whoId, whomId });
	if (redisRes) return redisRes;
	const _followers = await db
		.select({
			whoId: followers.whoId,
			whomId: followers.whomId,
		})
		.from(followers)
		.where(and(eq(followers.whoId, whoId), eq(followers.whomId, whomId)));
	const follower = _followers.pop();
	if (follower) cacheFollow(follower);
	return follower;
};

export const getFollowerUsernamesForUserId = async (
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

const cacheFollow = async ({ whoId, whomId }: Follower) => {
	const res = await redisClient.sadd(`${REDIS_FOLLOWER_SET}-${whoId}`, whomId);
	if (res < 1) {
		customHonoLogger(
			"redis:",
			`failed to cache follow: Who: ${whoId} -> Whom: ${whomId}`,
		);
		return;
	}
	return { whoId, whomId };
};
const cacheUnfollow = async ({ whoId, whomId }: Follower) => {
	const res = await redisClient.srem(`${REDIS_FOLLOWER_SET}-${whoId}`, whomId);

	if (res < 1) {
		customHonoLogger(
			"redis:",
			`failed to cache follow: Who: ${whoId} -> Whom: ${whomId}`,
		);
		return;
	}
	return { whoId, whomId };
};

const checkCacheIfUserFollowsUserId = async ({
	whoId,
	whomId,
}: Follower): Promise<Follower | undefined> => {
	const res = await redisClient.sismember(
		`${REDIS_FOLLOWER_SET}-${whoId}`,
		whomId,
	);
	return res > 0 ? { whoId, whomId } : undefined;
};

const checkCacheForFollowerUsernames = async (
	// Need to do this by changing the user-repository 🥱
	{ userId }: Pick<User, "userId">,
	amount = 100,
) => {
	const res = await redisClient.sscan(
		`${REDIS_FOLLOWER_SET}-${userId}`,
		amount,
	);
	const usernames = res[1].map((value) => {});
};
