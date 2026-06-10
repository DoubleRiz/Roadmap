import Link from "next/link"
import { CalendarIcon, ListChecksIcon } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SprintStatusBadge } from "@/components/sprints/sprint-status-badge"
import type { SprintWithFeatureCount } from "@/lib/types"

// Formate une date ISO (YYYY-MM-DD) en format lisible "12 juin 2026".
function formatDate(value: string) {
  return new Date(value).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export function SprintCard({ sprint }: { sprint: SprintWithFeatureCount }) {
  const featureCount = sprint.features[0]?.count ?? 0

  return (
    <Link href={`/sprints/${sprint.id}`}>
      <Card className="transition-colors hover:bg-accent/50">
        <CardHeader>
          <CardTitle>{sprint.name}</CardTitle>
          <div className="flex flex-wrap gap-2 pt-1">
            <SprintStatusBadge status={sprint.status} />
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <CalendarIcon className="size-4" />
            <span>
              {formatDate(sprint.start_date)} - {formatDate(sprint.end_date)}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <ListChecksIcon className="size-4" />
            <span>
              {featureCount} feature{featureCount > 1 ? "s" : ""}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
