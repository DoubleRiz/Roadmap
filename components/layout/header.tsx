import Link from "next/link"
import { Bell } from "lucide-react"
import type { Profile } from "@/lib/types"
import { NotificationsBadge } from "@/components/layout/notifications-badge"
import { UserMenu } from "@/components/layout/user-menu"

export function Header({ profile }: { profile: Profile }) {
  return (
    <header className="border-b">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="font-semibold">
          Roadmap
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Features
          </Link>
          <Link
            href="/sprints"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Sprints
          </Link>
          <Link
            href="/notifications"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <Bell className="size-4" />
            Notifications
            <NotificationsBadge />
          </Link>
          <UserMenu profile={profile} />
        </nav>
      </div>
    </header>
  )
}
