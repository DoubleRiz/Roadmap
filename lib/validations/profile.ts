import { z } from "zod"

export const profileSchema = z.object({
  firstname: z
    .string()
    .max(100, "Le prénom est trop long (100 caractères maximum)"),
  lastname: z
    .string()
    .max(100, "Le nom est trop long (100 caractères maximum)"),
  photo: z
    .string()
    .max(2000, "L'URL de la photo est trop longue (2000 caractères maximum)")
    .refine(
      (value) => value === "" || z.url().safeParse(value).success,
      "L'URL de la photo n'est pas valide"
    ),
})

export type ProfileFormValues = z.infer<typeof profileSchema>
