import { createClient } from "@/lib/supabase/server"
import type { Profile } from "@/lib/types"

// Récupère le profil (table `profiles`) de l'utilisateur connecté.
// Retourne `null` si personne n'est connecté.
// Utilisé pour vérifier le rôle (admin/user) et l'identité dans les pages.
export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  return profile
}
