import { CommentItem } from "@/components/features/comment-item"
import type { CommentWithAuthor } from "@/lib/types"

export function CommentList({
  comments,
  currentUserId,
}: {
  comments: CommentWithAuthor[]
  currentUserId: string | null
}) {
  if (comments.length === 0) {
    return <p className="text-sm text-muted-foreground">Aucun commentaire pour le moment.</p>
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} currentUserId={currentUserId} />
      ))}
    </div>
  )
}
