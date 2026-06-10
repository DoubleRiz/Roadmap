"use server"

import { revalidatePath } from "next/cache"

import { createClient } from "@/lib/supabase/server"

// Marque une notification comme lue. La RLS n'autorise que le destinataire
// (`user_id = auth.uid()`) à modifier sa propre notification.
export async function markNotificationReadAction(notificationId: number) {
  const supabase = await createClient()
  await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("id", notificationId)

  revalidatePath("/notifications")
  revalidatePath("/")
}

// Marque toutes les notifications non lues de l'utilisateur connecté comme lues.
export async function markAllNotificationsReadAction() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return
  }

  await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("user_id", user.id)
    .is("read_at", null)

  revalidatePath("/notifications")
  revalidatePath("/")
}
