"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { loginSchema, signupSchema } from "@/lib/validations/auth"

// Connexion : tente de connecter l'utilisateur avec email + mot de passe.
// En cas d'erreur, on retourne un message lisible au lieu de lever une exception
// (le formulaire affiche ce message sans recharger toute la page).
export async function loginAction(
  values: { email: string; password: string }
): Promise<{ error: string } | void> {
  const parsed = loginSchema.safeParse(values)
  if (!parsed.success) {
    return { error: "Formulaire invalide" }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword(parsed.data)

  if (error) {
    return { error: "Email ou mot de passe incorrect" }
  }

  redirect("/")
}

// Inscription : crée le compte Supabase Auth. Le trigger `handle_new_user`
// (en base) crée automatiquement la ligne correspondante dans `profiles`,
// on n'a donc rien d'autre à faire ici.
export async function signupAction(
  values: { email: string; password: string; confirmPassword: string }
): Promise<{ error?: string; message?: string } | void> {
  const parsed = signupSchema.safeParse(values)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" }
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error) {
    return { error: "Impossible de créer le compte : " + error.message }
  }

  // Si la confirmation par email est activée sur le projet Supabase,
  // aucune session n'est créée tant que le lien reçu par email n'a pas
  // été cliqué : on informe l'utilisateur au lieu de le rediriger.
  if (!data.session) {
    return {
      message:
        "Compte créé ! Vérifiez votre boîte mail pour confirmer votre adresse avant de vous connecter.",
    }
  }

  redirect("/")
}

// Déconnexion : ferme la session puis renvoie vers /login.
export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}
