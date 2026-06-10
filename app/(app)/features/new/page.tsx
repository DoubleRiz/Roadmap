import { redirect } from "next/navigation"

import { FeatureForm } from "@/components/features/feature-form"
import { getCurrentProfile } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"

export default async function NewFeaturePage() {
  const profile = await getCurrentProfile()

  // Seul un admin peut créer une feature (voir aussi la RLS sur `features`).
  if (profile?.role !== "admin") {
    redirect("/")
  }

  const supabase = await createClient()
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, firstname, lastname, email, photo")
    .order("firstname")

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Nouvelle feature</h1>
      <FeatureForm mode="create" profiles={profiles ?? []} />
    </div>
  )
}
