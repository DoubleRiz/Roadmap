import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import type { ProfileSummary } from "@/lib/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Nom + prénom du profil correspondant à `id` (ou son email à défaut),
// `null` si aucun profil ne correspond.
export function getProfileDisplayName(profiles: ProfileSummary[], id: string) {
  const profile = profiles.find((p) => p.id === id)
  if (!profile) return null
  return [profile.firstname, profile.lastname].filter(Boolean).join(" ") || profile.email
}
