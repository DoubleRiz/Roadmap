import { notFound, redirect } from "next/navigation"

import { FeatureForm } from "@/components/features/feature-form"
import { getCurrentProfile } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"

export default async function EditFeaturePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const featureId = Number(id)
  const supabase = await createClient()
  const profile = await getCurrentProfile()

  const { data: feature } = await supabase
    .from("features")
    .select("*")
    .eq("id", featureId)
    .single()

  if (!feature) {
    notFound()
  }

  // Édition réservée à l'assigné ou à un admin (voir aussi la RLS sur `features`).
  const canManage = profile?.role === "admin" || feature.user_id === profile?.id
  if (!canManage) {
    redirect(`/features/${featureId}`)
  }

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, firstname, lastname, email, photo")
    .order("firstname")

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Éditer la feature</h1>
      <FeatureForm mode="edit" feature={feature} profiles={profiles ?? []} />
    </div>
  )
}
