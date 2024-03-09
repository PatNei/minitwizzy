import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import {
	reqValidator,
	userIdValidator,
} from "src/middleware/validation-middleware";
import {
	doesUserFollowById,
	followUserId,
	getFollowersByUserId,
	unfollowUserId,
} from "src/repositories/follower-repository";
import { getUserID } from "src/repositories/user-repository";
import { changeFollowRequestSchema } from "src/validation/follow-req-validation";

const app = new Hono();

app.post(
	"/:username",
	userIdValidator,
	reqValidator(changeFollowRequestSchema),
	async (c) => {
		const { userId } = c.req.valid("param");
		const folReq = c.req.valid("json");
		const isFollowAction = "follow" in folReq;
		const username = isFollowAction ? folReq.follow : folReq.unfollow; // Bad names both gives usernames.

		const whomId = await getUserID({ username });

		if (!whomId)
			throw new HTTPException(404, {
				message: `Can't ${
					isFollowAction ? "follow" : "unfollow"
				} user as the user does not exist`,
			});

		const userIsAFollower = await doesUserFollowById({
			whoId: userId,
			whomId: whomId,
		});
		if (isFollowAction && !userIsAFollower) {
			const success = await followUserId({ whoId: userId, whomId: whomId });

			if (success) return c.json({}, 204);
		}

		if (!isFollowAction && userIsAFollower) {
			const success = await unfollowUserId({ whoId: userId, whomId: whomId });
			if (success) return c.json({}, 204);
		}

		throw new HTTPException(500, {
			message: `Something went wrong when trying to ${
				isFollowAction ? "follow" : "unfollow"
			} user`,
		});
	},
);
app.get("/:username", userIdValidator, async (c) => {
	const { userId } = c.req.valid("param");
	const messageAmount = c.req.query("no");
	const followers = await getFollowersByUserId(
		{ userId },
		messageAmount ? Number.parseInt(messageAmount) : undefined,
	);
	return c.json({ follows: followers }, 200);
});
export default app;
