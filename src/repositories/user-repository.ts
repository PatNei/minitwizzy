import { password as pass } from "bun";
import { eq } from "drizzle-orm";
import { db } from "src/database/db";
import { User, users } from "src/database/schemas/users";

export type userDTO = Pick<User, "username" | "userId">;

export const getUserID = async ({ username }: Pick<User, "username">) => {
	const userId = await db
		.select({ id: users.userId })
		.from(users)
		.where(eq(users.username, username));
	return userId.pop()?.id;
};

export const getUser = async ({ username }: Pick<User, "username">) => {
	const user: userDTO[] = await db
		.select({
			userId: users.userId,
			username: users.username,
		})
		.from(users)
		.where(eq(users.username, username));
	return user.pop();
};

export const createUser = async ({
	username,
	password,
	email,
}: Omit<User, "userId">) => {
	return await db
		.insert(users)
		.values({
			username: username,
			password: await pass.hash(password),
			email: email,
		})
		.returning({
			user_id: users.userId,
		});
};
