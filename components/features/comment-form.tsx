// Composant client : on a besoin de react-hook-form pour gérer la saisie
// et réinitialiser le champ une fois le commentaire envoyé.
"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { addCommentAction } from "@/lib/actions/comments"
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

export function CommentForm({ featureId }: { featureId: number }) {
  const [serverError, setServerError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const form = useForm<CommentInput>({
    resolver: zodResolver(commentSchema),
    defaultValues: { content: "" },
  })

  function onSubmit(values: CommentInput) {
    setServerError(null)
    startTransition(async () => {
      const result = await addCommentAction(featureId, values)
      if (result?.error) {
        setServerError(result.error)
      } else {
        form.reset({ content: "" })
      }
    })
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
                <Textarea
                  placeholder="Ajouter un commentaire..."
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {serverError && (
          <p className="text-destructive text-sm">{serverError}</p>
        )}
        <Button type="submit" disabled={isPending}>
          {isPending ? "Envoi..." : "Commenter"}
        </Button>
      </form>
    </Form>
  )
}
