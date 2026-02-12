"use client"

import {
  IconDots,
  IconFolder,
  IconShare3,
  IconTrash,
  type Icon,
} from "@tabler/icons-react"

import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from "@/registry/preskok/ui/preskok-ui/menu"
import {
  SidebarSection,
  SidebarSectionGroup,
  useSidebar,
} from "@/registry/preskok/ui/preskok-ui/sidebar"

export function NavDocuments({
  items,
}: {
  items: Array<{
    name: string
    url: string
    icon: Icon
  }>
}) {
  const { isMobile } = useSidebar()

  return (
    <SidebarSectionGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarSection>
        <div className="text-muted-foreground mb-2 px-2 text-xs font-semibold">
          Documents
        </div>
        {items.map((item) => (
          <div
            key={item.name}
            className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center gap-2 rounded-md p-2"
          >
            <a href={item.url} className="flex flex-1 items-center gap-2">
              <item.icon />
              <span>{item.name}</span>
            </a>
            <Menu>
              <MenuTrigger>
                <button className="hover:bg-accent data-[state=open]:bg-accent ml-auto rounded-sm p-1 opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100">
                  <IconDots />
                  <span className="sr-only">More</span>
                </button>
              </MenuTrigger>
              <MenuContent
                className="w-24 rounded-lg"
                placement={isMobile ? "bottom" : "right"}
                popover={{
                  crossOffset: isMobile ? 0 : undefined,
                }}
              >
                <MenuItem>
                  <IconFolder />
                  <span>Open</span>
                </MenuItem>
                <MenuItem>
                  <IconShare3 />
                  <span>Share</span>
                </MenuItem>
                <MenuSeparator />
                <MenuItem isDanger>
                  <IconTrash />
                  <span>Delete</span>
                </MenuItem>
              </MenuContent>
            </Menu>
          </div>
        ))}
        <button className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center gap-2 rounded-md p-2">
          <IconDots className="text-sidebar-foreground/70" />
          <span>More</span>
        </button>
      </SidebarSection>
    </SidebarSectionGroup>
  )
}
