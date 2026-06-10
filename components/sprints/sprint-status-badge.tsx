import { cn } from "@/lib/utils"
import type { SprintStatus } from "@/lib/types"

// Libellés et couleurs associés à chaque statut de sprint.
export const SPRINT_STATUS_LABELS: Record<SprintStatus, string> = {
  planned: "À venir",
  active: "En cours",
  completed: "Terminé",
}

const SPRINT_STATUS_CLASSES: Record<SprintStatus, string> = {
  planned: "bg-status-todo text-status-todo-foreground",
  active: "bg-status-in-progress text-status-in-progress-foreground",
  completed: "bg-status-done text-status-done-foreground",
}

export function SprintStatusBadge({ status }: { status: string }) {
  const knownStatus = (status in SPRINT_STATUS_LABELS ? status : "planned") as SprintStatus

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        SPRINT_STATUS_CLASSES[knownStatus]
      )}
    >
      {SPRINT_STATUS_LABELS[knownStatus]}
    </span>
  )
}
