// Composant client : react-hook-form gère la saisie, et Select/Popover/Calendar
// (shadcn) ont besoin d'interactivité pour s'ouvrir et se fermer.
"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon } from "lucide-react"

import { createSprintAction, updateSprintAction } from "@/lib/actions/sprints"
import { sprintSchema, type SprintFormValues } from "@/lib/validations/sprint"
import type { Sprint } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { SPRINT_STATUS_LABELS } from "@/components/sprints/sprint-status-badge"
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

export function SprintForm({
  mode,
  sprint,
}: {
  mode: "create" | "edit"
  sprint?: Sprint
}) {
  const [serverError, setServerError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const form = useForm<SprintFormValues>({
    resolver: zodResolver(sprintSchema),
    defaultValues: {
      name: sprint?.name ?? "",
      description: sprint?.description ?? "",
      start_date: sprint?.start_date ?? "",
      end_date: sprint?.end_date ?? "",
      status: (sprint?.status as SprintFormValues["status"]) ?? "planned",
    },
  })

  function onSubmit(values: SprintFormValues) {
    setServerError(null)
    startTransition(async () => {
      const result =
        mode === "create"
          ? await createSprintAction(values)
          : await updateSprintAction(sprint!.id, values)

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
          name="name"
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
            name="start_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date de début</FormLabel>
                <Popover>
                  <PopoverTrigger
                    render={
                      <Button variant="outline" className="justify-start font-normal">
                        <CalendarIcon className="size-4" />
                        {field.value
                          ? new Date(field.value).toLocaleDateString("fr-FR")
                          : "Choisir une date"}
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
            name="end_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date de fin</FormLabel>
                <Popover>
                  <PopoverTrigger
                    render={
                      <Button variant="outline" className="justify-start font-normal">
                        <CalendarIcon className="size-4" />
                        {field.value
                          ? new Date(field.value).toLocaleDateString("fr-FR")
                          : "Choisir une date"}
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
        </div>

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
                      {(value: keyof typeof SPRINT_STATUS_LABELS) =>
                        SPRINT_STATUS_LABELS[value]
                      }
                    </SelectValue>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="planned">À venir</SelectItem>
                  <SelectItem value="active">En cours</SelectItem>
                  <SelectItem value="completed">Terminé</SelectItem>
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
              ? "Créer le sprint"
              : "Enregistrer les modifications"}
        </Button>
      </form>
    </Form>
  )
}
