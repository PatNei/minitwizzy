import { z } from "zod";

export const userDTO = z.object({
    username: z.string({required_error:"You have to enter a username"}),
    email: z.string().email("You have to enter a valid email address"),
    pwd: z.string({required_error:"You have to enter a password"})
})

export type userDTO = z.infer<typeof userDTO>

export const msgDTO = z.object({
    username:z.string({required_error:"You have to enter a username"}),
    content: z.string({required_error:"Content can't be empty"})
})

export type msgDTO = z.infer<typeof msgDTO>