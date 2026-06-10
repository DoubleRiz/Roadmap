import Link from "next/link"

import { Button } from "@/components/ui/button"
import { SprintCard } from "@/components/sprints/sprint-card"
import { getCurrentProfile } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import type { SprintWithFeatureCount } from "@/lib/types"

export default async function SprintsPage() {
  const supabase = await createClient()
  const profile = await getCurrentProfile()

  const { data: sprints } = await supabase
    .from("sprints")
    .select("*, features(count)")
    .order("start_date", { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Sprints</h1>
        {profile?.role === "admin" && (
          <Button
            nativeButton={false}
            render={<Link href="/sprints/new">Nouveau sprint</Link>}
          />
        )}
      </div>

      <div className="grid gap-3">
        {sprints && sprints.length > 0 ? (
          sprints.map((sprint) => (
            <SprintCard
              key={sprint.id}
              sprint={sprint as unknown as SprintWithFeatureCount}
            />
          ))
        ) : (
          <p className="text-muted-foreground">Aucun sprint pour le moment.</p>
        )}
      </div>
    </div>
  )
}
