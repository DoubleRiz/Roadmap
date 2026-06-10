import type { Tables } from "@/lib/supabase/database.types"

// Alias directs vers les types générés à partir du schéma Supabase.
export type Profile = Tables<"profiles">
export type Feature = Tables<"features">
export type Comment = Tables<"comments">
export type Notification = Tables<"notifications">

// Valeurs possibles pour les colonnes contraintes par un CHECK en base.
export type FeatureStatus = "to_do" | "in_progress" | "done"
export type FeaturePriority = "low" | "medium" | "high"
export type ProfileRole = "admin" | "user"
export type NotificationType = "new_comment" | "feature_assigned"

// Profil "résumé" utilisé pour afficher un avatar + un nom (ex: assigné, auteur).
export type ProfileSummary = Pick<
  Profile,
  "id" | "firstname" | "lastname" | "email" | "photo"
>

// Une feature avec le profil de la personne assignée (jointure profiles).
export type FeatureWithAssignee = Feature & {
  profiles: ProfileSummary | null
}

// Un commentaire avec le profil de son auteur (jointure profiles).
export type CommentWithAuthor = Comment & {
  profiles: ProfileSummary | null
}

// Une notification avec le titre de la feature concernée (jointure features).
export type NotificationWithFeature = Notification & {
  features: Pick<Feature, "id" | "title"> | null
}
