import { NotificationItem } from "@/components/notifications/notification-item"
import type { NotificationWithFeature } from "@/lib/types"

export function NotificationList({
  notifications,
}: {
  notifications: NotificationWithFeature[]
}) {
  if (notifications.length === 0) {
    return <p className="text-sm text-muted-foreground">Aucune notification pour le moment.</p>
  }

  return (
    <div className="space-y-2">
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </div>
  )
}
