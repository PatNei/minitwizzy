import { and, desc, eq } from "drizzle-orm"
import { db } from "src/database/db"
import { Message, messages } from "src/database/schemas/messages"
import { users } from "src/database/schemas/users"

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

export const createMessage = async (message:Omit<Message,"message_id">) => {
    const messageDTO = await db.insert(messages)
    .values({
        author_id:message.author_id,
        text:message.text,
        pub_date:message.pub_date,
        flagged:0
    })
    .returning({messageId:messages.message_id})
    .onConflictDoNothing()
    return  messageDTO.pop()
}