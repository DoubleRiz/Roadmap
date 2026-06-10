import { redirect } from "next/navigation"
import { getCurrentProfile } from "@/lib/auth"
import { Header } from "@/components/layout/header"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const profile = await getCurrentProfile()

  // Le middleware redirige déjà les utilisateurs non connectés, mais on
  // vérifie aussi ici car le profil est nécessaire pour afficher le header.
  if (!profile) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-svh flex-col">
      <Header profile={profile} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        {children}
      </main>
    </div>
  )
}
