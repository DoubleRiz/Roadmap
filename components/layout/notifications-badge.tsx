import { createClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"

// Affiche le nombre de notifications non lues de l'utilisateur connecté,
// sous forme de petit badge rouge à côté du lien "Notifications".
export async function NotificationsBadge() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { count } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .is("read_at", null)

  if (!count) {
    return null
  }

  return <Badge variant="destructive">{count}</Badge>
}
