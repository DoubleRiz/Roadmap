// Composant client : useTransition permet d'afficher un état de chargement
// pendant l'appel à la Server Action, sans bloquer le reste de la page.
"use client"

import { useTransition } from "react"

import { markNotificationReadAction } from "@/lib/actions/notifications"
import { Button } from "@/components/ui/button"

export function MarkReadButton({ notificationId }: { notificationId: number }) {
  const [isPending, startTransition] = useTransition()

  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={isPending}
      onClick={() => startTransition(() => markNotificationReadAction(notificationId))}
    >
      {isPending ? "..." : "Marquer comme lue"}
    </Button>
  )
}
