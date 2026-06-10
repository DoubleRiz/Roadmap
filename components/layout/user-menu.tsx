// Composant client : le menu déroulant (DropdownMenu) a besoin
// d'interactivité pour s'ouvrir/se fermer au clic, et la déconnexion
// a besoin de useTransition pour appeler la Server Action.
"use client"

import { useTransition } from "react"
import Link from "next/link"
import { LogOut, User } from "lucide-react"
import { logoutAction } from "@/lib/actions/auth"
import type { Profile } from "@/lib/types"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function UserMenu({ profile }: { profile: Profile }) {
  const [, startTransition] = useTransition()

  const displayName =
    [profile.firstname, profile.lastname].filter(Boolean).join(" ") ||
    profile.email

  // Initiales utilisées si aucune photo n'est définie.
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" className="h-9 w-9 rounded-full p-0">
            <Avatar>
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-col">
            <span className="font-medium">{displayName}</span>
            <span className="text-muted-foreground text-xs font-normal">
              {profile.email}
            </span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem render={<Link href="/profile" />}>
            <User className="mr-2 size-4" />
            Profil
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => startTransition(() => logoutAction())}
          >
            <LogOut className="mr-2 size-4" />
            Se déconnecter
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
