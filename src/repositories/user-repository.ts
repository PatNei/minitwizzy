import { password } from "bun"
import { eq } from "drizzle-orm"
import { db } from "src/database/db"
import { User, users } from "src/database/schemas/users"

export const getUserID = async (username:string) => {
    let userId = await (db.select({id: users.user_id})
    .from(users)
    .where(eq(users.username, username)))
    return userId.pop()?.id
}

export const createUser = async (user:User) => {
    return await db.insert(users)
        .values({
            username:user.username,
            pw_hash:await password.hash(user.pw_hash),
            email:user.email
        })
        .returning({
            user_id:users.user_id
        })
}