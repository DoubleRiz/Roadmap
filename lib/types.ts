import type { Tables } from "@/lib/supabase/database.types"

// Alias directs vers les types générés à partir du schéma Supabase.
export type Profile = Tables<"profiles">
export type Feature = Tables<"features">
export type Comment = Tables<"comments">
export type Notification = Tables<"notifications">
export type Sprint = Tables<"sprints">

// Valeurs possibles pour les colonnes contraintes par un CHECK en base.
export type FeatureStatus = "to_do" | "in_progress" | "done"
export type FeaturePriority = "low" | "medium" | "high"
export type ProfileRole = "admin" | "user"
export type NotificationType = "new_comment" | "feature_assigned"
export type SprintStatus = "planned" | "active" | "completed"

// Profil "résumé" utilisé pour afficher un avatar + un nom (ex: assigné, auteur).
export type ProfileSummary = Pick<
  Profile,
  "id" | "firstname" | "lastname" | "email" | "photo"
>

// Un sprint "résumé" utilisé pour afficher le badge/lien sur une feature.
export type SprintSummary = Pick<Sprint, "id" | "name" | "status">

// Une feature avec le profil de la personne assignée (jointure profiles) et
// son sprint (jointure sprints).
export type FeatureWithAssignee = Feature & {
  profiles: ProfileSummary | null
  sprints?: SprintSummary | null
}

// Un sprint avec le nombre de features qui lui sont associées.
export type SprintWithFeatureCount = Sprint & {
  features: { count: number }[]
}

// Un commentaire avec le profil de son auteur (jointure profiles).
export type CommentWithAuthor = Comment & {
  profiles: ProfileSummary | null
}

// Une notification avec le titre de la feature concernée (jointure features).
export type NotificationWithFeature = Notification & {
  features: Pick<Feature, "id" | "title"> | null
}
