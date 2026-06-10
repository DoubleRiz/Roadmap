import { redirect } from "next/navigation"

import { ProfileForm } from "@/components/profile/profile-form"
import { getCurrentProfile } from "@/lib/auth"

export default async function ProfilePage() {
  const profile = await getCurrentProfile()

  if (!profile) {
    redirect("/login")
  }

  return (
    <div className="max-w-md space-y-6">
      <h1 className="text-2xl font-semibold">Mon profil</h1>
      <ProfileForm profile={profile} />
    </div>
  )
}
