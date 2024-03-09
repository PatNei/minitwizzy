import z from "zod"


export const msgDTO = z.object({
    content: z.string({required_error:"Content can't be empty"})
})

export type msgDTO = z.infer<typeof msgDTO>