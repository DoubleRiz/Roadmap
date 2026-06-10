import Link from "next/link"
import { CalendarIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/features/status-badge"
import { PriorityBadge } from "@/components/features/priority-badge"
import type { FeatureWithAssignee } from "@/lib/types"

// Formate une date ISO (YYYY-MM-DD) en format lisible "12 juin 2026".
function formatDueDate(dueDate: string) {
  return new Date(dueDate).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

// Construit les initiales d'un utilisateur à partir de son prénom/nom (ou email à défaut).
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

export function FeatureCard({ feature }: { feature: FeatureWithAssignee }) {
  return (
    <Link href={`/features/${feature.id}`}>
      <Card className="transition-colors hover:bg-accent/50">
        <CardHeader>
          <CardTitle>{feature.title}</CardTitle>
          <div className="flex flex-wrap gap-2 pt-1">
            <StatusBadge status={feature.status} />
            <PriorityBadge priority={feature.priority} />
            {feature.sprints && <Badge variant="outline">{feature.sprints.name}</Badge>}
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Avatar size="sm">
              <AvatarFallback>{getInitials(feature.profiles)}</AvatarFallback>
            </Avatar>
            <span>{getDisplayName(feature.profiles)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CalendarIcon className="size-4" />
            <span>
              {feature.due_date ? formatDueDate(feature.due_date) : "Sans échéance"}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
