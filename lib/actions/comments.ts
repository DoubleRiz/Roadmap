"use server"

import { revalidatePath } from "next/cache"

import { createClient } from "@/lib/supabase/server"
import { commentSchema } from "@/lib/validations/comment"

// Ajoute un commentaire sur une feature. Le trigger `handle_new_comment_notification`
// (en base) crée automatiquement une notification pour le propriétaire de la feature.
export async function addCommentAction(
  featureId: number,
  values: { content: string }
): Promise<{ error?: string }> {
  const parsed = commentSchema.safeParse(values)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Vous devez être connecté pour commenter" }
  }

  const { error } = await supabase.from("comments").insert({
    feature_id: featureId,
    user_id: user.id,
    content: parsed.data.content,
  })

  if (error) {
    return { error: "Impossible d'ajouter le commentaire : " + error.message }
  }

  revalidatePath(`/features/${featureId}`)
  return {}
}

// Modifie le contenu d'un commentaire. La RLS n'autorise que l'auteur du
// commentaire à le modifier ; on ne touche jamais à `updated_at` (géré par trigger).
export async function updateCommentAction(
  commentId: number,
  featureId: number,
  values: { content: string }
): Promise<{ error?: string }> {
  const parsed = commentSchema.safeParse(values)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from("comments")
    .update({ content: parsed.data.content })
    .eq("id", commentId)

  if (error) {
    return { error: "Impossible de modifier le commentaire : " + error.message }
  }

  revalidatePath(`/features/${featureId}`)
  return {}
}
