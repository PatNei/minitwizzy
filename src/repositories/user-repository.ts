import { password as pass } from "bun";
import { eq } from "drizzle-orm";
import { redisClient } from "src";
import { db } from "src/database/db";
import { User, users } from "src/database/schemas/users";
import { customHonoLogger } from "src/middleware/logging-middleware";

export type userDTO = Pick<User, "username" | "userId">;

export const getUserID = async ({ username }: Pick<User, "username">) => {
	const res = await checkCacheForUser(username);
	if (res) return res.userId;
	const user = (
		await db.select().from(users).where(eq(users.username, username))
	).pop();
	if (!user) return undefined;
	cacheUser(user);
	return user.userId;
};

export const getUser = async ({
	username,
}: Pick<User, "username">): Promise<userDTO | undefined> => {
	const res = await checkCacheForUser(username);
	if (res) return res;
	const user: User | undefined = (
		await db.select().from(users).where(eq(users.username, username))
	).pop();
	if (!user) return undefined;
	cacheUser(user);
	return { userId: user.userId, username: user.username };
};

export const createUser = async (user: Omit<User, "userId">) => {
	const passHash = await pass.hash(user.password);
	const userId = (
		await db
			.insert(users)
			.values({
				username: user.username,
				password: passHash,
				email: user.email,
			})
			.returning({
				userId: users.userId,
			})
			.onConflictDoNothing()
	).pop();
	if (!userId) {
		customHonoLogger("Drizzle:", "Could not create user!");
		return;
	}
	await cacheUser({ userId: userId.userId, ...user });
	return userId;
};

const cacheUser = async (user: User) => {
	const res = await redisClient.hset(user.username, user);
	const username = user.username.toString();
	customHonoLogger("CACHED USER ?", res.toString());
	if (!res) {
		customHonoLogger(
			"redis:",
			`failed to cache user with username ${username}`,
		);
		return;
	}
	customHonoLogger("redis:", `cached user with username: ${username}`);
	return res;
};

const checkCacheForUser = async (username: string) => {
	const res = await redisClient.hgetall(username);
	if (!res) {
		customHonoLogger("redis:", `cache miss for username:${username}`);
		return;
	}
	const user = res as {
		[P in keyof User]: string;
	};
	customHonoLogger("redis:", `cache hit for username: ${username}`);
	return { userId: Number.parseInt(user.userId), username: user.username };
};
