import { z } from "zod"

// Toutes les valeurs viennent d'un formulaire HTML, donc sous forme de texte.
export const sprintSchema = z
  .object({
    name: z
      .string()
      .min(1, "Le nom est requis")
      .max(200, "Le nom est trop long (200 caractères maximum)"),
    description: z
      .string()
      .max(2000, "La description est trop longue (2000 caractères maximum)"),
    // Dates au format YYYY-MM-DD.
    start_date: z.string().min(1, "La date de début est requise"),
    end_date: z.string().min(1, "La date de fin est requise"),
    status: z.enum(["planned", "active", "completed"]),
  })
  .refine((data) => data.end_date >= data.start_date, {
    message: "La date de fin doit être postérieure ou égale à la date de début",
    path: ["end_date"],
  })

export type SprintFormValues = z.infer<typeof sprintSchema>
