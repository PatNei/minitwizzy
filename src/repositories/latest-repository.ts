import { desc } from "drizzle-orm";
import { redisClient } from "src";
import { db } from "src/database/db";
import { LatestAction, latestAction } from "src/database/schemas/latest";
import { customHonoLogger } from "src/middleware/logging-middleware";

export const getLatestAction = async () => {
	const cachedValue = await getCachedLatestId();
	if (cachedValue) return cachedValue;
	const actions = await db
		.select({ actionId: latestAction.actionId })
		.from(latestAction)
		.orderBy(desc(latestAction.actionId))
		.limit(1);
	const actionId = actions.pop()?.actionId;
	if (actionId) cacheLatestId({ actionId: actionId });
	return actionId ?? -1;
};

export const updateLatestAction = async ({
	actionId,
}: Pick<LatestAction, "actionId">) => {
	const createdActionId = await createLatestAction(actionId);
	return createdActionId;
};

export const createLatestAction = async (newActionId: number) => {
	const actions = await db
		.insert(latestAction)
		.values({ actionId: newActionId })
		.returning({ latestActionId: latestAction.actionId });
	const drizzleLatestId = actions.pop()?.latestActionId;
	if (!drizzleLatestId) {
		customHonoLogger("drizzle:", `failed to save latestId: ${newActionId}`);
		// We don't return as it doesn't matter that much that we can't save it to the db, we can hope that the cache will save us.
	}
	const cachedId = await cacheLatestId({ actionId: newActionId });
	return (drizzleLatestId || cachedId) ?? -1;
};

const cacheLatestId = async ({ actionId }: Pick<LatestAction, "actionId">) => {
	const res = await redisClient.set("latestId", actionId);

	if (!res) {
		customHonoLogger("redis:", `failed to cache ${actionId}`);
		return;
	}

	customHonoLogger("redis:", `cached latestId: ${actionId}`);
	return actionId;
};

const getCachedLatestId = async () => {
	redisClient.get("latestId");
	const res = await redisClient.get("latestId");

	if (!res) {
		customHonoLogger("redis:", "cache miss for latestId");
		return;
	}
	customHonoLogger("redis:", `cache hit for latestId: ${res}`);
	return Number.parseInt(res);
};
