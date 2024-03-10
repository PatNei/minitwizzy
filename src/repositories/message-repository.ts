import { and, desc, eq } from "drizzle-orm";
import { db } from "src/database/db";
import { Message, messages } from "src/database/schemas/messages";
import { User, users } from "src/database/schemas/users";

export type messageDTO = Pick<Message, "messageId" | "text" | "pubDate"> & {
	username: string | null;
};

export const getMessages = async (no = 100, offset = 0) => {
	const messageDTO: messageDTO[] = await db
		.select({
			messageId: messages.messageId,
			text: messages.text,
			pubDate: messages.pubDate,
			username: users.username,
		})
		.from(messages)
		.where(eq(messages.flagged, 0))
		.leftJoin(users, eq(messages.authorId, users.userId))
		.orderBy(desc(messages.pubDate))
		.limit(no)
		.offset(offset);
	return messageDTO;
};

export const getMessagesByUserId = async (
	{ userId }: Pick<User, "userId">,
	no = 32,
	offset = 0,
) => {
	const messageDTO: messageDTO[] = await db
		.select({
			messageId: messages.messageId,
			text: messages.text,
			pubDate: messages.pubDate,
			username: users.username,
		})
		.from(messages)
		.leftJoin(users, eq(messages.authorId, users.userId))
		.where(and(eq(messages.flagged, 0), eq(users.userId, userId)))
		.orderBy(desc(messages.pubDate))
		.offset(offset)
		.limit(no);
	return messageDTO;
};

export const createMessage = async ({
	authorId,
	text,
}: Omit<Message, "messageId" | "pubDate" | "flagged">) => {
	const time = Date.now();
	const messageDTO = await db
		.insert(messages)
		.values({
			authorId: authorId,
			text: text,
			pubDate: time,
			flagged: 0,
		})
		.returning({ messageId: messages.messageId })
		.onConflictDoNothing();
	return messageDTO.pop();
};