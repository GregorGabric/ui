"use client"

import { type Icon } from "@tabler/icons-react"

import {
  SidebarSection,
  SidebarSectionGroup,
} from "@/registry/preskok/ui/preskok-ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}) {
  return (
    <SidebarSectionGroup>
      <SidebarSection>
        <div className="text-muted-foreground mb-2 px-2 text-xs font-semibold">
          Home
        </div>
        {items.map((item) => (
          <a
            key={item.title}
            href={item.url}
            className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center gap-2 rounded-md p-2"
          >
            {item.icon && <item.icon />}
            <span>{item.title}</span>
          </a>
        ))}
      </SidebarSection>
    </SidebarSectionGroup>
  )
}
