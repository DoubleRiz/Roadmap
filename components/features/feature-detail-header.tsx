import Link from "next/link"
import { CalendarIcon, GaugeIcon, PenIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DeleteFeatureDialog } from "@/components/features/delete-feature-dialog"
import { StatusBadge } from "@/components/features/status-badge"
import { PriorityBadge } from "@/components/features/priority-badge"
import type { FeatureWithAssignee } from "@/lib/types"

// Formate une date ISO (YYYY-MM-DD) en format lisible "12 juin 2026".
function formatDate(value: string) {
  return new Date(value).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function getInitials(profile: FeatureWithAssignee["profiles"]) {
  if (!profile) return "?"
  const fromName = [profile.firstname, profile.lastname]
    .filter(Boolean)
    .map((part) => part![0])
    .join("")
  if (fromName) return fromName.toUpperCase()
  return profile.email[0]?.toUpperCase() ?? "?"
}

function getDisplayName(profile: FeatureWithAssignee["profiles"]) {
  if (!profile) return "Non assigné"
  return [profile.firstname, profile.lastname].filter(Boolean).join(" ") || profile.email
}

export function FeatureDetailHeader({
  feature,
  canManage,
}: {
  feature: FeatureWithAssignee
  canManage: boolean
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-2xl font-semibold">{feature.title}</h1>
        {canManage && (
          <div className="flex shrink-0 gap-2">
            <Button
              variant="outline"
              nativeButton={false}
              render={
                <Link href={`/features/${feature.id}/edit`}>
                  <PenIcon className="size-4" />
                  Éditer
                </Link>
              }
            />
            <DeleteFeatureDialog featureId={feature.id} />
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <StatusBadge status={feature.status} />
        <PriorityBadge priority={feature.priority} />
      </div>

      {feature.description && (
        <p className="whitespace-pre-wrap text-sm text-muted-foreground">
          {feature.description}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Avatar size="sm">
            <AvatarFallback>{getInitials(feature.profiles)}</AvatarFallback>
          </Avatar>
          <span>{getDisplayName(feature.profiles)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CalendarIcon className="size-4" />
          <span>
            {feature.due_date ? formatDate(feature.due_date) : "Sans échéance"}
          </span>
        </div>
        {feature.difficulty !== null && (
          <div className="flex items-center gap-1.5">
            <GaugeIcon className="size-4" />
            <span>Difficulté : {feature.difficulty}</span>
          </div>
        )}
        <span>Créée le {formatDate(feature.created_at)}</span>
      </div>
    </div>
  )
}
