import { eq } from "drizzle-orm"
import { db } from "src/database/db"
import { latestTweet } from "src/schemas/latest"

export const getLatestTweet = async () => {
    return (await db.select({tweetId:latestTweet.tweetId}).from(latestTweet)).pop()
}

export const updateLatestTweet = async (newTweetId:number,newTimestamp:number) => {
    return await db.update(latestTweet).set({tweetId: newTweetId, timestamp:newTimestamp}).where(eq (latestTweet.id,1)).returning({updatedTweetId:latestTweet.tweetId,updatedTimestamp:latestTweet})
}