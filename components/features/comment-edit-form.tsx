// Composant client : on a besoin d'un état local pour basculer entre
// l'affichage du commentaire et son formulaire d'édition (react-hook-form).
"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { updateCommentAction } from "@/lib/actions/comments"
import { commentSchema, type CommentInput } from "@/lib/validations/comment"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import type { Comment } from "@/lib/types"

export function CommentEditForm({ comment }: { comment: Comment }) {
  const [isEditing, setIsEditing] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const form = useForm<CommentInput>({
    resolver: zodResolver(commentSchema),
    defaultValues: { content: comment.content },
  })

  function onSubmit(values: CommentInput) {
    setServerError(null)
    startTransition(async () => {
      const result = await updateCommentAction(
        comment.id,
        comment.feature_id,
        values
      )
      if (result?.error) {
        setServerError(result.error)
      } else {
        setIsEditing(false)
      }
    })
  }

  if (!isEditing) {
    return (
      <div className="space-y-1">
        <p className="whitespace-pre-wrap text-sm">{comment.content}</p>
        <Button variant="link" size="sm" className="h-auto p-0" onClick={() => setIsEditing(true)}>
          Modifier
        </Button>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {serverError && (
          <p className="text-destructive text-sm">{serverError}</p>
        )}
        <div className="flex gap-2">
          <Button type="submit" size="sm" disabled={isPending}>
            {isPending ? "Enregistrement..." : "Enregistrer"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(false)}
          >
            Annuler
          </Button>
        </div>
      </form>
    </Form>
  )
}
