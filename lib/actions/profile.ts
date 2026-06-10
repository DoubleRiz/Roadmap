"use server"

import { revalidatePath } from "next/cache"

import { getCurrentProfile } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { profileSchema, type ProfileFormValues } from "@/lib/validations/profile"

// Édition du profil de l'utilisateur connecté. La RLS n'autorise que
// `auth.uid() = id`, et `role` ne peut pas être modifié depuis ici.
export async function updateProfileAction(
  values: ProfileFormValues
): Promise<{ error?: string }> {
  const parsed = profileSchema.safeParse(values)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" }
  }

  const profile = await getCurrentProfile()
  if (!profile) {
    return { error: "Vous devez être connecté" }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from("profiles")
    .update({
      firstname: parsed.data.firstname || null,
      lastname: parsed.data.lastname || null,
      photo: parsed.data.photo || null,
    })
    .eq("id", profile.id)

  if (error) {
    return { error: "Impossible de modifier le profil : " + error.message }
  }

  revalidatePath("/profile")
  revalidatePath("/", "layout")
  return {}
}
