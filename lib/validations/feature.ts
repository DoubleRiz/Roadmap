import { z } from "zod"

// Toutes les valeurs viennent d'un formulaire HTML, donc sous forme de texte.
// La conversion vers les types attendus par Supabase (nombre, null...) se
// fait dans lib/actions/features.ts.
export const featureSchema = z.object({
  title: z
    .string()
    .min(1, "Le titre est requis")
    .max(200, "Le titre est trop long (200 caractères maximum)"),
  description: z
    .string()
    .max(5000, "La description est trop longue (5000 caractères maximum)"),
  status: z.enum(["to_do", "in_progress", "done"]),
  priority: z.enum(["low", "medium", "high"]),
  // "" si aucune échéance, sinon une date au format YYYY-MM-DD.
  due_date: z.string(),
  // "" si aucune difficulté, sinon une note de 1 à 5 (étoiles) sous forme de texte.
  difficulty: z
    .string()
    .refine(
      (value) => value === "" || /^[1-5]$/.test(value),
      "La difficulté doit être comprise entre 1 et 5"
    ),
  // "unassigned" ou l'id (uuid) du profil assigné.
  user_id: z.string(),
})

export type FeatureFormValues = z.infer<typeof featureSchema>
