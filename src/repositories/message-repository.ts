import { and, desc, eq } from "drizzle-orm";
import { redisClient } from "src";
import { db } from "src/database/db";
import { Message, messages } from "src/database/schemas/messages";
import { User, users } from "src/database/schemas/users";
import { customHonoLogger } from "src/middleware/logging-middleware";

export type messageDTO = Message & {
	username?: string | null;
};
type redisMessageDTO = {
	[P in keyof messageDTO]: string;
};
const GLOBAL_MESSAGE_STORE = "global_mess";

export const getGlobalMessages = async (no = 100, offset = 0) => {
	const cachedMessages = await checkCacheForGlobalMessages(no, offset);
	if (cachedMessages) return cachedMessages;
	const messageDTO: messageDTO[] = await db
		.select({
			messageId: messages.messageId,
			text: messages.text,
			flagged: messages.flagged,
			pubDate: messages.pubDate,
			authorId: messages.authorId,
		})
		.from(messages)
		.where(eq(messages.flagged, 0))
		.leftJoin(users, eq(messages.authorId, users.userId))
		.orderBy(desc(messages.pubDate))
		.limit(no)
		.offset(offset);
	if (messageDTO) await cacheMessages(messageDTO);
	return messageDTO;
};

export const getMessagesByUserId = async (
	{ userId }: Pick<User, "userId">,
	no = 32,
	offset = 0,
) => {
	const cachedMessages = await checkCacheForUserMessages(
		{ userId },
		no,
		offset,
	);
	if (cachedMessages) return cachedMessages;
	const messageDTO: messageDTO[] = await db
		.select({
			messageId: messages.messageId,
			text: messages.text,
			pubDate: messages.pubDate,
			flagged: messages.flagged,
			authorId: messages.authorId,
		})
		.from(messages)
		.leftJoin(users, eq(messages.authorId, users.userId))
		.where(and(eq(messages.flagged, 0), eq(users.userId, userId)))
		.orderBy(desc(messages.pubDate))
		.offset(offset)
		.limit(no);
	if (messageDTO) await cacheMessages(messageDTO);
	return messageDTO;
};

export const createMessage = async ({
	authorId,
	text,
}: Omit<Message, "messageId" | "pubDate" | "flagged">) => {
	const time = Date.now();
	const messageDTOs = await db
		.insert(messages)
		.values({
			authorId: authorId,
			text: text,
			pubDate: time,
			flagged: 0,
		})
		.returning({ messageId: messages.messageId })
		.onConflictDoNothing();
	const messageDTO = messageDTOs.pop();
	if (messageDTO)
		await cacheMessage({
			authorId,
			messageId: messageDTO?.messageId,
			pubDate: time,
			text,
			username: null,
			flagged: 0,
		});
	return messageDTO;
};

const cacheMessages = async (mess: messageDTO[]) => {
	return mess.map(async (message) => {
		return await cacheMessage({
			authorId: message.authorId,
			messageId: message.messageId,
			flagged: message.flagged,
			pubDate: message.pubDate,
			text: message.text,
		});
	}); // side effects in a map 🤮
};
const cacheMessage = async ({
	authorId,
	messageId,
	pubDate,
	text,
	flagged,
}: messageDTO): Promise<{ messageId: number } | undefined> => {
	const messIdString = messageId.toString();
	const authIdString = authorId.toString();
	const message: messageDTO = {
		messageId: messageId,
		authorId: authorId,

		text: text,
		pubDate: pubDate,
		flagged: flagged,
	};
	const messRes = await redisClient.hset(messIdString, message);
	const userRes = messRes
		? await redisClient.lpush(authIdString, messageId)
		: undefined;
	const globalRes =
		messRes && userRes
			? await redisClient.lpush(GLOBAL_MESSAGE_STORE, messageId)
			: undefined;

	if (!messRes || !userRes || userRes < 1 || !globalRes || globalRes < 1) {
		if (globalRes && globalRes > 0)
			await redisClient.lpop(GLOBAL_MESSAGE_STORE); // utterly redundant
		if (userRes && userRes > 0) await redisClient.lpop(authIdString);
		if (messRes) await redisClient.del(messIdString);
		customHonoLogger(
			"redis:",
			`failed to cache message: AuthorId: ${authorId} MessageId: ${messageId} Text: ${text} MessRess: ${messRes} UserRes: ${userRes}`,
		);
		return;
	}
	// customHonoLogger(
	// 	"redis:",
	// 	`cached message: AuthorId: ${authorId} MessageId: ${messageId} Text: ${text} MessRess: ${messRes} UserRes: ${userRes}`,
	// );
	customHonoLogger("redis:", `cached message: MessageId: ${messageId}`);
	return { messageId };
};

const checkCacheForUserMessages = async (
	{ userId }: Pick<User, "userId">,
	no = 32,
	offset = 0,
) => {
	const userIdString = userId.toString();
	const res = await redisClient.lrange(
		userIdString,
		offset * no,
		no * offset + offset,
	);
	if (!res || res.length !== no) {
		customHonoLogger("redis:", `cache miss for user messages :${userIdString}`);
		return;
	}
	customHonoLogger("redis:", `cache hit for user messages: ${userIdString}`);
	const messages = fromRedisMessageDTOToMessageDTO(res);
	if (!messages || messages.length !== no) {
		customHonoLogger("redis:", `cache miss for user messages :${userIdString}`);
		return;
	}

	return messages;
};

const checkCacheForGlobalMessages = async (no = 32, offset = 0) => {
	const res = await redisClient.lrange(
		GLOBAL_MESSAGE_STORE,
		offset * no,
		no * offset + offset,
	);
	if (!res || res.length !== no) {
		customHonoLogger("redis:", "cache miss for global messages");
		return;
	}
	const messages = fromRedisMessageDTOToMessageDTO(res);
	if (!messages || messages.length !== no) {
		customHonoLogger("redis:", "cache miss for global messages");
		return;
	}
	customHonoLogger("redis:", "cache hit for user global messages");
	return messages;
};

const fromRedisMessageDTOToMessageDTO = (messageIdList: string[]) => {
	const messages = messageIdList.map(async (val) => {
		const message = (await redisClient.hgetall(val)) as redisMessageDTO;
		const _messageDTO: messageDTO = {
			messageId: Number.parseInt(message.messageId),
			authorId: Number.parseInt(message.authorId),
			pubDate: Number.parseInt(message.pubDate),
			flagged: Number.parseInt(message.flagged),
			text: message.text,
			username: message.username,
		};
		return _messageDTO;
	});
	return messages;
};
