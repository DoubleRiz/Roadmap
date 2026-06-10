import { MarkAllReadButton } from "@/components/notifications/mark-all-read-button"
import { NotificationList } from "@/components/notifications/notification-list"
import { createClient } from "@/lib/supabase/server"
import type { NotificationWithFeature } from "@/lib/types"

export default async function NotificationsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: notifications } = await supabase
    .from("notifications")
    .select("*, features(id, title)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const hasUnread = (notifications ?? []).some((notification) => notification.read_at === null)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Notifications</h1>
        {hasUnread && <MarkAllReadButton />}
      </div>
      <NotificationList
        notifications={(notifications ?? []) as unknown as NotificationWithFeature[]}
      />
    </div>
  )
}
