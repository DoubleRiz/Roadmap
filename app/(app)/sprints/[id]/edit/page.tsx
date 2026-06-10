import { notFound, redirect } from "next/navigation"

import { SprintForm } from "@/components/sprints/sprint-form"
import { getCurrentProfile } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"

export default async function EditSprintPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const sprintId = Number(id)
  const profile = await getCurrentProfile()

  // Édition réservée aux admins (voir aussi la RLS sur `sprints`).
  if (profile?.role !== "admin") {
    redirect(`/sprints/${sprintId}`)
  }

  const supabase = await createClient()
  const { data: sprint } = await supabase
    .from("sprints")
    .select("*")
    .eq("id", sprintId)
    .single()

  if (!sprint) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Éditer le sprint</h1>
      <SprintForm mode="edit" sprint={sprint} />
    </div>
  )
}
