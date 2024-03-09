import { and, desc, eq } from "drizzle-orm"
import { db } from "src/database/db"
import { messages } from "src/schemas/messages"
import { users } from "src/schemas/users"

export const getMessages = async (amount = 100) =>{
    return await db.select({
            content:messages.text,
            pub_date:messages.pub_date,
            user:users.username
        })
        .from(messages)
        .where(eq(messages.flagged,0))
        .leftJoin(users,eq(messages.author_id,users.user_id))
        .orderBy(desc(messages.pub_date))
        .limit(amount)
}

export const getMessagesByUserId = async (userId:number,amount=100) => {
    return await db.select({
        content:messages.text,
        pub_date:messages.pub_date,
        user:users.username
    })
    .from(messages)
    .leftJoin(users,eq(messages.author_id,users.user_id))
    .where(and(eq(messages.flagged,0),eq(users.user_id,userId)))
    .orderBy(desc(messages.pub_date))
    .limit(amount)

}

export const createMessage = async (userId:number,text:string,pub_date:number) => {
    return await db.insert(messages)
        .values({
            author_id:userId,
            text:text,
            pub_date:pub_date
        })
        .returning({messageId:messages.message_id})
        .onConflictDoNothing()
}