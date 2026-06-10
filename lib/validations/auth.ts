import { z } from "zod"

// Schéma de validation pour le formulaire de connexion.
export const loginSchema = z.object({
  email: z.email("Adresse email invalide"),
  password: z.string().min(1, "Le mot de passe est requis"),
})

export type LoginInput = z.infer<typeof loginSchema>

// Schéma de validation pour le formulaire d'inscription.
export const signupSchema = z
  .object({
    email: z.email("Adresse email invalide"),
    password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  })

export type SignupInput = z.infer<typeof signupSchema>
