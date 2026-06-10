import { notFound } from "next/navigation"

import { CommentForm } from "@/components/features/comment-form"
import { CommentList } from "@/components/features/comment-list"
import { FeatureDetailHeader } from "@/components/features/feature-detail-header"
import { getCurrentProfile } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import type { CommentWithAuthor, FeatureWithAssignee } from "@/lib/types"

export default async function FeatureDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const featureId = Number(id)
  const supabase = await createClient()
  const profile = await getCurrentProfile()

  const { data: feature } = await supabase
    .from("features")
    .select("*, profiles(id, firstname, lastname, email, photo)")
    .eq("id", featureId)
    .single()

  if (!feature) {
    notFound()
  }

  const { data: comments } = await supabase
    .from("comments")
    .select("*, profiles(id, firstname, lastname, email, photo)")
    .eq("feature_id", featureId)
    .order("created_at", { ascending: true })

  const canManage = profile?.role === "admin" || feature.user_id === profile?.id

  return (
    <div className="space-y-8">
      <FeatureDetailHeader
        feature={feature as unknown as FeatureWithAssignee}
        canManage={canManage}
      />

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Commentaires</h2>
        <CommentList
          comments={(comments ?? []) as unknown as CommentWithAuthor[]}
          currentUserId={profile?.id ?? null}
        />
        <CommentForm featureId={feature.id} />
      </div>
    </div>
  )
}
