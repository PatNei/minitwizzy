import { z } from "zod";

const userDTO = z.object({
    username: z.string({required_error:"You have to enter a username"}),
    email: z.string().email("You have to enter a valid email address"),
    pwd: z.string({required_error:"You have to enter a password"})
})

export const registerSchema = z.object({
    body: userDTO,
  })

export type userDTO = z.infer<typeof userDTO>