import { and, desc, eq } from "drizzle-orm";
import { db } from "src/database/db";
import { Message, messages } from "src/database/schemas/messages";
import { User, users } from "src/database/schemas/users";

export const getMessages = async (amount = 100) => {
	return await db
		.select({
			content: messages.text,
			pubDate: messages.pubDate,
			user: users.username,
		})
		.from(messages)
		.where(eq(messages.flagged, 0))
		.leftJoin(users, eq(messages.authorId, users.userId))
		.orderBy(desc(messages.pubDate))
		.limit(amount);
};

export const getMessagesByUserId = async (
	{ userId }: Pick<User, "userId">,
	amount = 100,
) => {
	return await db
		.select({
			content: messages.text,
			pubDate: messages.pubDate,
			user: users.username,
		})
		.from(messages)
		.leftJoin(users, eq(messages.authorId, users.userId))
		.where(and(eq(messages.flagged, 0), eq(users.userId, userId)))
		.orderBy(desc(messages.pubDate))
		.limit(amount);
};

export const createMessage = async ({
	authorId,
	text,
}: Omit<Message, "messageId" | "pubDate" | "flagged">) => {
	const messageDTO = await db
		.insert(messages)
		.values({
			authorId: authorId,
			text: text,
			pubDate: Date.UTC(Date.now()),
			flagged: 0,
		})
		.returning({ messageId: messages.messageId })
		.onConflictDoNothing();
	return messageDTO.pop();
};
