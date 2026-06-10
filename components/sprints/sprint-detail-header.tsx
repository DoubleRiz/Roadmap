import Link from "next/link"
import { CalendarIcon, PenIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DeleteSprintDialog } from "@/components/sprints/delete-sprint-dialog"
import { SprintStatusBadge } from "@/components/sprints/sprint-status-badge"
import type { Sprint } from "@/lib/types"

// Formate une date ISO (YYYY-MM-DD) en format lisible "12 juin 2026".
function formatDate(value: string) {
  return new Date(value).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export function SprintDetailHeader({
  sprint,
  canManage,
}: {
  sprint: Sprint
  canManage: boolean
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-2xl font-semibold">{sprint.name}</h1>
        {canManage && (
          <div className="flex shrink-0 gap-2">
            <Button
              variant="outline"
              nativeButton={false}
              render={
                <Link href={`/sprints/${sprint.id}/edit`}>
                  <PenIcon className="size-4" />
                  Éditer
                </Link>
              }
            />
            <DeleteSprintDialog sprintId={sprint.id} />
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <SprintStatusBadge status={sprint.status} />
      </div>

      {sprint.description && (
        <p className="whitespace-pre-wrap text-sm text-muted-foreground">
          {sprint.description}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <CalendarIcon className="size-4" />
          <span>
            Du {formatDate(sprint.start_date)} au {formatDate(sprint.end_date)}
          </span>
        </div>
      </div>
    </div>
  )
}
