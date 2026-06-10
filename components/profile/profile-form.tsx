// Composant client : react-hook-form gère la saisie et l'affichage
// du message de succès/erreur après l'appel à la Server Action.
"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { updateProfileAction } from "@/lib/actions/profile"
import { profileSchema, type ProfileFormValues } from "@/lib/validations/profile"
import type { Profile } from "@/lib/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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

export function ProfileForm({ profile }: { profile: Profile }) {
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstname: profile.firstname ?? "",
      lastname: profile.lastname ?? "",
      photo: profile.photo ?? "",
    },
  })

  const displayName =
    [profile.firstname, profile.lastname].filter(Boolean).join(" ") ||
    profile.email

  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const photoValue = form.watch("photo")

  function onSubmit(values: ProfileFormValues) {
    setServerError(null)
    setSuccess(false)
    startTransition(async () => {
      const result = await updateProfileAction(values)

      if (result?.error) {
        setServerError(result.error)
      } else {
        setSuccess(true)
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex items-center gap-4">
          <Avatar size="lg">
            {photoValue && <AvatarImage src={photoValue} alt={displayName} />}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="text-sm text-muted-foreground">{profile.email}</div>
        </div>

        <FormField
          control={form.control}
          name="firstname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prénom</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="photo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Photo (URL)</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {serverError && <p className="text-destructive text-sm">{serverError}</p>}
        {success && (
          <p className="text-sm text-muted-foreground">Profil mis à jour.</p>
        )}

        <Button type="submit" disabled={isPending}>
          {isPending ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </form>
    </Form>
  )
}
