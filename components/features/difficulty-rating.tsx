"use client"

import { StarIcon } from "lucide-react"

import { cn } from "@/lib/utils"

// La difficulté est une note sur 5, affichée sous forme d'étoiles.
export const MAX_DIFFICULTY = 5

const STARS = Array.from({ length: MAX_DIFFICULTY }, (_, index) => index + 1)

// Champ de saisie interactif (formulaire de création / édition).
// `value` est "" (aucune note) ou un chiffre de "1" à "5".
export function DifficultyRatingInput({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const selected = value === "" ? 0 : Number(value)

  return (
    <div className="flex items-center gap-1">
      {STARS.map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star === selected ? "" : String(star))}
          aria-label={`Difficulté : ${star}`}
          aria-pressed={star <= selected}
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          <StarIcon
            className={cn("size-5", star <= selected && "fill-current text-foreground")}
          />
        </button>
      ))}
    </div>
  )
}

// Affichage en lecture seule (détail d'une feature).
export function DifficultyStars({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`Difficulté : ${value} sur ${MAX_DIFFICULTY}`}>
      {STARS.map((star) => (
        <StarIcon
          key={star}
          className={cn(
            "size-4",
            star <= value ? "fill-current text-foreground" : "text-muted-foreground"
          )}
        />
      ))}
    </div>
  )
}
