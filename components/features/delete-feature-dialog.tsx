// Composant client : AlertDialog est interactif (ouverture/fermeture) et on
// utilise useTransition pour afficher un état de chargement pendant la suppression.
"use client"

import { useTransition } from "react"
import { TrashIcon } from "lucide-react"

import { deleteFeatureAction } from "@/lib/actions/features"
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

export function DeleteFeatureDialog({ featureId }: { featureId: number }) {
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
          <AlertDialogTitle>Supprimer cette feature ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est définitive et supprimera aussi ses commentaires.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={() => startTransition(() => deleteFeatureAction(featureId))}
          >
            {isPending ? "Suppression..." : "Supprimer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
