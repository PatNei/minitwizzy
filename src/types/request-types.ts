import { z } from "zod";



export const registerRequestSchema = z.object({
    body: z.object({
        username: z.string({required_error:"You have to enter a username"}),
        email: z.string().email("You have to enter a valid email address"),
        pwd: z.string({required_error:"You have to enter a password"})
    }),
  })
