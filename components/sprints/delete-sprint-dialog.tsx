// Composant client : AlertDialog est interactif (ouverture/fermeture) et on
// utilise useTransition pour afficher un état de chargement pendant la suppression.
"use client"

import { useTransition } from "react"
import { TrashIcon } from "lucide-react"

import { deleteSprintAction } from "@/lib/actions/sprints"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

export function DeleteSprintDialog({ sprintId }: { sprintId: number }) {
  const [isPending, startTransition] = useTransition()

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button variant="destructive">
            <TrashIcon className="size-4" />
            Supprimer
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer ce sprint ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est définitive. Les features associées ne seront pas
            supprimées, mais ne seront plus rattachées à ce sprint.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={() => startTransition(() => deleteSprintAction(sprintId))}
          >
            {isPending ? "Suppression..." : "Supprimer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
