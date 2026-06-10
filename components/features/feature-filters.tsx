// Composant client : les filtres réagissent aux interactions de l'utilisateur
// (Select, Calendar) et mettent à jour l'URL (useRouter / useSearchParams).
"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { CalendarIcon, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
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
import { STATUS_LABELS } from "@/components/features/status-badge"
import { PRIORITY_LABELS } from "@/components/features/priority-badge"
import { getProfileDisplayName } from "@/lib/utils"
import type { ProfileSummary } from "@/lib/types"

export function FeatureFilters({ profiles }: { profiles: ProfileSummary[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const status = searchParams.get("status") ?? "all"
  const priority = searchParams.get("priority") ?? "all"
  const assignee = searchParams.get("assignee") ?? "all"
  const due = searchParams.get("due")

  // Met à jour un paramètre de l'URL (ou le retire si on choisit "all"/null),
  // ce qui relance la requête côté serveur dans app/(app)/page.tsx.
  function setFilter(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString())
    if (value === null || value === "all") {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={status} onValueChange={(value) => setFilter("status", value)}>
        <SelectTrigger>
          <SelectValue>
            {(value: keyof typeof STATUS_LABELS | "all") =>
              value === "all" ? "Tous les statuts" : STATUS_LABELS[value]
            }
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les statuts</SelectItem>
          <SelectItem value="to_do">À faire</SelectItem>
          <SelectItem value="in_progress">En cours</SelectItem>
          <SelectItem value="done">Terminé</SelectItem>
        </SelectContent>
      </Select>

      <Select value={priority} onValueChange={(value) => setFilter("priority", value)}>
        <SelectTrigger>
          <SelectValue>
            {(value: keyof typeof PRIORITY_LABELS | "all") =>
              value === "all" ? "Toutes les priorités" : PRIORITY_LABELS[value]
            }
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes les priorités</SelectItem>
          <SelectItem value="low">Basse</SelectItem>
          <SelectItem value="medium">Moyenne</SelectItem>
          <SelectItem value="high">Haute</SelectItem>
        </SelectContent>
      </Select>

      <Select value={assignee} onValueChange={(value) => setFilter("assignee", value)}>
        <SelectTrigger>
          <SelectValue>
            {(value: string) => {
              if (value === "all") return "Tous les assignés"
              if (value === "unassigned") return "Non assigné"
              return getProfileDisplayName(profiles, value)
            }}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les assignés</SelectItem>
          <SelectItem value="unassigned">Non assigné</SelectItem>
          {profiles.map((profile) => (
            <SelectItem key={profile.id} value={profile.id}>
              {getProfileDisplayName(profiles, profile.id)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger
          render={
            <Button variant="outline">
              <CalendarIcon className="size-4" />
              {due ? new Date(due).toLocaleDateString("fr-FR") : "Échéance avant le..."}
            </Button>
          }
        />
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={due ? new Date(due) : undefined}
            onSelect={(date) =>
              setFilter("due", date ? date.toISOString().slice(0, 10) : null)
            }
          />
        </PopoverContent>
      </Popover>

      {due && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setFilter("due", null)}
          aria-label="Retirer le filtre d'échéance"
        >
          <X className="size-4" />
        </Button>
      )}
    </div>
  )
}
