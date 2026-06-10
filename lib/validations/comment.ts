import { z } from "zod"

// Un commentaire ne peut pas être vide ni dépasser 2000 caractères.
export const commentSchema = z.object({
  content: z
    .string()
    .min(1, "Le commentaire ne peut pas être vide")
    .max(2000, "Le commentaire est trop long (2000 caractères maximum)"),
})

export type CommentInput = z.infer<typeof commentSchema>
