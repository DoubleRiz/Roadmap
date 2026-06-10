// Composant client : useTransition pour afficher un état de chargement
// pendant que toutes les notifications sont marquées comme lues.
"use client"

import { useTransition } from "react"

import { markAllNotificationsReadAction } from "@/lib/actions/notifications"
import { Button } from "@/components/ui/button"

export function MarkAllReadButton() {
  const [isPending, startTransition] = useTransition()

  return (
    <Button
      variant="outline"
      disabled={isPending}
      onClick={() => startTransition(() => markAllNotificationsReadAction())}
    >
      {isPending ? "..." : "Tout marquer comme lu"}
    </Button>
  )
}
