"use client"

import {
  IconDots,
  IconFolder,
  IconShare3,
  IconTrash,
  type Icon,
} from "@tabler/icons-react"

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

export function NavDocuments({
  items,
}: {
  items: {
    name: string
    url: string
    icon: Icon
  }[]
}) {
  const { isMobile } = useSidebar()

  return (
    <SidebarSectionGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarSection label="Documents">
        {items.map((item) => (
          <SidebarItem key={item.name}>
            <SidebarLink href={item.url}>
              <item.icon />
              <SidebarLabel>{item.name}</SidebarLabel>
            </SidebarLink>
            <DropdownMenu>
              <DropdownMenuTrigger data-slot="menu-trigger">
                <IconDots />
                <span className="sr-only">More</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-24 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem>
                  <IconFolder />
                  <span>Open</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconShare3 />
                  <span>Share</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                  <IconTrash />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarItem>
        ))}
        <SidebarItem>
          <SidebarLink className="text-sidebar-foreground/70">
            <IconDots className="text-sidebar-foreground/70" />
            <SidebarLabel>More</SidebarLabel>
          </SidebarLink>
        </SidebarItem>
      </SidebarSection>
    </SidebarSectionGroup>
  )
}
