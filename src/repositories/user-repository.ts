import { password } from "bun"
import { eq } from "drizzle-orm"
import { db } from "src/database/db"
import { users } from "src/schemas/users"
import { userDTO } from "src/types/request-types"
export const getUserID = async (username:string) => {
    return (await db.select({id: users.user_id}).from(users).where(eq(users.username, username))).pop()
}

export const createUser = async (user:userDTO) => {
    return await db.insert(users)
        .values({
            username:user.username,
            pw_hash:await password.hash(user.pwd),
            email:user.email
        })
        .returning({
            user_id:users.user_id
        })
}