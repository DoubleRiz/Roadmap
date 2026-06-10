import Link from "next/link"
import { MessageSquareIcon, UserPlusIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { MarkReadButton } from "@/components/notifications/mark-read-button"
import type { NotificationWithFeature } from "@/lib/types"

// Formate une date ISO en "12 juin 2026 à 14:30".
function formatDateTime(value: string) {
  return new Date(value).toLocaleString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Le trigger remplit `message`, mais on garde un texte de secours au cas où.
function getMessage(notification: NotificationWithFeature) {
  if (notification.message) return notification.message

  const title = notification.features?.title ?? "une feature"
  if (notification.type === "new_comment") {
    return `Nouveau commentaire sur la feature "${title}"`
  }
  return `Vous avez été assigné à la feature "${title}"`
}

export function NotificationItem({
  notification,
}: {
  notification: NotificationWithFeature
}) {
  const isUnread = notification.read_at === null
  const Icon = notification.type === "new_comment" ? MessageSquareIcon : UserPlusIcon

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border p-3",
        isUnread && "bg-accent/50"
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <div className="flex-1 space-y-1">
        <Link href={`/features/${notification.feature_id}`} className="text-sm hover:underline">
          {getMessage(notification)}
        </Link>
        <p className="text-xs text-muted-foreground">
          {formatDateTime(notification.created_at)}
        </p>
      </div>
      {isUnread && <MarkReadButton notificationId={notification.id} />}
    </div>
  )
}
