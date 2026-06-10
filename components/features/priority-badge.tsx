import { cn } from "@/lib/utils"
import type { FeaturePriority } from "@/lib/types"

// Libellés et couleurs associés à chaque priorité de feature.
const PRIORITY_LABELS: Record<FeaturePriority, string> = {
  low: "Basse",
  medium: "Moyenne",
  high: "Haute",
}

const PRIORITY_CLASSES: Record<FeaturePriority, string> = {
  low: "bg-priority-low text-priority-low-foreground",
  medium: "bg-priority-medium text-priority-medium-foreground",
  high: "bg-priority-high text-priority-high-foreground",
}

export function PriorityBadge({ priority }: { priority: string }) {
  const knownPriority = (
    priority in PRIORITY_LABELS ? priority : "medium"
  ) as FeaturePriority

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        PRIORITY_CLASSES[knownPriority]
      )}
    >
      {PRIORITY_LABELS[knownPriority]}
    </span>
  )
}
