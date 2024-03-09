import { eq } from "drizzle-orm";
import { db } from "src/database/db";
import { LatestAction, latestAction } from "src/database/schemas/latest";

export const getLatestAction = async () => {
	return await db
		.select({ actionId: latestAction.actionId })
		.from(latestAction)
		.all()
		.pop()?.actionId;
};

export const updateLatestAction = async ({
	actionId,
}: Pick<LatestAction, "actionId">) => {
	return actionId
		? await db
				.update(latestAction)
				.set({ actionId: actionId })
				.where(eq(latestAction.id, 0))
				.returning({ updatedActionId: latestAction.actionId })
		: -1;
};

export const createLatestAction = async (newActionId: number) => {
	await db
		.insert(latestAction)
		.values({ id: 0, actionId: newActionId })
		.onConflictDoNothing();
};
