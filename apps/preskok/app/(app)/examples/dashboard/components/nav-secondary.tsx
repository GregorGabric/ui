"use client"

import * as React from "react"
import { type Icon } from "@tabler/icons-react"

import {
  SidebarSection,
  SidebarSectionGroup,
} from "@/registry/preskok/ui/preskok-ui/sidebar"

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string
    url: string
    icon: Icon
  }[]
} & React.ComponentPropsWithoutRef<"div">) {
  return (
    <SidebarSectionGroup {...props}>
      <SidebarSection>
        {items.map((item) => (
          <a
            key={item.title}
            href={item.url}
            className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center gap-2 rounded-md p-2"
          >
            <item.icon />
            <span>{item.title}</span>
          </a>
        ))}
      </SidebarSection>
    </SidebarSectionGroup>
  )
}
