import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CommentEditForm } from "@/components/features/comment-edit-form"
import type { CommentWithAuthor } from "@/lib/types"

// Formate une date ISO en "12 juin 2026 à 14:30".
function formatDateTime(value: string) {
  return new Date(value).toLocaleString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function getInitials(profile: CommentWithAuthor["profiles"]) {
  if (!profile) return "?"
  const fromName = [profile.firstname, profile.lastname]
    .filter(Boolean)
    .map((part) => part![0])
    .join("")
  if (fromName) return fromName.toUpperCase()
  return profile.email[0]?.toUpperCase() ?? "?"
}

function getDisplayName(profile: CommentWithAuthor["profiles"]) {
  if (!profile) return "Utilisateur supprimé"
  return [profile.firstname, profile.lastname].filter(Boolean).join(" ") || profile.email
}

export function CommentItem({
  comment,
  currentUserId,
}: {
  comment: CommentWithAuthor
  currentUserId: string | null
}) {
  const isAuthor = comment.user_id === currentUserId

  return (
    <div className="flex gap-3">
      <Avatar size="sm">
        <AvatarFallback>{getInitials(comment.profiles)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium">{getDisplayName(comment.profiles)}</span>
          <span className="text-xs text-muted-foreground">
            {formatDateTime(comment.created_at)}
          </span>
        </div>
        {isAuthor ? (
          <CommentEditForm comment={comment} />
        ) : (
          <p className="whitespace-pre-wrap text-sm">{comment.content}</p>
        )}
      </div>
    </div>
  )
}
