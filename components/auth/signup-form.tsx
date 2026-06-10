// Composant client : on a besoin de react-hook-form (gestion du formulaire,
// affichage des erreurs en direct) et de useState pour l'erreur serveur.
"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { signupAction } from "@/lib/actions/auth"
import { signupSchema, type SignupInput } from "@/lib/validations/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

export function SignupForm() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  })

  function onSubmit(values: SignupInput) {
    setServerError(null)
    setSuccessMessage(null)
    startTransition(async () => {
      const result = await signupAction(values)
      if (result?.error) {
        setServerError(result.error)
      } else if (result?.message) {
        setSuccessMessage(result.message)
      }
    })
  }

  // Une fois l'inscription confirmée par email, on n'affiche plus le
  // formulaire : juste le message indiquant de vérifier sa boîte mail.
  if (successMessage) {
    return <p className="text-sm">{successMessage}</p>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="vous@exemple.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mot de passe</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmer le mot de passe</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {serverError && (
          <p className="text-destructive text-sm">{serverError}</p>
        )}
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Création du compte..." : "Créer un compte"}
        </Button>
      </form>
    </Form>
  )
}
