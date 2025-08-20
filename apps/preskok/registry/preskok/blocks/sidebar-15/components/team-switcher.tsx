"use client"

import * as React from "react"
import { ChevronDown, Plus } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/registry/preskok/ui/dropdown-menu"
import {
  SidebarItem,
  SidebarLabel,
} from "@/registry/preskok/ui/preskok-ui/sidebar"

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string
    logo: React.ElementType
    plan: string
  }[]
}) {
  const [activeTeam, setActiveTeam] = React.useState(teams[0])

  if (!activeTeam) {
    return null
  }

  return (
    <SidebarItem>
      <DropdownMenu>
        <DropdownMenuTrigger className="group" data-slot="menu-trigger">
          <div
            className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-5 items-center justify-center rounded-md"
            data-slot="icon"
          >
            <activeTeam.logo className="size-3" />
          </div>
          <SidebarLabel className="truncate font-medium">
            {activeTeam.name}
          </SidebarLabel>
          <ChevronDown className="opacity-50" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-64 rounded-lg"
          align="start"
          side="bottom"
          sideOffset={4}
        >
          <DropdownMenuLabel className="text-muted-foreground text-xs">
            Teams
          </DropdownMenuLabel>
          {teams.map((team, index) => (
            <DropdownMenuItem
              key={team.name}
              onClick={() => setActiveTeam(team)}
              className="gap-2 p-2"
            >
              <div className="flex size-6 items-center justify-center rounded-xs border">
                <team.logo className="size-4 shrink-0" />
              </div>
              {team.name}
              <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem className="gap-2 p-2">
            <div className="bg-background flex size-6 items-center justify-center rounded-md border">
              <Plus className="size-4" />
            </div>
            <div className="text-muted-foreground font-medium">Add team</div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarItem>
  )
}
