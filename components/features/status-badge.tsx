import { cn } from "@/lib/utils"
import type { FeatureStatus } from "@/lib/types"

// Libellés et couleurs associés à chaque statut de feature.
export const STATUS_LABELS: Record<FeatureStatus, string> = {
  to_do: "À faire",
  in_progress: "En cours",
  done: "Terminé",
}

const STATUS_CLASSES: Record<FeatureStatus, string> = {
  to_do: "bg-status-todo text-status-todo-foreground",
  in_progress: "bg-status-in-progress text-status-in-progress-foreground",
  done: "bg-status-done text-status-done-foreground",
}

export function StatusBadge({ status }: { status: string }) {
  const knownStatus = (status in STATUS_LABELS ? status : "to_do") as FeatureStatus

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        STATUS_CLASSES[knownStatus]
      )}
    >
      {STATUS_LABELS[knownStatus]}
    </span>
  )
}
