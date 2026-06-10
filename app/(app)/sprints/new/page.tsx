import { redirect } from "next/navigation"

import { SprintForm } from "@/components/sprints/sprint-form"
import { getCurrentProfile } from "@/lib/auth"

export default async function NewSprintPage() {
  const profile = await getCurrentProfile()

  // Seul un admin peut créer un sprint (voir aussi la RLS sur `sprints`).
  if (profile?.role !== "admin") {
    redirect("/sprints")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Nouveau sprint</h1>
      <SprintForm mode="create" />
    </div>
  )
}
