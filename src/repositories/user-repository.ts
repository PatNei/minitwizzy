import { eq } from "drizzle-orm"
import { db } from "src/database/db"
import { users } from "src/schemas/users"
export const getUserID = async (username:string) => {
    return (await db.select({id: users.user_id}).from(users).where(eq(users.username, username))).pop()
}