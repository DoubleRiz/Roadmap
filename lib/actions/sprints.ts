"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

import { getCurrentProfile } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { sprintSchema, type SprintFormValues } from "@/lib/validations/sprint"

// Convertit les valeurs (en texte) du formulaire vers les colonnes de la table `sprints`.
function toSprintRow(values: SprintFormValues) {
  return {
    name: values.name,
    description: values.description || null,
    start_date: values.start_date,
    end_date: values.end_date,
    status: values.status,
  }
}

// Création réservée aux admins (vérifié ici en plus de la RLS, par sécurité).
export async function createSprintAction(
  values: SprintFormValues
): Promise<{ error?: string }> {
  const parsed = sprintSchema.safeParse(values)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" }
  }

  const profile = await getCurrentProfile()
  if (profile?.role !== "admin") {
    return { error: "Seul un administrateur peut créer un sprint" }
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("sprints")
    .insert(toSprintRow(parsed.data))
    .select("id")
    .single()

  if (error || !data) {
    return { error: "Impossible de créer le sprint : " + (error?.message ?? "") }
  }

  revalidatePath("/sprints")
  redirect(`/sprints/${data.id}`)
}

// Édition réservée aux admins (vérifié ici en plus de la RLS, par sécurité).
// On ne touche jamais à `updated_at` (géré par le trigger `set_updated_at`).
export async function updateSprintAction(
  sprintId: number,
  values: SprintFormValues
): Promise<{ error?: string }> {
  const parsed = sprintSchema.safeParse(values)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" }
  }

  const profile = await getCurrentProfile()
  if (profile?.role !== "admin") {
    return { error: "Seul un administrateur peut modifier un sprint" }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from("sprints")
    .update(toSprintRow(parsed.data))
    .eq("id", sprintId)

  if (error) {
    return { error: "Impossible de modifier le sprint : " + error.message }
  }

  revalidatePath("/sprints")
  revalidatePath(`/sprints/${sprintId}`)
  redirect(`/sprints/${sprintId}`)
}

// Suppression réservée aux admins (vérifié ici en plus de la RLS, par sécurité).
// Les features associées ne sont pas supprimées : leur `sprint_id` repasse à NULL.
export async function deleteSprintAction(sprintId: number) {
  const profile = await getCurrentProfile()
  if (profile?.role !== "admin") {
    return
  }

  const supabase = await createClient()
  await supabase.from("sprints").delete().eq("id", sprintId)

  revalidatePath("/sprints")
  redirect("/sprints")
}
