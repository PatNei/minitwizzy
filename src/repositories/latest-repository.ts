import { desc, eq } from "drizzle-orm";
import { db } from "src/database/db";
import { LatestAction, latestAction } from "src/database/schemas/latest";
import { customHonoLogger } from "src/middleware/logging-middleware";

export const getLatestAction = async () => {
	const actions = await db
		.select({ actionId: latestAction.actionId })
		.from(latestAction)
		.orderBy(desc(latestAction.actionId))
		.limit(1);
	const actionId = actions.pop()?.actionId;
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
		.returning({ latestActionId: latestAction.actionId })
		.onConflictDoNothing();
	const drizzleLatestId = actions.pop()?.latestActionId;
	if (!drizzleLatestId) {
		customHonoLogger("drizzle:", `failed to save latestId: ${newActionId}`);
		// We don't return as it doesn't matter that much that we can't save it to the db, we can hope that the cache will save us.
	}
	return drizzleLatestId ?? -1;
};
