"use client"

import {
  FolderIcon,
  MoreHorizontalIcon,
  Share2Icon,
  TrashIcon,
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

export function NavDocuments({
  items,
}: {
  items: {
    name: string
    url: string
    icon: LucideIcon
  }[]
}) {
  const { isMobile } = useSidebar()

  return (
    <SidebarSectionGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarSection label="Documents">
        {items.map((item) => (
          <SidebarItem key={item.name}>
            <SidebarLink href={item.url}>
              <item.icon className="size-4" />
              <SidebarLabel>{item.name}</SidebarLabel>
            </SidebarLink>
            <DropdownMenu>
              <DropdownMenuTrigger data-slot="menu-trigger">
                <MoreHorizontalIcon className="size-4" />
                <span className="sr-only">More</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-24 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem>
                  <FolderIcon className="size-4" />
                  <span>Open</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share2Icon className="size-4" />
                  <span>Share</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                  <TrashIcon className="size-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarItem>
        ))}
        <SidebarItem>
          <SidebarLink className="text-sidebar-foreground/70">
            <MoreHorizontalIcon className="text-sidebar-foreground/70 size-4" />
            <SidebarLabel>More</SidebarLabel>
          </SidebarLink>
        </SidebarItem>
      </SidebarSection>
    </SidebarSectionGroup>
  )
}
