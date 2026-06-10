import { notFound } from "next/navigation"

import { FeatureCard } from "@/components/features/feature-card"
import { SprintDetailHeader } from "@/components/sprints/sprint-detail-header"
import { getCurrentProfile } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import type { FeatureWithAssignee } from "@/lib/types"

export default async function SprintDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const sprintId = Number(id)
  const supabase = await createClient()
  const profile = await getCurrentProfile()

  const { data: sprint } = await supabase
    .from("sprints")
    .select("*")
    .eq("id", sprintId)
    .single()

  if (!sprint) {
    notFound()
  }

  const { data: features } = await supabase
    .from("features")
    .select("*, profiles(id, firstname, lastname, email, photo)")
    .eq("sprint_id", sprintId)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-8">
      <SprintDetailHeader sprint={sprint} canManage={profile?.role === "admin"} />

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Features de ce sprint</h2>
        <div className="grid gap-3">
          {features && features.length > 0 ? (
            features.map((feature) => (
              <FeatureCard
                key={feature.id}
                feature={feature as unknown as FeatureWithAssignee}
              />
            ))
          ) : (
            <p className="text-muted-foreground">
              Aucune feature n&apos;est associée à ce sprint.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
