import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "@/lib/supabase/database.types"

// Client Supabase pour le serveur : Server Components, Server Actions et
// Route Handlers. Il lit/écrit les cookies pour suivre la session de
// l'utilisateur connecté. Ne jamais l'utiliser dans un composant "use client".
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options)
            }
          } catch {
            // setAll est appelé depuis un Server Component : on peut ignorer
            // l'erreur si le middleware rafraîchit déjà la session.
          }
        },
      },
    }
  )
}
