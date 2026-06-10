import Link from "next/link"

import { Button } from "@/components/ui/button"
import { FeatureFilters } from "@/components/features/feature-filters"
import { FeatureCard } from "@/components/features/feature-card"
import { getCurrentProfile } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import type { FeatureWithAssignee } from "@/lib/types"

// Les filtres sont passés dans l'URL, ex: /?status=to_do&priority=high
type FeaturesSearchParams = {
  status?: string
  priority?: string
  assignee?: string
  due?: string
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<FeaturesSearchParams>
}) {
  const params = await searchParams
  const supabase = await createClient()
  const profile = await getCurrentProfile()

  // On construit la requête en ajoutant les filtres demandés un par un.
  let query = supabase
    .from("features")
    .select("*, profiles(id, firstname, lastname, email, photo)")
    .order("created_at", { ascending: false })

  if (params.status) {
    query = query.eq("status", params.status)
  }
  if (params.priority) {
    query = query.eq("priority", params.priority)
  }
  if (params.assignee === "unassigned") {
    query = query.is("user_id", null)
  } else if (params.assignee) {
    query = query.eq("user_id", params.assignee)
  }
  if (params.due) {
    query = query.lte("due_date", params.due)
  }

  const { data: features } = await query

  // Liste des profils pour le filtre "assigné".
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, firstname, lastname, email, photo")
    .order("firstname")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Features</h1>
        {profile?.role === "admin" && (
          <Button render={<Link href="/features/new">Nouvelle feature</Link>} />
        )}
      </div>

      <FeatureFilters profiles={profiles ?? []} />

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
            Aucune feature ne correspond à ces filtres.
          </p>
        )}
      </div>
    </div>
  )
}
