// Composant client : react-hook-form gère la saisie, et Select/Popover/Calendar
// (shadcn) ont besoin d'interactivité pour s'ouvrir et se fermer.
"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon } from "lucide-react"

import { createFeatureAction, updateFeatureAction } from "@/lib/actions/features"
import { featureSchema, type FeatureFormValues } from "@/lib/validations/feature"
import type { Feature, ProfileSummary, Sprint } from "@/lib/types"
import { getProfileDisplayName } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { DifficultyRatingInput, MAX_DIFFICULTY } from "@/components/features/difficulty-rating"
import { STATUS_LABELS } from "@/components/features/status-badge"
import { PRIORITY_LABELS } from "@/components/features/priority-badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

export function FeatureForm({
  mode,
  feature,
  profiles,
  sprints,
}: {
  mode: "create" | "edit"
  feature?: Feature
  profiles: ProfileSummary[]
  sprints: Sprint[]
}) {
  const [serverError, setServerError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const form = useForm<FeatureFormValues>({
    resolver: zodResolver(featureSchema),
    defaultValues: {
      title: feature?.title ?? "",
      description: feature?.description ?? "",
      status: (feature?.status as FeatureFormValues["status"]) ?? "to_do",
      priority: (feature?.priority as FeatureFormValues["priority"]) ?? "medium",
      due_date: feature?.due_date ?? "",
      difficulty:
        feature?.difficulty != null
          ? String(Math.min(feature.difficulty, MAX_DIFFICULTY))
          : "",
      user_id: feature?.user_id ?? "unassigned",
      sprint_id: feature?.sprint_id != null ? String(feature.sprint_id) : "none",
    },
  })

  function onSubmit(values: FeatureFormValues) {
    setServerError(null)
    startTransition(async () => {
      const result =
        mode === "create"
          ? await createFeatureAction(values)
          : await updateFeatureAction(feature!.id, values)

      if (result?.error) {
        setServerError(result.error)
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea rows={4} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Statut</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue>
                        {(value: keyof typeof STATUS_LABELS) => STATUS_LABELS[value]}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="to_do">À faire</SelectItem>
                    <SelectItem value="in_progress">En cours</SelectItem>
                    <SelectItem value="done">Terminé</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priorité</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue>
                        {(value: keyof typeof PRIORITY_LABELS) => PRIORITY_LABELS[value]}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Basse</SelectItem>
                    <SelectItem value="medium">Moyenne</SelectItem>
                    <SelectItem value="high">Haute</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="due_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Échéance</FormLabel>
                <Popover>
                  <PopoverTrigger
                    render={
                      <Button variant="outline" className="justify-start font-normal">
                        <CalendarIcon className="size-4" />
                        {field.value
                          ? new Date(field.value).toLocaleDateString("fr-FR")
                          : "Aucune échéance"}
                      </Button>
                    }
                  />
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) =>
                        field.onChange(date ? date.toISOString().slice(0, 10) : "")
                      }
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="difficulty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Difficulté</FormLabel>
                <FormControl>
                  <DifficultyRatingInput value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="user_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assigné à</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue>
                      {(value: string) =>
                        value === "unassigned"
                          ? "Non assigné"
                          : getProfileDisplayName(profiles, value)
                      }
                    </SelectValue>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="unassigned">Non assigné</SelectItem>
                  {profiles.map((profile) => (
                    <SelectItem key={profile.id} value={profile.id}>
                      {getProfileDisplayName(profiles, profile.id)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sprint_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sprint</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue>
                      {(value: string) => {
                        if (value === "none") return "Aucun sprint"
                        return (
                          sprints.find((sprint) => String(sprint.id) === value)?.name ??
                          "Aucun sprint"
                        )
                      }}
                    </SelectValue>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">Aucun sprint</SelectItem>
                  {sprints.map((sprint) => (
                    <SelectItem key={sprint.id} value={String(sprint.id)}>
                      {sprint.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {serverError && <p className="text-destructive text-sm">{serverError}</p>}

        <Button type="submit" disabled={isPending}>
          {isPending
            ? "Enregistrement..."
            : mode === "create"
              ? "Créer la feature"
              : "Enregistrer les modifications"}
        </Button>
      </form>
    </Form>
  )
}
