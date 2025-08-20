"use client"

import {
  ArrowUpRight,
  Link,
  MoreHorizontal,
  StarOff,
  Trash2,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/preskok/ui/dropdown-menu"
import {
  SidebarItem,
  SidebarLabel,
  SidebarLink,
  SidebarSection,
  SidebarSectionGroup,
  useSidebar,
} from "@/registry/preskok/ui/preskok-ui/sidebar"

export function NavFavorites({
  favorites,
}: {
  favorites: {
    name: string
    url: string
    emoji: string
  }[]
}) {
  const { isMobile } = useSidebar()

  return (
    <SidebarSectionGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarSection label="Favorites">
        {favorites.map((item) => (
          <SidebarItem key={item.name}>
            <SidebarLink href={item.url} title={item.name}>
              <span>{item.emoji}</span>
              <SidebarLabel>{item.name}</SidebarLabel>
            </SidebarLink>
            <DropdownMenu>
              <DropdownMenuTrigger data-slot="menu-trigger">
                <MoreHorizontal />
                <span className="sr-only">More</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem>
                  <StarOff className="text-muted-foreground" />
                  <span>Remove from Favorites</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link className="text-muted-foreground" />
                  <span>Copy Link</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ArrowUpRight className="text-muted-foreground" />
                  <span>Open in New Tab</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarItem>
        ))}
        <SidebarItem>
          <SidebarLink className="text-sidebar-foreground/70">
            <MoreHorizontal />
            <SidebarLabel>More</SidebarLabel>
          </SidebarLink>
        </SidebarItem>
      </SidebarSection>
    </SidebarSectionGroup>
  )
}
