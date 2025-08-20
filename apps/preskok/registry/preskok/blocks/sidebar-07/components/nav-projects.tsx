"use client"

import {
  Folder,
  Forward,
  MoreHorizontal,
  Trash2,
  type LucideIcon,
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

export function NavProjects({
  projects,
}: {
  projects: {
    name: string
    url: string
    icon: LucideIcon
  }[]
}) {
  const { isMobile } = useSidebar()

  return (
    <SidebarSectionGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarSection label="Projects">
        {projects.map((item) => (
          <SidebarItem key={item.name}>
            <SidebarLink href={item.url}>
              <item.icon />
              <SidebarLabel>{item.name}</SidebarLabel>
            </SidebarLink>
            <DropdownMenu>
              <DropdownMenuTrigger data-slot="menu-trigger">
                <MoreHorizontal />
                <span className="sr-only">More</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem>
                  <Folder className="text-muted-foreground" />
                  <span>View Project</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Forward className="text-muted-foreground" />
                  <span>Share Project</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete Project</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarItem>
        ))}
        <SidebarItem>
          <SidebarLink className="text-sidebar-foreground/70">
            <MoreHorizontal className="text-sidebar-foreground/70" />
            <SidebarLabel>More</SidebarLabel>
          </SidebarLink>
        </SidebarItem>
      </SidebarSection>
    </SidebarSectionGroup>
  )
}
