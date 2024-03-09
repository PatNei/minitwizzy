import { z } from "zod";

export const userRequestSchema = z.object({
    username: z.string({required_error:"You have to enter a username"}),
    email: z.string().email("You have to enter a valid email address"),
    password: z.string({required_error:"You have to enter a password"})
})

export type userDTO = z.infer<typeof userRequestSchema>