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
	if (res) return { userId: res.userId, username: res.username };
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
	).pop();
	if (!userId) {
		customHonoLogger("Drizzle:", "Could not create user!");
		return;
	}
	cacheUser({ ...userId, ...user });
	return userId;
};

const cacheUser = async (user: User) => {
	const res = await redisClient.set(user.username, JSON.stringify(user));
	if (!res) {
		customHonoLogger("redis:", `failed to cache ${user.username}`);
		return;
	}
	customHonoLogger("redis:", `cached username: ${user.username}`);
	return res;
};

const checkCacheForUser = async (username: string) => {
	const res = await redisClient.get(username);
	if (!res) {
		customHonoLogger("redis:", `cache miss for username:${username}`);
		return;
	}
	customHonoLogger("redis:", `cache hit for username: ${username}`);
	const user = JSON.parse(res) as User;
	return { userId: user.userId, username: user.username };
};
