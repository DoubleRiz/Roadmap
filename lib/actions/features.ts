"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

import { getCurrentProfile } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { featureSchema, type FeatureFormValues } from "@/lib/validations/feature"

// Convertit les valeurs (en texte) du formulaire vers les colonnes de la table `features`.
function toFeatureRow(values: FeatureFormValues) {
  return {
    title: values.title,
    description: values.description || null,
    status: values.status,
    priority: values.priority,
    due_date: values.due_date || null,
    difficulty: values.difficulty ? Number(values.difficulty) : null,
    user_id: values.user_id === "unassigned" ? null : values.user_id,
    sprint_id: values.sprint_id === "none" ? null : Number(values.sprint_id),
  }
}

// Création réservée aux admins (vérifié ici en plus de la RLS, par sécurité).
// Le trigger `handle_feature_assigned_notification` notifie l'assigné si `user_id` est défini.
export async function createFeatureAction(
  values: FeatureFormValues
): Promise<{ error?: string }> {
  const parsed = featureSchema.safeParse(values)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" }
  }

  const profile = await getCurrentProfile()
  if (profile?.role !== "admin") {
    return { error: "Seul un administrateur peut créer une feature" }
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("features")
    .insert(toFeatureRow(parsed.data))
    .select("id")
    .single()

  if (error || !data) {
    return { error: "Impossible de créer la feature : " + (error?.message ?? "") }
  }

  redirect(`/features/${data.id}`)
}

// Édition : la RLS autorise l'assigné ou un admin. On ne touche jamais à
// `updated_at` (géré par le trigger `set_updated_at`).
export async function updateFeatureAction(
  featureId: number,
  values: FeatureFormValues
): Promise<{ error?: string }> {
  const parsed = featureSchema.safeParse(values)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from("features")
    .update(toFeatureRow(parsed.data))
    .eq("id", featureId)

  if (error) {
    return { error: "Impossible de modifier la feature : " + error.message }
  }

  revalidatePath(`/features/${featureId}`)
  redirect(`/features/${featureId}`)
}

// Suppression : la RLS autorise l'assigné ou un admin.
export async function deleteFeatureAction(featureId: number) {
  const supabase = await createClient()
  await supabase.from("features").delete().eq("id", featureId)

  revalidatePath("/")
  redirect("/")
}
